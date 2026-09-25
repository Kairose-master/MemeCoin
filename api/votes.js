const { labels, getMint, storeConfig, redis, digest, utcDay, pumpCoin, readTally } = require("../lib/vote-store");

const voteScript = [
  "if redis.call('EXISTS',KEYS[1]) == 1 then return {0,0} end",
  "redis.call('SET',KEYS[1],'1','EX',2592000,'NX')",
  "redis.call('HINCRBY',KEYS[2],ARGV[1],1)",
  "redis.call('EXPIRE',KEYS[2],3456000)",
  "return {1,0}",
].join("\n");

const dailyRateScript = [
  "local count=redis.call('INCR',KEYS[1])",
  "if count == 1 then redis.call('EXPIRE',KEYS[1],86400) end",
  "return count",
].join("\n");
const readRateScript = [
  "local count=redis.call('INCR',KEYS[1])",
  "if count == 1 then redis.call('EXPIRE',KEYS[1],60) end",
  "return count",
].join("\n");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  const mint = getMint(req.method === "GET" ? req.query.mint : req.body?.mint);
  if (!mint) return res.status(400).json({ error: "Enter a valid Solana mint address." });

  const config = storeConfig();
  if (!config) return res.status(503).json({ error: "Community voting is not configured yet." });

  if (req.method === "GET") {
    const voterId = typeof req.query.voterId === "string" && /^[a-f0-9-]{36}$/i.test(req.query.voterId) ? req.query.voterId : null;
    try {
      const ip = req.headers["x-real-ip"] || req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";
      const readCount = await redis(config, ["EVAL", readRateScript, 1, `scam-vote:read-rate:${digest(config.secret, ip)}:${utcDay()}`]);
      if (Number(readCount) > 60) return res.status(429).json({ error: "Too many requests. Wait a minute and try again." });
      return res.status(200).json(await readTally(config, mint, voterId));
    }
    catch { return res.status(503).json({ error: "Vote totals are temporarily unavailable." }); }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try { if (new URL(origin).host !== host) return res.status(403).json({ error: "Cross-site voting is not allowed." }); }
    catch { return res.status(403).json({ error: "Invalid request origin." }); }
  }

  const vote = req.body?.vote;
  const voterId = req.body?.voterId;
  if (!labels.includes(vote)) return res.status(400).json({ error: "Choose one of the available options." });
  if (typeof voterId !== "string" || !/^[a-f0-9-]{36}$/i.test(voterId)) return res.status(400).json({ error: "Could not create a local anonymous voter ID." });

  const forwardedIp = req.headers["x-real-ip"] || req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";
  const voterKey = `scam-vote:voter:${mint}:${digest(config.secret, voterId)}`;
  const rateKey = `scam-vote:rate:${digest(config.secret, forwardedIp)}`;
  const dailyKey = `scam-vote:day:${mint}:${utcDay()}`;

  try {
    const rate = await redis(config, ["EVAL", dailyRateScript, 1, rateKey]);
    if (Number(rate) > 12) return res.status(429).json({ error: "Daily vote limit reached. Please try again tomorrow." });
    if (!await pumpCoin(mint)) return res.status(404).json({ error: "This mint is not listed as a Pump.fun coin." });
    const outcome = await redis(config, ["EVAL", voteScript, 2, voterKey, dailyKey, vote]);
    const tally = await readTally(config, mint, voterId);
    if (Number(outcome?.[0]) === 0) return res.status(409).json({ ...tally, error: "This browser has already voted on this coin in the last 30 days." });
    return res.status(201).json({ ...tally, message: "Vote counted. One vote per browser every 30 days." });
  } catch {
    return res.status(503).json({ error: "Vote could not be saved. Please try again shortly." });
  }
};
