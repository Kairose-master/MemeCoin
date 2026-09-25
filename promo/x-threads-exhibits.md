# Educational post drafts: smart-contract attack patterns

These are general learning notes. Do not imply that they prove a particular deployed contract is vulnerable. Verify technical details against a runnable local example before publishing.

## 01 — Reentrancy

- Pattern: an external call occurs before the contract updates the caller's balance or applies a lock.
- Why it matters: a callback may re-enter while state still reflects the earlier balance.
- Defense to discuss: checks-effects-interactions and a reentrancy guard where appropriate.

## 02 — Missing access control

- Pattern: an administrative function lacks an authorization check.
- Why it matters: an arbitrary caller may change ownership or move assets.
- Defense to discuss: explicit role checks and tests for unauthorized callers.

## 03 — Unsafe arithmetic

- Pattern: unchecked operations bypass normal overflow or underflow protection.
- Why it matters: accounting values can wrap or diverge when assumptions fail.
- Defense to discuss: bounds checks and documented invariants around unchecked blocks.

## 04 — Oracle manipulation

- Pattern: a protocol trusts an easily manipulated spot price.
- Why it matters: collateral or payouts can be computed from a temporarily distorted value.
- Defense to discuss: robust oracle design, bounds, stale-data checks, and threat modeling.

## 05 — Unsafe delegate calls

- Pattern: untrusted code executes in the caller's storage context.
- Why it matters: the callee can alter sensitive state belonging to the caller.
- Defense to discuss: constrain targets and review proxy/storage assumptions.

## 06 — Weak randomness

- Pattern: a contract derives a valuable outcome from predictable or manipulable block data.
- Why it matters: participants or block producers may predict or influence outcomes.
- Defense to discuss: appropriate verifiable randomness or commit-reveal designs.

## 07 — Repeatable initialization

- Pattern: a setup function can be called again after deployment or through a proxy.
- Why it matters: ownership or critical configuration may be reset.
- Defense to discuss: one-time initialization guards and implementation locking.

Museum: https://scam-museum-snowy.vercel.app
Risk disclosure: https://github.com/Kairose-master/MemeCoin/blob/main/promo/disclosure.md
