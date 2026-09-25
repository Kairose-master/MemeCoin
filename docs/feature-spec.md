# SCAM Museum — Product Scope

**Status: early, manually maintained educational archive.** This document defines what the project does today and what it does not do. A feature is not live merely because it appears in a proposal, mockup, or roadmap.

## Product purpose

SCAM Museum is a public, playable learning site for exploring general smart-contract failure patterns and accepting community exhibit suggestions and research leads. SCAM is also the name/ticker of an associated Pump.fun meme token. The token is not required to play, suggest an exhibit, submit a research lead, or report a site issue; holding at least 1 SCAM only opens an optional bonus exhibit.

## Available now

| Capability | What a visitor can do | Current boundary |
| --- | --- | --- |
| Play the gallery | Answer three short, fictional smart-contract security puzzles and read the explanation. | Educational toy examples only; not a scanner, audit, or finding about a live project. |
| Curator Pass | Connect a Phantom Solana wallet and check its balance of the SCAM mint. A balance of at least 1 SCAM reveals one optional bonus exhibit. | Read-only balance lookup; no message signature, token transfer, or transaction. The public address is sent to Solana's public RPC, not to a SCAM Museum backend. The bonus is a lightweight client-side experience, not protected confidential content or a financial reward. |
| Read the archive | Read short educational summaries of common contract failure patterns. | Summaries are general examples, not verified findings against named deployed contracts. They are not an audit or safety rating. |
| Submit a research lead | Fill a form that prepares a GitHub issue draft with network, deployment status, public source/address, question, and optional evidence. | A maintainer reviews it manually. GitHub account required to submit. No response time or publication is promised. |
| Suggest an exhibit or report a site/archive issue | Prepare a GitHub issue proposing a fictional puzzle theme or reporting a correction, broken link, accessibility problem, or site bug. | Suggestions are manually reviewed and are not guaranteed to be published. This is a public issue flow, not confidential vulnerability intake. |
| View token references | Open the Pump.fun token page and Solscan token page for the configured mint. | Links do not imply endorsement, liquidity, market availability, or token value. Dynamic holdings and market facts must be checked on-chain. |

## Explicitly not available

- Automated or real-time scam, rug-pull, or contract detection.
- Contract audits, certification, safety scores, or a verdict that a project is malicious.
- Automated exploit reproduction, transaction simulation, monitoring, or alerts.
- A confidential vulnerability intake channel or incident-response service.
- A funded bounty, guaranteed award, holder reward, staking, airdrop, buyback, or revenue share.
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

SCAM is a speculative meme token that can lose all value. The only current token-linked site feature is an optional client-side bonus exhibit; there are no monetary rewards or promises of return, liquidity, listing, or price outcome. The recorded initial launch buy was burned; this does not prove the creator can never acquire tokens later. Current balances and authorities require fresh on-chain verification.

## Change control

When functionality changes, update this document, the README, the public site, and relevant disclosure copy together. Mark a capability available only after it works on the public deployment and the evidence needed to support its claims is linked.
