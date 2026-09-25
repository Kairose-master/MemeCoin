# Project and site design notes

## Positioning

SCAM means **Smart Contract Attack Museum**. The token is an associated meme token; the website is an educational archive and a proposed community research intake. The name is deliberate wordplay, not a claim that the token catches scams.

The site must distinguish documented facts, educational patterns, proposals, and unavailable features. It must not imply that a pattern summary proves a real project's wrongdoing, or that lack of a reproduced exploit proves safety.

## Public channels

| Channel | Appropriate use | Current limitation |
| --- | --- | --- |
| Museum site | Explain common attack patterns, accept candidate submissions, link on-chain records | Manual review only; no live scanner, confidential security inbox, or active bounty |
| GitHub | Track code/site corrections and candidate research | Public issue submission requires a GitHub account; never post confidential live vulnerabilities |
| X / Pump.fun | Share educational examples and transparent token disclosures | Avoid profit claims, undisclosed promotion, artificial engagement, and claims of automated detection |
| Research communities | Discuss reproducible code and defensive lessons | Follow each community's self-promotion and disclosure rules |

## Product boundaries

- Contract intake should ask for network, address or source link, deployment status, security question, and safe reproduction context.
- Site/archive issues can use regular GitHub issues.
- Public issue forms are not an appropriate channel for weaponizable details about unpatched live vulnerabilities.
- Do not make a bounty active until a funded wallet, written scope, acceptance criteria, payment rules, and public transaction ledger exist.
- The proposed 60% bounty / 40% infrastructure / 0% buyback fee split is not operational until receipts, expenses, balances, and periodic reconciliations are published.
- The initial launch buy was burned. The creator may acquire tokens separately, so live ownership must be verified rather than described as permanently zero.

## Current site implementation

The website is static HTML hosted from `site/`. Its intake interface prepares a structured GitHub issue URL for the public repository. Submitters can review the issue before posting and need a GitHub account. This public issue tracker is not a confidential disclosure channel; do not put weaponizable details about live vulnerabilities in public reports.
