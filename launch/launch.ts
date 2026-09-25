/**
 * Launch SCAM through PumpPortal Lightning `create`. Review all amounts and wallet settings before broadcasting.
 *   npx tsx launch.ts --dev-buy 0.01 --dry-run
 *   npx tsx launch.ts --dev-buy 0.01 --confirm LAUNCH
 * env: PUMPFUN_API_KEY (required) · PINATA_JWT (optional) · SITE_URL (default https://scam-museum-snowy.vercel.app)
 */
import { createHash, generateKeyPairSync } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const args = Object.fromEntries(process.argv.slice(2).map((a, i, xs) => a.startsWith("--") ? [a.slice(2), xs[i + 1]?.startsWith("--") || xs[i + 1] === undefined ? "true" : xs[i + 1]] : []).filter((x) => x.length));
const SITE = process.env.SITE_URL ?? "https://scam-museum-snowy.vercel.app";
const MAX_DEV_BUY = 0.05;
const devBuy = Math.max(0, Math.min(MAX_DEV_BUY, Number(args["dev-buy"] ?? 0.01)));
const dry = args["dry-run"] === "true";
const confirm = args["confirm"];

const B58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
function base58(bytes: Uint8Array): string { let z = 0; while (z < bytes.length && bytes[z] === 0) z++; const d: number[] = []; for (const b of bytes) { let c = b; for (let i = 0; i < d.length; i++) { c += d[i] << 8; d[i] = c % 58; c = (c / 58) | 0; } while (c > 0) { d.push(c % 58); c = (c / 58) | 0; } } return "1".repeat(z) + d.reverse().map((x) => B58[x]).join(""); }
function keypair() { const { privateKey, publicKey } = generateKeyPairSync("ed25519"); const p = privateKey.export({ format: "der", type: "pkcs8" }) as Buffer, s = publicKey.export({ format: "der", type: "spki" }) as Buffer; const seed = p.subarray(p.length - 32), pub = s.subarray(s.length - 32); return { publicKey: base58(pub), secretKeyB58: base58(Buffer.concat([seed, pub])) }; }
function grind(maxMs: number) { const t0 = Date.now(); let n = 0; for (;;) { const k = keypair(); n++; if (k.publicKey.endsWith("pump") || Date.now() - t0 > maxMs) return { ...k, tries: n }; } }

const meta = JSON.parse(readFileSync(new URL("../site/metadata.json", import.meta.url), "utf-8")) as Record<string, unknown>;
meta.image = `${SITE}/assets/scam.png`; meta.website = SITE;

async function metadataUri(): Promise<string> {
  if (!process.env.PINATA_JWT) return `${SITE}/metadata.json`;
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${process.env.PINATA_JWT}` }, body: JSON.stringify({ pinataContent: meta, pinataMetadata: { name: "SCAM-metadata.json" } }) });
  if (!res.ok) throw new Error(`pinata ${res.status}: ${await res.text()}`);
  return `https://ipfs.io/ipfs/${((await res.json()) as { IpfsHash: string }).IpfsHash}`;
}

(async () => {
  const key = process.env.PUMPFUN_API_KEY;
  if (!key && !dry) throw new Error("PUMPFUN_API_KEY is required");
  const uri = dry ? `${SITE}/metadata.json (dry)` : await metadataUri();
  const kp = grind(20_000);
  const body = { action: "create", tokenMetadata: { name: meta.name, symbol: meta.symbol, uri }, mint: kp.secretKeyB58, denominatedInSol: "true", amount: devBuy, slippage: 10, priorityFee: 0.0005, pool: "pump" };
  console.log("mint:", kp.publicKey, `(grind tries ${kp.tries})`, "\ndev buy:", devBuy, "SOL\nuri:", uri, "\nmetadata:", JSON.stringify(meta, null, 1));
  if (dry) { console.log("\n[dry-run] Nothing was sent to the blockchain"); return; }
  if (confirm !== "LAUNCH") { console.log("\nTo launch, pass --confirm LAUNCH"); return; }
  const res = await fetch(`https://pumpportal.fun/api/trade?api-key=${encodeURIComponent(key!)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const text = await res.text(); let j: { signature?: string } = {}; try { j = JSON.parse(text); } catch { /* */ }
  if (!res.ok || !j.signature) throw new Error(`pumpportal ${res.status}: ${text.slice(0, 300)}`);
  const rec = { mint: kp.publicKey, signature: j.signature, ts: new Date().toISOString(), devBuySol: devBuy, uri, feeWallet: process.env.FEE_WALLET ?? null, sha256OfMetadata: createHash("sha256").update(JSON.stringify(meta)).digest("hex") };
  writeFileSync(new URL("../site/launch.json", import.meta.url), JSON.stringify(rec, null, 1));
  console.log("\nLAUNCHED", rec, "\nhttps://pump.fun/coin/" + rec.mint, "\nhttps://solscan.io/tx/" + rec.signature, "\n→ Review site/launch.json and burn the launch buy with burn.ts if intended.");
})().catch((e) => { console.error(e.message); process.exit(1); });
