---
date: 2026-03-28
project: epayco-node-ts
artifactType: decision-record
status: approved
relatedDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/epics.md
---

# Decision Records - PD-1 to PD-5

## Decision Summary

This document closes the pending architecture decisions PD-1..PD-5 to unblock implementation sequencing and readiness.

## PD-1 (DG1): plans.update support scope

- Owner: SDK Maintainer
- Due date: 2026-04-04
- Status: Approved (closed on 2026-03-28)
- Selected option: Document as unsupported in current cycle.
- Rationale: Lowest risk path for contract clarity in stabilization scope.
- Implementation impact:
  - Epic 1 Story E1-S2 follows documentation-alignment path.
  - No runtime API shape change in current cycle.

## PD-2 (DG2): customers.list pagination contract

- Owner: SDK Maintainer
- Due date: 2026-04-04
- Status: Approved (closed on 2026-03-28)
- Selected option: Add optional pagination arguments as backward-compatible minor.
- Rationale: Align docs with user expectation while preserving compatibility.
- Implementation impact:
  - Epic 1 Story E1-S3 executes additive signature update.
  - Must include deterministic tests for args/no-args paths.

## PD-3 (DG4): webhook signature verification scope

- Owner: Security Lead + Tech Lead
- Due date: 2026-04-08
- Status: Approved (closed on 2026-03-28)
- Selected option: Defer implementation until official algorithm contract is validated.
- Rationale: Avoid insecure helper behavior under ambiguous cryptographic rules.
- Implementation impact:
  - Keep webhook utility out of current implementation scope.
  - Maintain backlog entry with prerequisite: official verification contract.

## PD-4 (DG5): checkout session scope in phase 3

- Owner: Product + Tech Lead
- Due date: 2026-04-08
- Status: Approved (closed on 2026-03-28)
- Selected option: Defer checkout session to next cycle.
- Rationale: Protect quality for links/withdrawals and reduce parity-scope risk.
- Implementation impact:
  - Epic 7 Story E7-S3 follows explicit defer path.
  - FR14 remains satisfied by documented scope gate outcome (not selected this cycle).

## PD-5: strict mode default switch date

- Owner: Product + Maintainer
- Due date: 2026-04-15
- Status: Approved (closed on 2026-03-28)
- Selected option: Keep strict mode opt-in for current major; evaluate default flip in next major.
- Target milestone: next major planning gate.
- Rationale: Maintain migration safety and semver discipline.
- Implementation impact:
  - Epic 6 Story E6-S4 executes governance/timeline documentation.
  - No default behavior flip in current major releases.

## Approval and Governance Notes

- Semver impact classification:
  - PD-1: Patch-level documentation alignment.
  - PD-2: Minor additive API signature.
  - PD-3: No release behavior impact in current cycle.
  - PD-4: Scope defer, no current behavior impact.
  - PD-5: Governance only, no immediate runtime behavior impact.
- This decision set unblocks all decision-gated stories with explicit execution paths.
