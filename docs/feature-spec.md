# SCAM Museum — Product Scope

**Status: early, manually maintained educational archive.** This document defines what the project does today and what it does not do. A feature is not live merely because it appears in a proposal, mockup, or roadmap.

## Product purpose

SCAM Museum is a public, playable learning site for exploring general smart-contract failure patterns and accepting community exhibit suggestions and research leads. Its SCAM Court mini-game asks visitors to judge fictional crypto pitches and generates a shareable verdict card. SCAM is also the name/ticker of an associated Pump.fun meme token. The token is not required to play, vote on real-coin community sentiment, suggest an exhibit, submit a research lead, or report a site issue; holding at least 1 SCAM optionally unlocks three extra fictional security cases.

## Available now

| Capability | What a visitor can do | Current boundary |
| --- | --- | --- |
| SCAM Court | Judge fictional crypto pitches as suspicious, needing receipts, or narrowly supported; create a shareable verdict card. | Fictional education and humor only. No real token or team is accused, and verdicts are not live detection or financial advice. |
| Play the gallery | Answer three short, fictional smart-contract security puzzles and read the explanation. | Educational toy examples only; not a scanner, audit, or finding about a live project. |
| Curator Pass | Connect a Phantom Solana wallet and check its balance of the SCAM mint. A balance of at least 1 SCAM reveals three extra fictional security cases with interactive curator notes. | Read-only balance lookup; no message signature, token transfer, or transaction. The public address is sent to Solana's public RPC, not to a SCAM Museum backend. This lightweight client-side pass is not secure access control or a financial reward. |
| Pump.fun community pulse | Search the active Pump.fun coin list by name/ticker or enter a mint directly; cast one of three anonymous opinions and see the rolling 30-day counts. | Name/ticker search covers currently active coins; direct mint lookup is available for others. Counts are subjective community sentiment, not a scam verdict, safety rating, or audit. No comments or wallet details are collected. SCAM holdings do not affect real-coin polls. Requires Upstash Redis and Vercel environment configuration; do not describe it as live until the production API responds successfully. |
| Read the archive | Read short educational summaries of common contract failure patterns. | Summaries are general examples, not verified findings against named deployed contracts. They are not an audit or safety rating. |
| Submit a research lead | Fill a form that prepares a GitHub issue draft with network, deployment status, public source/address, question, and optional evidence. | A maintainer reviews it manually. GitHub account required to submit. No response time or publication is promised. |
| Suggest an exhibit or report a site/archive issue | Prepare a GitHub issue proposing a fictional puzzle theme or reporting a correction, broken link, accessibility problem, or site bug. | Suggestions are manually reviewed and are not guaranteed to be published. This is a public issue flow, not confidential vulnerability intake. |
| View token references | Open the Pump.fun token page and Solscan token page for the configured mint. | Links do not imply endorsement, liquidity, market availability, or token value. Dynamic holdings and market facts must be checked on-chain. |

## Explicitly not available

- Automated or real-time scam, rug-pull, or contract detection.
- Verified one-person-one-vote polls or resistance to coordinated brigading.
- Contract audits, certification, safety scores, or a verdict that a project is malicious.
- Automated exploit reproduction, transaction simulation, monitoring, or alerts.
- A confidential vulnerability intake channel or incident-response service.
- A funded bounty, monetary/token reward, staking, airdrop, buyback, or revenue share.
- Token price support, liquidity commitments, exchange listings, or investment returns.

## Intake and review workflow

1. A contributor submits public, non-sensitive context through the static site form.
2. The form opens a prefilled GitHub issue for the contributor to inspect and submit.
3. A maintainer triages the issue manually and may request safe, reproducible evidence.
4. If accepted, the maintainer may add an educational case with scope, evidence, limitations, and review notes.

Issue acceptance, review timing, findings, and publication are not guaranteed. Do not use public issues for weaponizable details about an unpatched live system. Contributors should use the affected project's authorized security contact for confidential disclosure.

## Safety and editorial rules

- Label exhibits as general patterns unless a specific case has been independently reviewed and its evidence is published.
- Separate observed facts, hypotheses, and conclusions.
- Reproduce only in local, testnet, or explicitly authorized environments.
- Never ask for or publish seed phrases, private keys, API keys, credentials, personal data, or unauthorized exploit material.
- Do not imply that holding or buying SCAM is needed to participate in research.

## Token and financial disclosures

SCAM is a speculative meme token that can lose all value. The current token-linked site feature is a read-only Curator Pass that unlocks three optional fictional security cases for wallets holding at least 1 SCAM. The token is not spent, locked, or transferred; this is a lightweight client-side access feature, not a monetary reward. There are no promises of return, liquidity, listing, or price outcome. Real-coin community sentiment polls are open to everyone and are not weighted by SCAM holdings. The recorded initial launch buy was burned; this does not prove the creator can never acquire tokens later. Current balances and authorities require fresh on-chain verification.

## Change control

When functionality changes, update this document, the README, the public site, and relevant disclosure copy together. Mark a capability available only after it works on the public deployment and the evidence needed to support its claims is linked.
