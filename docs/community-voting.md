# Pump.fun Community Pulse

## What it does

Visitors can search the active Pump.fun list by coin name or ticker, choose from current coins, or paste a mint address for direct lookup. They then choose one of three community opinions: **Concerning**, **Need more info**, or **No concern found**. The page shows counts only for the rolling 30-day window. It accepts no comments and does not label a coin as a scam or safe. SCAM token ownership never changes a real-coin vote's weight. Name/ticker search covers the active Pump.fun list; direct mint lookup remains available for coins outside that list.

Coin names and images are fetched server-side from Pump.fun's `coins-v2/{mint}` endpoint. The backend accepts only valid mint addresses and verifies the mint against Pump.fun again before recording a vote.

## Persistent storage setup

The public page is static HTML. Vercel serves `/api/coin` and `/api/votes` as serverless functions, while Upstash Redis stores vote totals and anti-abuse keys. Until Redis is connected to the Vercel project and a new deployment is ready, vote totals return “not configured.” Do not describe public voting as live before that check succeeds.

Simplest setup: in the Vercel project, open **Storage / Marketplace**, add **Upstash Redis**, and connect it to this project. Vercel's integration injects the Redis URL and token automatically. The code accepts either common environment-variable naming pair used by that integration.

If adding the integration manually, these server-side names are supported:

| Variable | Value |
| --- | --- |
| `UPSTASH_REDIS_REST_URL` | Database REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Database REST token with write access |
| `VOTE_HASH_SECRET` | Optional separate random secret (at least 32 characters) for HMAC; if omitted, the server derives these hashes from the Redis token |

Use Vercel's encrypted environment variable settings. Never put these values in `site/`, a public GitHub issue, client-side JavaScript, or a committed `.env` file. `.env.example` contains names only. Once the integration is connected, redeploy and check `/api/votes?mint=<valid-pump-mint>` before announcing the feature.

## Voting and privacy controls

- The browser creates a random local voter ID. The server stores only an HMAC of that ID; the original ID stays in that browser's local storage.
- The server uses an HMAC of the request IP for rate limits and does not store the raw IP. Vercel supplies the request IP header.
- A browser can vote once per coin in a 30-day period. The IP rate limit is 12 vote attempts per 24 hours; tally reads are limited to 60 per minute per IP.
- Vote totals use UTC daily buckets and only the most recent 30 days are queried. Old daily buckets expire after 40 days; voter keys expire after 30 days.
- These controls deter casual duplicate submissions; they do not prove one human per vote and cannot prevent all multi-browser or coordinated brigading.
- No wallet connection, signature, token purchase, transaction, comment, or real-world identity is requested for a poll.

## Editorial boundary

Counts are unverified community sentiment, not a security review. A large “Concerning” count does not establish fraud, and “No concern found” does not establish safety. Do not rank, market, or publicly accuse a real project solely from these numbers. If reporting a specific security issue, publish verifiable evidence and its limits separately through the manual review process.

## API

- `GET /api/coin?mint=<address>` returns a small, sanitized Pump.fun coin profile.
- `GET /api/coins?q=<name-or-ticker>` searches Pump.fun's active coin list; omit `q` to load the current list.
- `GET /api/votes?mint=<address>&voterId=<local-id>` returns the 30-day counts and whether this browser has voted.
- `POST /api/votes` accepts `{ "mint": "…", "vote": "concern|unclear|no_concern", "voterId": "…" }`.

## Provider references

- Pump.fun's maintained [Pump fun skills](https://github.com/pump-fun/pump-fun-skills) document the backend-only `coins-v2/{mint}` profile lookup.
- [Upstash Redis REST API](https://upstash.com/docs/redis/features/restapi) documents the HTTP command interface used by the Vercel functions.
