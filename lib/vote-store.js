const crypto = require("node:crypto");

const labels = ["concern", "unclear", "no_concern"];
const base58 = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

function getMint(value) {
  return typeof value === "string" && base58.test(value) ? value : null;
}

function storeConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  const secret = process.env.VOTE_HASH_SECRET || token;
  if (!url || !token || !secret || secret.length < 32) return null;
  return { url: url.replace(/\/$/, ""), token, secret };
}

async function redis(config, command) {
  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!response.ok) throw new Error(`Vote store returned HTTP ${response.status}`);
  const payload = await response.json();
  if (payload.error) throw new Error("Vote store command failed");
  return payload.result;
}

function digest(secret, value) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function utcDay(offset = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - offset);
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

async function pumpCoin(mint) {
  const response = await fetch(`https://frontend-api-v3.pump.fun/coins-v2/${encodeURIComponent(mint)}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Pump.fun coin lookup returned HTTP ${response.status}`);
  const raw = await response.json();
  const coin = Array.isArray(raw) ? raw[0] : raw?.coin || raw?.data || raw;
  return coin && coin.mint === mint ? coin : null;
}

async function readTally(config, mint, voterId) {
  const days = Array.from({ length: 30 }, (_, i) => `scam-vote:day:${mint}:${utcDay(i)}`);
  const voterKey = voterId ? `scam-vote:voter:${mint}:${digest(config.secret, voterId)}` : null;
  const script = [
    "local totals={0,0,0}",
    "local fields={'concern','unclear','no_concern'}",
    "for i,key in ipairs(KEYS) do",
    "  for j,field in ipairs(fields) do totals[j]=totals[j]+(tonumber(redis.call('HGET',key,field)) or 0) end",
    "end",
    "local voted=0",
    "if ARGV[1] and ARGV[1] ~= '' and redis.call('EXISTS',ARGV[1]) == 1 then voted=1 end",
    "return {totals[1],totals[2],totals[3],voted}",
  ].join("\n");
  const result = await redis(config, ["EVAL", script, days.length, ...days, voterKey || ""]);
  return {
    concern: Number(result?.[0] || 0),
    unclear: Number(result?.[1] || 0),
    no_concern: Number(result?.[2] || 0),
    alreadyVoted: Number(result?.[3] || 0) === 1,
    windowDays: 30,
  };
}

module.exports = { labels, getMint, storeConfig, redis, digest, utcDay, pumpCoin, readTally };
