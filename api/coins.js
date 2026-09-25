const { getMint } = require("../lib/vote-store");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=60");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const query = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 80).toLowerCase() : "";
  const url = "https://frontend-api-v3.pump.fun/coins/currently-live?limit=100&offset=0";
  try {
    const upstream = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!upstream.ok) return res.status(502).json({ error: "Pump.fun's active coin list is temporarily unavailable." });
    const payload = await upstream.json();
    const source = Array.isArray(payload) ? payload : payload?.coins || payload?.data || [];
    const coins = source
      .filter((coin) => coin && typeof coin.mint === "string" && getMint(coin.mint))
      .map((coin) => ({
        mint: coin.mint,
        name: String(coin.name || "Unknown token").slice(0, 100),
        symbol: String(coin.symbol || "").slice(0, 24),
        image: typeof coin.image_uri === "string" && coin.image_uri.startsWith("https://") ? coin.image_uri : null,
      }))
      .filter((coin) => !query || [coin.name, coin.symbol, coin.mint].some((value) => value.toLowerCase().includes(query)))
      .slice(0, 12);
    return res.status(200).json({ coins, source: "Pump.fun currently-live", query });
  } catch {
    return res.status(502).json({ error: "Could not load Pump.fun's active coin list. Try again shortly." });
  }
};
