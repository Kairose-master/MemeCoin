# SCAM Museum

A playful, educational museum for exploring smart-contract security patterns. Put fictional crypto pitches on trial in SCAM Court, share a verdict card, play three security puzzles, or hold 1 SCAM to unlock three optional curator cases. SCAM is the associated Pump.fun meme token; community submissions receive manual review.

> **Token risk:** SCAM has no intrinsic value or promised returns and can lose all value. This project does not provide live scam detection, audit certification, or investment advice. The creator's initial launch buy was burned; the creator may hold tokens acquired separately. Check current balances on-chain.

## Repository map

| Path | Purpose |
| --- | --- |
| `site/` | Static museum site, token links, research intake interface, and risk disclosures. |
| `api/` | Vercel serverless API for Pump.fun active coin search, coin lookup, and anonymous vote totals. |
| `launch/` | Owner-operated PumpPortal launch and SPL token burn scripts. Never commit secrets. |
| `promo/` | English-only communication drafts and disclosure copy. |
| `docs/` | Product scope, token facts, and submission/review boundaries. |
| `.github/ISSUE_TEMPLATE/` | Structured issue templates for contract candidates and site/archive reports. |

## Current, verifiable scope

See [the product scope](docs/feature-spec.md) for the exact available features, manual review flow, safety boundaries, and explicitly unavailable capabilities.

- Token mint: `HvyZwwPJhPp5mxkr48SmGt7b5p2Tqrwzyjf6sT5JpMBV`.
- Launch transaction: `56gtN3pXyotNLcNS2biu1dcWxymL9J7gDVL3TGTo7XEN4rD42zkvumbxchva1QRJhY6VtvZQhJXmgugfBxWSryh2`.
- Burn transaction: `3DCBiFkvq7RndkhqxCYnHzGLvkTLHH51eJD4BbC7Xr3jzjLWZ1iBXXy1FH4Nv4dwAUECj3b3AoMa1VnWDSwWNduJ`.
- Public token page: [Pump.fun](https://pump.fun/coin/HvyZwwPJhPp5mxkr48SmGt7b5p2Tqrwzyjf6sT5JpMBV).
- Public explorer: [Solscan](https://solscan.io/token/HvyZwwPJhPp5mxkr48SmGt7b5p2Tqrwzyjf6sT5JpMBV).
- The archive contains educational descriptions of common vulnerability patterns. A description is not proof that any named live project is exploitable.
- Contract and site submissions are prepared as GitHub issues. This repository is public, so visitors can review and submit them with a GitHub account.
- There is no live token scanner or active bounty pool.
- The interactive gallery has three fictional puzzles. Holding at least 1 SCAM unlocks three optional bonus security cases through a read-only Phantom balance check. No signature, transfer, or transaction is requested; this lightweight client-side pass is not secure access control or a financial reward.
- Pump.fun community pulse polls offer three unverified sentiment choices with counts only and no comments. Visitors can search active coins by name/ticker or paste a mint for direct lookup. SCAM holdings do not weight real-coin polls. The vote API requires an Upstash Redis database and Vercel environment variables; follow [the setup guide](docs/community-voting.md) and verify the production API before calling the poll live.

## Submit a research candidate or issue

Use the forms on the [museum site](https://scam-museum-snowy.vercel.app/#submit) or the GitHub issue templates. Include a public source link, network, deployment status, a concise security question, and safe reproduction context. A submission is a research lead, not a verdict or guarantee of publication.

Do not use public issues to disclose weaponizable details about an unpatched live system. This project does not currently have a confidential vulnerability intake channel. Never submit private keys, seed phrases, credentials, or personal data. Do not attack deployed contracts, users, or infrastructure.

## Launch scripts

These are legacy owner tools, separate from the museum experience. The original token is already live. Running `launch.ts` creates a new token mint and can spend SOL; it does not manage the existing mint. Do not run it for routine site updates. `burn.ts` permanently burns tokens and must not be run without independently verifying the wallet, mint, and amount.

```sh
cd launch
npm ci
export PUMPFUN_API_KEY=...    # PumpPortal API key; keep in a local environment only
export SITE_URL=https://scam-museum-snowy.vercel.app
npx tsx launch.ts --dev-buy 0.01 --dry-run  # Preview only; do not launch another token.
```

Only the token owner should run launch or burn operations after reviewing the code, wallet, mint, fee, and network. Do not paste private keys or API keys into issues, chat, or source files. The public `site/launch.json` is a launch record and must never contain secrets.

## Local preview

The page is static HTML and can be previewed with any static file server from the repository root, with `site/` as the document root. Vercel is configured to serve `site/` as the output directory and the root `api/` functions. Local community-vote requests require the same Upstash environment variables as production.

## Project status

The website distinguishes implemented links and records from proposals. There are no monetary token-holder rewards, revenue share, staking, price support, guaranteed listings, or active bounty payouts. See `docs/tokenomics.md`, `docs/bounty.md`, and `docs/legal.md` before making public claims.
