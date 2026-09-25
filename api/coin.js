const { getMint, pumpCoin } = require("../lib/vote-store");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const mint = getMint(req.query.mint);
  if (!mint) return res.status(400).json({ error: "Enter a valid Solana mint address." });

  try {
    const coin = await pumpCoin(mint);
    if (!coin) return res.status(404).json({ error: "Pump.fun did not find a coin for that address." });
    return res.status(200).json({
      mint,
      name: String(coin.name || "Unknown token").slice(0, 100),
      symbol: String(coin.symbol || "").slice(0, 24),
      image: typeof coin.image_uri === "string" && coin.image_uri.startsWith("https://") ? coin.image_uri : null,
      pumpUrl: `https://pump.fun/coin/${mint}`,
    });
  } catch {
    return res.status(502).json({ error: "Could not reach Pump.fun coin data. Try again shortly." });
  }
};
