# Sprint Plan - epayco-node-ts

**Project:** epayco-node-ts  
**User:** Alexander  
**Date:** 28 de marzo de 2026  
**Document Language:** English  
**Total Planned Stories:** 28  
**Planned Sprints:** 7  
**Total Story Points:** 165

---

## Executive Summary

The epayco-node-ts SDK is transitioning from a technically solid foundation to a production-ready, fintech-compliant product. This Sprint Plan decomposes 7 epics and 28 stories into a phased, dependency-respecting delivery roadmap.

**Strategic Goals:**

- Establish product contract alignment and eliminate SDK-docs drift in Sprint 1.
- Harden transport, error handling, and authentication lifecycle in Sprints 2–3.
- Operationalize compliance, governance, and documentation contracts in Sprints 4–6.
- Expand API parity with high-value domains in Sprint 7.

**Key Success Indicators:**

- Deterministic test coverage for all critical paths (transport, auth, error).
- Zero secret exposure in CI logs and error outputs (verified by automated scan).
- Compatibility profile defaults maintain semver safety throughout current major version.
- 100% of new/modified API methods include endpoint-to-host-mode mapping in docs.

**Estimated Effort:** 165 story points distributed across 7 sprints.

**Critical Dependencies:**

- Decisions PD-1 through PD-5 are closed and recorded (see Decision Register).
- Epic 1 (product alignment) must complete before Epic 2 (transport) begins.
- Epic 2 (error contract) must stabilize before Epic 3 (auth) and Epic 4 (compliance) accelerate.
- Epic 6 (semver governance) can parallelize with Epic 3 (auth) after governance templates are in place.
- Epic 7 (parity expansion) requires stabilization of Epic 2/3 transport and auth contracts.

---

## Epic Sequencing and Rationale

### Sequencing Principles

| Sequence       | Epic                                                                                     | Rationale                                                                                                 |
| -------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1              | Epic 1: Product Contract Alignment                                                       | Establish truth as foundation. Misaligned docs/surface block all downstream validation.                   |
| 2              | Epic 2: Deterministic Transport and Error Contract                                       | Implement transport reliability first. All other features depend on deterministic failure handling.       |
| 3              | Epic 3: Authentication Lifecycle and Token Reuse                                         | Build auth resilience on solid error contract. Reduces operational overhead for dependent features.       |
| 4–5 (parallel) | Epic 4: Fintech Compliance; Epic 5: Developer Tool Experience; Epic 6: Semver Governance | These are largely orthogonal post-Epic 3. Epic 4/5/6 stabilize operational controls while Epic 7 readies. |
| 7              | Epic 7: Priority API Parity Expansion                                                    | Begin only after Epic 2/3 contracts are proven stable. Adds new methods under proven patterns.            |

### Parallelization Opportunities

- **Epic 4 and Epic 5** can run in parallel after Epic 2 contracts stabilize (both depend on features, not each other).
- **Epic 6** governance artifacts can advance alongside Epic 3 implementation (templates don't require auth details).
- **Epic 7 Stories E7-S1 and E7-S2** (links and withdrawals) can run in parallel once transport is stable.

---

## Sprint Breakdown

### Sprint 1: Product Contract Alignment and Existing Surface Integrity

**Duration:** ~1 sprint  
**Epic:** Epic 1  
**Total Story Points:** 16  
**Goal:** Eliminate SDK-docs drift and establish single source of truth for current API surface.

| Story ID | Title                                             | Points | Priority    | Status  |
| -------- | ------------------------------------------------- | ------ | ----------- | ------- |
| E1-S1    | Align package installation and API surface claims | 5      | ⭐⭐⭐ High | Backlog |
| E1-S2    | Resolve plans.update contract                     | 3      | ⭐⭐ Medium | Backlog |
| E1-S3    | Resolve customers.list pagination contract        | 3      | ⭐⭐ Medium | Backlog |
| E1-S4    | Align error catalog with CashProvider             | 5      | ⭐⭐⭐ High | Backlog |

**Sprint Goal:** README, exported API surface, error catalog, and type signatures are aligned and validated.

**Acceptability Metrics:**

- Deterministic doc-surface consistency checks pass.
- All errors resolve to declared provider types.
- Package installation command matches published metadata.

---

### Sprint 2: Deterministic Transport and Error Contract

**Duration:** ~1.5 sprints  
**Epic:** Epic 2  
**Total Story Points:** 26  
**Goal:** Implement transport reliability, error typing, and compatibility-safe failure handling.

| Story ID | Title                                               | Points | Priority    | Status  |
| -------- | --------------------------------------------------- | ------ | ----------- | ------- |
| E2-S1    | Implement ADR-001 error taxonomy and typed contract | 8      | ⭐⭐⭐ High | Backlog |
| E2-S2    | Enforce non-2xx and non-JSON typed handling         | 5      | ⭐⭐⭐ High | Backlog |
| E2-S3    | Implement ADR-003 businessFailureMode policy        | 8      | ⭐⭐⭐ High | Backlog |
| E2-S4    | Preserve legacyErrorMode migration behavior         | 5      | ⭐⭐⭐ High | Backlog |

**Sprint Goal:** All SDK-thrown errors are typed, sanitized, and follow documented compatibility/strict branching.

**Acceptability Metrics:**

- Error taxonomy is enforced for all code paths (network, parse, business).
- Non-2xx and invalid JSON responses fail predictably without silent crashes.
- Dual-mode (compatibility/strict) tests demonstrate zero behavior regression in compatibility mode.
- Secret scan CI finds zero raw credentials in error test logs.

---

### Sprint 3: Authentication Lifecycle and Token Reuse

**Duration:** ~1.5 sprints  
**Epic:** Epic 3  
**Total Story Points:** 24  
**Goal:** Implement token cache, single-flight auth, bounded retries, and measure auth overhead reduction.

| Story ID | Title                                                 | Points | Priority    | Status  |
| -------- | ----------------------------------------------------- | ------ | ----------- | ------- |
| E3-S1    | Add token cache keying and TTL policy                 | 8      | ⭐⭐⭐ High | Backlog |
| E3-S2    | Implement single-flight auth lock and bounded retries | 8      | ⭐⭐⭐ High | Backlog |
| E3-S3    | Add invalidation and cache-disable controls           | 5      | ⭐⭐⭐ High | Backlog |
| E3-S4    | Produce auth overhead benchmark evidence              | 3      | ⭐⭐ Medium | Backlog |

**Sprint Goal:** Token reuse is active, auth is single-flight, and median auth overhead is measurable and recorded.

**Acceptability Metrics:**

- Cache hits verified in sequential request deterministic tests.
- Only one login call executes in burst concurrency scenarios.
- Retry attempts capped at 2 with failure-injection tests.
- Benchmark evidence published showing < 50ms median auth overhead with token cache.

---

### Sprint 4: Fintech Compliance Foundation + Semver Governance Templates

**Duration:** ~1.5 sprints  
**Epic:** Epic 4 + Epic 6 (governance phase 1)  
**Total Story Points:** 26  
**Goal:** Implement compliance controls and establish governance framework.

| Story ID | Title                                                 | Points | Priority    | Status  |
| -------- | ----------------------------------------------------- | ------ | ----------- | ------- |
| E4-S1    | Enforce redaction policy on errors and metadata       | 8      | ⭐⭐⭐ High | Backlog |
| E4-S2    | Implement audit event schema and core emission points | 5      | ⭐⭐⭐ High | Backlog |
| E4-S3    | Automate CI secret scan and release evidence package  | 8      | ⭐⭐⭐ High | Backlog |
| E6-S1    | Implement compatibility profile contract              | 5      | ⭐⭐⭐ High | Backlog |

**Sprint Goal:** Compliance controls are automated, secret scan is enforced in CI, and compatibility profile contract is validated.

**Acceptability Metrics:**

- Redaction snapshots prove sensitive values are masked in all error outputs.
- Audit event schema includes timestamp, sdkVersion, correlationId, eventType.
- CI secret scan passes on unit/integration test logs.
- Compatibility profile configuration is type-safe and validated.

---

### Sprint 5: Developer Tool Contracts + Semver Governance Release Policy

**Duration:** ~1.5 sprints  
**Epic:** Epic 5 + Epic 6 (governance phase 2)  
**Total Story Points:** 26  
**Goal:** Publish complete developer-tool documentation contracts and establish release governance.

| Story ID | Title                                                 | Points | Priority    | Status  |
| -------- | ----------------------------------------------------- | ------ | ----------- | ------- |
| E5-S1    | Publish language matrix and installation methods      | 5      | ⭐⭐⭐ High | Backlog |
| E5-S2    | Build complete method-to-endpoint-host-mode mapping   | 8      | ⭐⭐⭐ High | Backlog |
| E5-S3    | Implement code examples strategy with CI compile gate | 8      | ⭐⭐⭐ High | Backlog |
| E6-S2    | Add release semver gate and changelog governance      | 5      | ⭐⭐⭐ High | Backlog |

**Sprint Goal:** All public methods are documented with endpoint/host/mode mapping, examples compile in CI, and release process enforces semver classification.

**Acceptability Metrics:**

- Language/runtime support matrix covers all official targets.
- 100% of public methods included in endpoint-to-host-mode mapping.
- All code snippets compile in deterministic CI checks.
- Release checklist enforces semver classification and migration notes.

---

### Sprint 6: Documentation Completeness + Governance Timeline

**Duration:** ~1 sprint  
**Epic:** Epic 6 (governance phase 3) + Epic 5 (documentation completeness) + Epic 4 (compliance completeness)  
**Total Story Points:** 18  
**Goal:** Complete migration guidance, fraud baseline, and confirm PD-5 governance timeline.

| Story ID | Title                                                      | Points | Priority    | Status  |
| -------- | ---------------------------------------------------------- | ------ | ----------- | ------- |
| E6-S3    | Standardize migration guide structure and examples         | 5      | ⭐⭐⭐ High | Backlog |
| E6-S4    | Resolve PD-5 strict default switch governance plan         | 3      | ⭐⭐ Medium | Backlog |
| E5-S4    | Document integration-test strategy for sandbox credentials | 5      | ⭐⭐⭐ High | Backlog |
| E4-S4    | Add fraud baseline signals and risk output contract        | 5      | ⭐⭐ Medium | Backlog |

**Sprint Goal:** Migration playbook is complete, PD-5 timeline is confirmed, fraud prevention baselines are deterministic, and integration-test docs are secure and repeatable.

**Acceptability Metrics:**

- Migration guide includes what changed, why, affected users, and before/after code.
- PD-5 decision artifact records target release and deprecation timeline.
- Fraud risk signals produce deterministic low/medium/high outputs under controlled scenarios.
- Integration-test documentation contains no plaintext credentials.

---

### Sprint 7: Priority API Parity Expansion

**Duration:** ~1.5 sprints  
**Epic:** Epic 7  
**Total Story Points:** 26  
**Goal:** Expand API surface with collection links, withdrawals, and verified checkout scope resolution.

| Story ID | Title                                                      | Points | Priority    | Status  |
| -------- | ---------------------------------------------------------- | ------ | ----------- | ------- |
| E7-S1    | Add collection links resource methods                      | 8      | ⭐⭐⭐ High | Backlog |
| E7-S2    | Add withdrawals resource methods                           | 8      | ⭐⭐⭐ High | Backlog |
| E7-S3    | Resolve checkout session scope and implement conditionally | 5      | ⭐⭐ Medium | Backlog |
| E7-S4    | Complete export/type/docs linkage for new parity methods   | 5      | ⭐⭐⭐ High | Backlog |

**Sprint Goal:** Links and withdrawals are fully implemented and exported; checkout scope is resolved; all new methods are discoverable and mapped.

**Acceptability Metrics:**

- Links resource methods are typed, exported, and tested (success + failure paths).
- Withdrawals resource methods follow same contract and extension pattern.
- Checkout decision gate passes (or explicitly records deferral with rationale).
- Top-level exports include all intended new methods and types.

---

## Story Sequence Table: Detailed Breakdown

### All Stories with Estimates, Dependencies, and Acceptance Criteria

| #   | Story ID | Title                                                      | Epic | Points | Priority | Dependencies        | Acceptance Criteria                                                                                                                          | Test Evidence                                                                                     |
| --- | -------- | ---------------------------------------------------------- | ---- | ------ | -------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1   | E1-S1    | Align package installation and API surface claims          | 1    | 5      | High     | None                | README installation command matches package metadata; all documented methods exist in exports                                                | Doc-surface consistency check; export snapshot test                                               |
| 2   | E1-S2    | Resolve plans.update contract                              | 1    | 3      | Medium   | E1-S1               | plans.update is implemented with tests OR documented as unsupported; release notes include semver impact                                     | Deterministic tests or docs-absence test                                                          |
| 3   | E1-S3    | Resolve customers.list pagination contract                 | 1    | 3      | Medium   | E1-S1               | customers.list pagination args are supported or explicitly documented; method signature and README consistent                                | Signature-docs parity check; pagination behavior test                                             |
| 4   | E1-S4    | Align error catalog with CashProvider union                | 1    | 5      | High     | E1-S1, E1-S2, E1-S3 | Error provider names match CashProvider type union values; error code/message consistency verified                                           | Snapshot tests; static consistency checks                                                         |
| 5   | E2-S1    | Implement ADR-001 error taxonomy and typed contract        | 2    | 8      | High     | E1-S4               | All failures throw error with errorCode, errorType, remediationHint, sanitized details                                                       | Contract tests per taxonomy branch; serialization snapshots with redaction assertion              |
| 6   | E2-S2    | Enforce non-2xx and non-JSON typed handling                | 2    | 5      | High     | E2-S1               | Non-2xx responses throw typed HTTP_ERROR; invalid JSON throws PARSE_ERROR; zero silent failures                                              | Failure-path tests for 4xx, 5xx, malformed JSON; branch coverage assertion                        |
| 7   | E2-S3    | Implement ADR-003 businessFailureMode policy               | 2    | 8      | High     | E2-S1, E2-S2        | HTTP 200 + success=false handled per mode; compatibility mode is default in current major; strict mode available                             | Mode-matrix tests showing compatibility vs strict branches; regression tests for current behavior |
| 8   | E2-S4    | Preserve legacyErrorMode migration behavior                | 2    | 5      | High     | E2-S1, E2-S3        | legacyErrorMode disabled → modern contract; legacyErrorMode enabled → v1.x semantics                                                         | Dual-mode snapshots; legacy field preservation tests                                              |
| 9   | E3-S1    | Add token cache keying and TTL policy                      | 3    | 8      | High     | E2-S1, E2-S2        | Repeated requests with same credential/host reuse cached token if valid; TTL follows configured policy                                       | Cache hit/miss deterministic tests; TTL boundary tests                                            |
| 10  | E3-S2    | Implement single-flight auth lock and bounded retries      | 3    | 8      | High     | E3-S1               | Concurrent requests execute only one login for same cache key; retries capped at 2 attempts                                                  | Concurrency tests; retry-count tests with fixed failure sequences                                 |
| 11  | E3-S3    | Add invalidation and cache-disable controls                | 3    | 5      | High     | E3-S1, E3-S2        | 401/403 invalidates token automatically; disableTokenCache mode bypasses cache deterministically                                             | Invalidation tests for 401/403; no-cache mode tests                                               |
| 12  | E3-S4    | Produce auth overhead benchmark evidence                   | 3    | 3      | Medium   | E3-S1, E3-S2        | 20 sequential authenticated requests: median auth overhead reported and < 50ms threshold verified; artifact published                        | Deterministic benchmark run; CI threshold assertion                                               |
| 13  | E4-S1    | Enforce redaction policy on errors and metadata            | 4    | 8      | High     | E2-S1               | Sensitive values (apiKey, token, privateKey, card) masked in all error outputs; no raw secret patterns in serialized outputs                 | Redaction snapshot tests; CI regex secret scan on test logs                                       |
| 14  | E4-S2    | Implement audit event schema and core emission points      | 4    | 5      | High     | E4-S1               | Auth/request lifecycle events include timestamp, sdkVersion, eventType, correlationId, endpointPath, hostMode; redactionApplied flag present | Event-schema validation tests; contract tests for mandatory emission checkpoints                  |
| 15  | E4-S3    | Automate CI secret scan and release evidence package       | 4    | 8      | High     | E4-S1, E4-S2        | CI generates secret scan, contract test, benchmark reports automatically; evidence package archived with deterministic naming                | Pipeline integration tests; artifact-set completeness check                                       |
| 16  | E4-S4    | Add fraud baseline signals and risk output contract        | 4    | 5      | Medium   | E4-S2               | Fraud logic produces riskLevel, triggeredSignals, recommendedAction deterministically; high-risk state emits RISK_FLAGGED event              | Unit tests for risk mapping; event emission tests                                                 |
| 17  | E5-S1    | Publish language matrix and installation methods           | 5    | 5      | High     | E1-S1               | Language/runtime support and installation options documented explicitly; unsupported environments marked                                     | Doc lint for matrix sections; command validation checks                                           |
| 18  | E5-S2    | Build complete method-to-endpoint-host-mode mapping        | 5    | 8      | High     | E5-S1               | 100% of public methods have endpoint, host, payload mode documented; mapping includes new methods from later epics                           | Coverage check for all methods; link integrity from examples                                      |
| 19  | E5-S3    | Implement code examples strategy with CI compile gate      | 5    | 8      | High     | E5-S2               | All code snippets compile in deterministic CI gate; compatibility-sensitive examples include before/after variants                           | Snippet compile tests; taxonomy coverage checks                                                   |
| 20  | E5-S4    | Document integration-test strategy for sandbox credentials | 5    | 5      | High     | E5-S1               | Credential handling and redaction constraints explicit in docs; deterministic success/failure integration scenarios listed                   | Policy compliance test; integration checklist validation                                          |
| 21  | E6-S1    | Implement compatibility profile contract                   | 6    | 5      | High     | E2-S3, E3-S1        | Compatibility profile configuration validates legacyErrorMode, businessFailureMode, authMode; defaults documented                            | Configuration contract tests; mode behavior tests                                                 |
| 22  | E6-S2    | Add release semver gate and changelog governance           | 6    | 5      | High     | E6-S1               | Release is blocked if semver classification missing; changelog includes migration impact and compatibility notes                             | Release-template validation; CI policy test blocks on missing sections                            |
| 23  | E6-S3    | Standardize migration guide structure and examples         | 6    | 5      | High     | E6-S2               | Migration guide includes what changed, why, affected users, compatibility flags, verification checklist, before/after code                   | Doc lint for migration sections; spot-check tests on sample migrations                            |
| 24  | E6-S4    | Resolve PD-5 strict default switch governance plan         | 6    | 3      | Medium   | E6-S2               | PD-5 decision finalized with target release and deprecation timeline; communication plan recorded                                            | Governance checklist verification; release readiness test                                         |
| 25  | E7-S1    | Add collection links resource methods                      | 7    | 8      | High     | E2-S3, E3-S2        | Links resource methods are typed, exported, documented with host/mode mapping; create/update/list patterns implemented                       | Deterministic success/failure tests; contract tests for exports                                   |
| 26  | E7-S2    | Add withdrawals resource methods                           | 7    | 8      | High     | E2-S3, E3-S2        | Withdrawals methods typed, exported, documented; failure behavior follows Epic 2 contract; deterministic tests pass                          | Deterministic endpoint tests; integration mapping tests                                           |
| 27  | E7-S3    | Resolve checkout session scope and implement conditionally | 7    | 5      | Medium   | E7-S1, E7-S2        | DG5 decision gate passed; checkout methods implemented only if criteria met OR backlog records deferral with rationale                       | Gate compliance test; if implemented: contract tests                                              |
| 28  | E7-S4    | Complete export/type/docs linkage for new parity methods   | 7    | 5      | High     | E7-S1, E7-S2, E7-S3 | Top-level exports include all new methods/types; README mapping table references each new method                                             | Build snapshot tests; documentation cross-reference checks                                        |

---

## Risks and Dependencies

### Critical Cross-Epic Dependencies

| Dependency                             | Source | Target         | Rationale                                          | Mitigation                                                    |
| -------------------------------------- | ------ | -------------- | -------------------------------------------------- | ------------------------------------------------------------- |
| Product alignment must stabilize first | Epic 1 | Epic 2         | Alignment errors block error contract validation   | Strict gate: all E1 stories pass before E2 sprint begins      |
| Error contract is foundational         | Epic 2 | Epic 3, Epic 4 | Auth and compliance depend on deterministic errors | Publish stabilized error types before Epic 3 auth retry logic |
| Auth contract must stabilize           | Epic 3 | Epic 7         | New API methods rely on proven auth patterns       | Benchmark evidence required before Epic 7 begins              |
| Compliance controls must be verified   | Epic 4 | Release        | Secret redaction and audit must be CI-enforced     | Evidence package must pass before release publish             |

### Technical Risks

| Risk                                                                  | Likelihood | Impact   | Detection                                    | Mitigation                                                                    |
| --------------------------------------------------------------------- | ---------- | -------- | -------------------------------------------- | ----------------------------------------------------------------------------- |
| **Stale token edge cases** cause 401 loops                            | Medium     | High     | Deterministic concurrency tests fail         | Implement single-flight lock with max 2 retries; instrument with audit events |
| **Error contract backward incompatibility** breaks existing consumers | High       | High     | Regression test suite fails on legacy fields | Preserve v1.x fields in legacyErrorMode; maintain compatibility-first default |
| **Secret exposure via logs in CI** violates compliance                | Medium     | Critical | CI secret scan finds raw credentials         | Enforce reducer policy in all error outputs; run scan on every commit         |
| **Scope creep in Epic 7** (checkout) degrades quality                 | Medium     | Medium   | Story E7-S3 gate criteria not met            | Implement explicit PD-4/DG5 decision gate; record deferral                    |
| **Semver misclassification** in release                               | Medium     | High     | Changelog review and CI gate fail            | Require semver classification field; block release on missing value           |

### Resource and Decision Blockages

| Decision                              | Owner                | Due Date   | Status | Impact If Blocked                        |
| ------------------------------------- | -------------------- | ---------- | ------ | ---------------------------------------- |
| PD-1: plans.update support            | SDK Maintainer       | 2026-04-04 | Closed | E1-S2 cannot proceed                     |
| PD-2: customers.list pagination       | SDK Maintainer       | 2026-04-04 | Closed | E1-S3 cannot proceed                     |
| PD-4: checkout session scope          | Product + Tech Lead  | 2026-04-08 | Closed | E7-S3 deferred (gates on Epic 7 quality) |
| PD-5: strict-mode default switch date | Product + Maintainer | 2026-04-15 | Closed | E6-S4 records plan; no active blocker    |

---

## Success Metrics

### Per-Sprint Acceptance Criteria

**Sprint 1 Completion:**

- All E1 stories closed.
- README–surface consistency verified and snapshot stored.
- Error catalog snapshot created.

**Sprint 2 Completion:**

- Error taxonomy tests pass (all branches).
- Non-2xx/parse tests achieve 100% branch coverage.
- Dual-mode regression tests confirm zero breaking changes in compatibility mode.
- CI secret scan on test logs passes.

**Sprint 3 Completion:**

- Token cache hit/miss tests pass.
- Concurrency tests confirm single-flight behavior.
- Benchmark evidence published and < 50ms threshold verified.

**Sprint 4–6 Completion:**

- Compliance evidence package publishes automatically per release.
- Release checklist enforces semver classification.
- Method-to-endpoint mapping covers 100% of public surface.
- Example snippets compile in CI.
- Integration-test documentation has zero plaintext credentials.

**Sprint 7 Completion:**

- Links and withdrawals methods tested and exported.
- Checkout decision gate recorded (implementation or deferral).
- All new methods appear in top-level exports and README mapping.

### Release Gate Checklist

Before publishing any release, verify:

- [ ] All stories for sprintN are closed and acceptance criteria met.
- [ ] Deterministic test suite passes (unit + integration).
- [ ] Code coverage maintained or improved.
- [ ] CI secret scan reports 0 findings.
- [ ] Benchmark evidence (if applicable) meets threshold.
- [ ] Semver classification documented in changelog.
- [ ] Migration notes included (if behavior-changing).
- [ ] Compliance evidence package includes secret-scan report.

---

## Implementation Timeline

### Key Milestones

| Milestone                  | Target Sprint(s) | Target Date | Completion Condition                                     |
| -------------------------- | ---------------- | ----------- | -------------------------------------------------------- |
| Product Alignment Complete | Sprint 1         | 2026-04-11  | All E1 stories closed                                    |
| Error Contract Stable      | Sprint 2         | 2026-04-25  | E2-S1 through E2-S4 closed; regression tests pass        |
| Auth Lifecycle Proven      | Sprint 3         | 2026-05-09  | E3-S1 through E3-S4 closed; benchmark evidence published |
| Compliance Automated       | Sprint 4         | 2026-05-23  | E4 stories closed; evidence package publishes in CI      |
| Developer Tools Complete   | Sprint 5         | 2026-06-06  | E5 stories closed; 100% method mapping verified          |
| Governance Framework Live  | Sprint 6         | 2026-06-20  | E6 stories closed; PD-5 timeline finalized               |
| Parity Expansion Delivered | Sprint 7         | 2026-07-04  | E7 stories closed; new resources in exports and docs     |

---

## Appendix: Decision Register

### Decisions Closed (28 Mar 2026)

1. **PD-1 (DG1): plans.update Support Scope**
   - Owner: SDK Maintainer
   - Status: Closed
   - Decision: Mark `plans.update` as unsupported in current cycle; document in README and type exclusion.
   - Rationale: No active usage telemetry; marked for future consideration in roadmap backlog.

2. **PD-2 (DG2): customers.list Pagination Contract**
   - Owner: SDK Maintainer
   - Status: Closed
   - Decision: Add optional pagination arguments as backward-compatible minor feature.
   - Rationale: Non-breaking; follows REST pagination convention; safe to add before major lift.

3. **PD-3 (DG4): Webhook Signature Verification**
   - Owner: Security Lead + Tech Lead
   - Status: Closed
   - Decision: Defer until official ePayco webhook signature algorithm is validated.
   - Rationale: No official contract provided; risk of implementing incorrect algorithm.

4. **PD-4 (DG5): Checkout Session Implementation Scope**
   - Owner: Product + Tech Lead
   - Status: Closed
   - Decision: Defer checkout session implementation to next cycle (after links/withdrawals stabilize).
   - Rationale: Links and withdrawals are higher-priority; checkout requires additional discovery.

5. **PD-5: Strict-Mode Default Switch Date**
   - Owner: Product + Maintainer
   - Status: Closed
   - Decision: Keep opt-in in current major (v2.x); evaluate default flip for next major (v3.0).
   - Rationale: Zero breaking changes in current major; phased migration reduces adoption risk.

---

## Appendix: Testing Strategy Summary

### Test Coverage Goals

| Component   | Coverage Target      | Key Assertions                                   |
| ----------- | -------------------- | ------------------------------------------------ |
| Error paths | 100% branch coverage | All errorType, errorCode, redaction combinations |
| Auth cache  | 100% branch coverage | Hit/miss, TTL, invalidation, single-flight       |
| Transport   | 100% branch coverage | 2xx, 4xx, 5xx, parse-error, timeout paths        |
| Compliance  | Evidence artifacts   | Secret scan, audit events, risk signals          |
| API parity  | Deterministic CRUD   | Create, read, update, list per new resource      |

### Deterministic Test Patterns

All stories require deterministic tests with stable:

- Mocked HTTP responses (no real API calls).
- Controlled timestamps and random seeds.
- Snapshot assertions for error outputs and event schemas.
- Ci secret-scan verification on test logs.

---

## Appendix: Version Compatibility Matrix

### Target Runtimes

| Runtime         | Support Level | Installation Method           |
| --------------- | ------------- | ----------------------------- |
| Node.js 18+     | Official      | `npm install epayco`          |
| Node.js 20 LTS  | Official      | `npm install epayco`          |
| Node.js 22      | Experimental  | `npm install epayco@latest`   |
| TypeScript 5.0+ | Official      | Included types (.d.ts)        |
| ESM             | Official      | Native support                |
| CJS             | Official      | Backward-compatible transpile |

---

## Appendix: Glossary

| Term                    | Definition                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| **Deterministic Test**  | Test with fixed inputs, stable outputs, no flakes; all state mocked or controlled.             |
| **Story Points**        | Fibonacci scale (1, 2, 3, 5, 8, 13) for relative complexity estimation; no time mapping.       |
| **ADR**                 | Architecture Decision Record; frozen design commitment (ADR-001 through ADR-004 in roadmap).   |
| **Epic**                | User-centered goal spanning multiple stories and sprints.                                      |
| **Legacy Mode**         | Compatibility configuration preserving v1.x behavior for phased migration.                     |
| **Compliance Evidence** | Artifacts proving security controls, secret redaction, audit, fraud baseline.                  |
| **Single-Flight**       | Concurrency control ensuring only one instance of an operation (e.g., login) executes per key. |
| **Token Cache**         | In-memory store of valid auth tokens keyed by credential fingerprint; reduces auth calls.      |

---

**Sprint Plan Document Generated:** 28 de marzo de 2026  
**Author Role:** Scrum Master - BMAD Framework  
**Status:** Ready for Sprint Kickoff
