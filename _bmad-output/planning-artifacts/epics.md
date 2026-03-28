---
stepsCompleted:
  - step-01-validate-prerequisites.md
  - step-02-design-epics.md
  - step-03-create-stories.md
  - step-04-final-validation.md
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/prd-validation-report.md
workflowType: create-epics-and-stories
workflow: create
projectContext: brownfield
classification:
  projectType: developer_tool
  domain: fintech
  complexity: high
date: 2026-03-28
status: complete
---

# epayco-node-ts - Epic Breakdown

## Overview

This CE artifact decomposes the approved PRD and Architecture into implementation-ready epics and stories for epayco-node-ts.
It enforces explicit traceability from PRD requirements and decision gates to architecture decisions and then to story-level acceptance criteria and tests.

## Requirements Inventory

### Functional Requirements

- FR1: Developers can install the correct package name from official docs.
- FR2: Developers can see only methods that exist in the current SDK version.
- FR3: Developers can reference a per-method host/mode table in official docs for 100% of public SDK methods.
- FR4: Maintainers can publish release notes with semver impact and migration notes.
- FR5: SDK requests can distinguish network/HTTP failures from API business failures.
- FR6: SDK users can catch typed errors that include errorCode, errorType, and remediationHint fields.
- FR7: SDK requests can handle non-JSON responses without silent crashes.
- FR8: SDK users can enable legacyErrorMode to preserve SDK v1.x error semantics during migration windows.
- FR9: SDK can reuse valid auth tokens across multiple requests.
- FR10: SDK can refresh or re-authenticate on token expiration/authorization failure.
- FR11: SDK users can configure or disable token cache for testing/debug scenarios.
- FR12: SDK users can create, update, and list collection links through dedicated methods.
- FR13: SDK users can create and consult withdrawals through dedicated methods.
- FR14: SDK users can create checkout sessions if selected for phase scope.
- FR15: Developers can see endpoint, host, and payload mode for each new method in SDK docs and type definitions.
- FR16: Developers can verify whether plans.update is supported from both README and exported API surface.
- FR17: Developers can verify whether customers.list pagination arguments are supported from both README and method signature.
- FR18: SDK users receive cash-provider error messages that match CashProvider type union values.
- FR19: Every changed or added behavior is covered by deterministic tests.
- FR20: Integration-test strategy is documented for sandbox-only secure credentials.

### NonFunctional Requirements

- NFR1: Automated CI log scans report 0 exposures of private keys, bearer tokens, and card data across normal and error-path tests.
- NFR2: All SDK-thrown errors redact sensitive fields by policy in message and metadata outputs.
- NFR3: HTTP layer returns deterministic typed failures for non-2xx responses.
- NFR4: Authentication retry/caching enforces at most 1 concurrent login per credential set and no more than 2 bounded retries.
- NFR5: With token cache enabled, median auth overhead remains below 50ms in a 20-request sequential benchmark.
- NFR6: Behavior changes with breaking potential are gated by semver-major or explicit opt-in.
- NFR7: 100% of new resources extend Resource, include typed contracts, and pass resource-pattern checklist.
- NFR8: Every new endpoint method includes deterministic success/failure tests and README method-to-endpoint linkage.

### Additional Requirements

- ADR-001: Standardize error taxonomy and typed EpaycoError contract.
- ADR-002: Add token lifecycle with cache, refresh, retry bounds, and invalidation.
- ADR-003: Implement HTTP 200 + success=false policy with compatibility/strict modes.
- ADR-004: Introduce semver compatibility profile and migration mode strategy.
- Fintech compliance must include compliance matrix, security architecture, audit requirements, and fraud prevention controls.
- Developer-tool sections must include language matrix, installation methods, code examples strategy, and migration guide strategy.
- Security controls require strict secret redaction policy and verification gates.
- Audit controls require structured event schema, retention policy, and per-release evidence package.
- Release governance requires semver gate checklist and migration notes for compatibility-impacting changes.

### UX Design Requirements

- No UX design document was provided for this CE cycle.

### FR Coverage Map

- FR1 -> Epic 1
- FR2 -> Epic 1
- FR3 -> Epic 5, Epic 7
- FR4 -> Epic 6
- FR5 -> Epic 2
- FR6 -> Epic 2, Epic 4
- FR7 -> Epic 2
- FR8 -> Epic 2, Epic 6
- FR9 -> Epic 3
- FR10 -> Epic 3
- FR11 -> Epic 3
- FR12 -> Epic 7
- FR13 -> Epic 7
- FR14 -> Epic 7 (deferred by closed PD-4 decision for next cycle)
- FR15 -> Epic 5, Epic 7
- FR16 -> Epic 1
- FR17 -> Epic 1
- FR18 -> Epic 1
- FR19 -> Epic 2, Epic 3, Epic 4, Epic 7
- FR20 -> Epic 5, Epic 7

## Epic List

### Epic 1: Product Contract Alignment and Existing Surface Integrity

Ensure SDK documentation and exposed API surface are consistent, version-accurate, and trustworthy for current consumers.
**FRs covered:** FR1, FR2, FR16, FR17, FR18, FR19

### Epic 2: Deterministic Transport and Error Contract

Deliver typed, predictable failure behavior across network, HTTP, parse, and business-failure branches with compatibility-safe rollout.
**FRs covered:** FR5, FR6, FR7, FR8, FR19

### Epic 3: Authentication Lifecycle and Token Reuse

Reduce auth overhead and improve reliability with cache lifecycle, bounded retry rules, and deterministic invalidation behavior.
**FRs covered:** FR9, FR10, FR11, FR19

### Epic 4: Fintech Compliance and Security Evidence

Implement mandatory compliance controls and evidence workflows for redaction, auditability, and fraud baseline handling.
**FRs covered:** FR6, FR19

### Epic 5: Developer Tool Experience and Documentation Contracts

Provide complete and verifiable language/runtime support documentation, installation guidance, endpoint mapping, and example strategy.
**FRs covered:** FR3, FR15, FR20

### Epic 6: Semver Governance and Migration Safety

Institutionalize compatibility profiles, semver gatekeeping, and migration guidance for all behavior-affecting releases.
**FRs covered:** FR4, FR8

### Epic 7: Priority API Parity Expansion (Links, Withdrawals, Checkout)

Expand high-value domains additively with typed contracts, deterministic tests, and traceable docs linkage.
**FRs covered:** FR12, FR13, FR14, FR15, FR19, FR20

## Epic 1: Product Contract Alignment and Existing Surface Integrity

Objective: Eliminate SDK-doc drift and codify current API truth.

Scope:

- Package name and install docs alignment.
- README vs exported method parity checks.
- Resolution path for plans.update and customers.list pagination.
- Error catalog alignment with cash-provider union.

Risks:

- Documentation-only corrections can be mistaken as runtime changes.
- Optional pagination may create compatibility ambiguity if defaults are not explicit.

Dependencies:

- Decision PD-1 and PD-2.
- Existing README and resource signatures.

Epic Acceptance Criteria:

- README installation command matches published package metadata.
- README method claims and public exports are aligned.
- plans.update decision is implemented or documented as unsupported.
- customers.list pagination contract is implemented or documented explicitly.
- Error catalog aligns with declared provider unions and codes.

### Story E1-S1: Align package installation and API surface claims

As a backend integrator,
I want official docs to match the real package and available methods,
So that I can onboard without integration dead-ends.

Traceability:

- PRD: FR1, FR2, SC1, SC2
- Architecture: Developer Tool Architecture -> Installation Methods

**Acceptance Criteria:**

**Given** the current README and package metadata
**When** installation and API method sections are reviewed and updated
**Then** installation command matches package metadata exactly
**And** every documented method exists in the current exported SDK surface

Definition of Tests:

- Deterministic doc-surface consistency check over README method references.
- Validation test that package installation command equals package metadata name.

### Story E1-S2: Resolve plans.update contract (PD-1)

As an SDK maintainer,
I want an explicit plans.update support decision,
So that semver impact and user expectations are controlled.

Traceability:

- PRD: FR16, DG1
- Architecture: Pending Decisions PD-1

**Acceptance Criteria:**

**Given** the approved PD-1 outcome
**When** the implementation/doc contract is updated
**Then** plans.update is either implemented with tests or documented as unsupported
**And** release notes classify impact as patch/minor with rationale

Definition of Tests:

- If implemented: deterministic success/failure tests for plans.update.
- If unsupported: docs contract test asserts absence from export list and explicit README note.

### Story E1-S3: Resolve customers.list pagination contract (PD-2)

As an SDK consumer,
I want customers.list pagination behavior to be explicit,
So that calls are predictable and typed.

Traceability:

- PRD: FR17, DG2
- Architecture: Pending Decisions PD-2

**Acceptance Criteria:**

**Given** the approved PD-2 outcome
**When** the list contract is updated
**Then** optional pagination arguments are supported or documented as non-supported with no ambiguity
**And** method signature and README remain consistent

Definition of Tests:

- Deterministic test for argument presence/absence behavior.
- Signature-doc parity check for customers.list.

### Story E1-S4: Align error catalog with CashProvider and code consistency

As a backend integrator,
I want error messages to match declared provider types,
So that operational debugging is accurate.

Traceability:

- PRD: FR18
- Architecture: ADR-001 context and Existing Surface Alignment

**Acceptance Criteria:**

**Given** error catalog entries and CashProvider type unions
**When** catalog consistency checks are applied
**Then** provider names in messages match union values
**And** error code prefixes/messages have no known mismatches

Definition of Tests:

- Deterministic snapshot tests for corrected error catalog entries.
- Static consistency check between declared provider unions and error text list.

## Epic 2: Deterministic Transport and Error Contract

Objective: Introduce explicit, typed, and migration-safe error handling behavior.

Scope:

- ADR-001 error taxonomy and contract fields.
- Non-2xx handling, parse-safe behavior, and business failure policy (ADR-003).
- Compatibility-first dual-mode behavior with legacyErrorMode support.

Risks:

- Behavioral contract changes may break consumer catch logic.
- Dual-mode operation can increase complexity if not fully tested.

Dependencies:

- Epic 1 docs alignment.
- Decision DG3 for business failure policy.

Epic Acceptance Criteria:

- Error taxonomy is complete and stable across SDK-controlled failure paths.
- Non-2xx and parse failures map to typed errors.
- HTTP 200 + success=false behavior follows documented compatibility/strict policy.
- legacyErrorMode remains available for migration windows.

### Story E2-S1: Implement ADR-001 error taxonomy and typed contract

As an SDK user,
I want normalized typed errors with remediation metadata,
So that handling and recovery logic are deterministic.

Traceability:

- PRD: FR5, FR6
- Architecture: ADR-001

**Acceptance Criteria:**

**Given** SDK-controlled failure conditions
**When** an error is thrown
**Then** error includes errorCode, errorType, remediationHint and sanitized details
**And** errorType belongs to approved taxonomy values

Definition of Tests:

- Deterministic contract tests for each taxonomy branch.
- Serialization snapshots with sensitive-value redaction assertions.

### Story E2-S2: Enforce non-2xx and non-JSON typed handling

As an integrator,
I want non-2xx and invalid JSON responses to fail predictably,
So that runtime behavior never fails silently.

Traceability:

- PRD: FR5, FR7, NFR3
- Architecture: Transport and Error Layer

**Acceptance Criteria:**

**Given** a non-2xx response or invalid JSON payload
**When** request processing occurs
**Then** SDK returns deterministic typed HTTP_ERROR or PARSE_ERROR
**And** no uncontrolled parser crash is propagated

Definition of Tests:

- Deterministic failure-path tests for 4xx, 5xx, malformed JSON.
- Branch coverage assertion for parse fallback path.

### Story E2-S3: Implement ADR-003 businessFailureMode policy (DG3)

As an SDK maintainer,
I want compatibility and strict modes for HTTP 200 business failures,
So that we can improve correctness without unsafe defaults.

Traceability:

- PRD: FR5, FR8, DG3
- Architecture: ADR-003

**Acceptance Criteria:**

**Given** HTTP 200 payload with success=false (or equivalent failure state)
**When** businessFailureMode=compatibility
**Then** payload returns with failure annotation metadata
**And** when businessFailureMode=strict, BUSINESS_ERROR is thrown with redacted details

Definition of Tests:

- Deterministic mode-matrix tests for compatibility vs strict branches.
- Regression tests proving default behavior remains compatibility-safe in current major.

### Story E2-S4: Preserve legacyErrorMode migration behavior

As a current SDK adopter,
I want a legacy error compatibility switch,
So that migration can be phased safely.

Traceability:

- PRD: FR8, NFR6
- Architecture: ADR-004 compatibility profile

**Acceptance Criteria:**

**Given** legacyErrorMode enabled
**When** error branches execute
**Then** legacy semantics are preserved per documented policy
**And** strict modern contract remains available when legacy mode is disabled

Definition of Tests:

- Deterministic dual-mode snapshots comparing legacy and modern branches.
- Compatibility tests for unchanged consumer-visible legacy fields.

## Epic 3: Authentication Lifecycle and Token Reuse

Objective: Implement ADR-002 to improve performance and auth resilience.

Scope:

- Cache keying and TTL policy.
- Single-flight login lock and bounded retries.
- Invalidation triggers and cache-disable mode.
- Benchmark evidence for NFR5.

Risks:

- Stale token edge cases can create intermittent authorization failures.
- Retry logic can amplify traffic if bounds are misconfigured.

Dependencies:

- Epic 2 error handling primitives.
- Stable auth response interpretation.

Epic Acceptance Criteria:

- Token reuse works across sequential requests with valid token state.
- Single-flight ensures max one concurrent login per credential set.
- Invalid token paths trigger deterministic re-auth with bounded retries.
- Benchmark evidence meets median auth overhead target.

### Story E3-S1: Add token cache keying and TTL policy

As an SDK user,
I want valid tokens reused automatically,
So that repeated calls avoid unnecessary authentication overhead.

Traceability:

- PRD: FR9, FR11, NFR5
- Architecture: ADR-002 token lifecycle

**Acceptance Criteria:**

**Given** repeated requests with same credential fingerprint and host mode
**When** token remains valid
**Then** SDK reuses cached token
**And** TTL follows configured precedence and expiration policy

Definition of Tests:

- Deterministic cache hit/miss tests.
- TTL boundary tests for refresh-window transitions.

### Story E3-S2: Implement single-flight auth lock and bounded retries

As a maintainer,
I want concurrent authentication controlled,
So that auth storms are prevented during failures.

Traceability:

- PRD: FR10, NFR4
- Architecture: ADR-002 concurrency and retry policy

**Acceptance Criteria:**

**Given** concurrent requests requiring authentication
**When** login is in progress for same cache key
**Then** only one login call executes
**And** auth failure retries are capped at two attempts

Definition of Tests:

- Deterministic concurrency tests confirming single login in burst scenarios.
- Deterministic retry-count tests with fixed failure sequences.

### Story E3-S3: Add invalidation and cache-disable controls

As a QA engineer and maintainer,
I want explicit invalidation and cache-disable controls,
So that debug/test scenarios and token-failure recovery are reliable.

Traceability:

- PRD: FR10, FR11
- Architecture: ADR-002 invalidation triggers

**Acceptance Criteria:**

**Given** 401/403 or explicit invalidation requests
**When** request flow continues
**Then** token is invalidated and re-authentication follows policy
**And** disableTokenCache mode bypasses cache deterministically

Definition of Tests:

- Deterministic invalidation tests for 401/403 and explicit invalidate.
- Deterministic no-cache mode tests proving auth-per-request behavior.

### Story E3-S4: Produce auth overhead benchmark evidence

As a technical decision maker,
I want measurable benchmark evidence,
So that token-cache performance claims are verifiable.

Traceability:

- PRD: NFR5
- Architecture: Audit Requirements -> Evidence Package

**Acceptance Criteria:**

**Given** 20 sequential authenticated requests with valid token
**When** benchmark harness executes in CI
**Then** median auth overhead is reported and stored as evidence artifact
**And** target threshold compliance is pass/fail explicit

Definition of Tests:

- Deterministic benchmark run with stable fixture responses.
- CI assertion on threshold and artifact publication.

## Epic 4: Fintech Compliance and Security Evidence

Objective: Close critical fintech compliance gaps flagged by PRD validation.

Scope:

- compliance_matrix implementation controls.
- security_architecture controls and redaction policy.
- audit_requirements and event schema.
- fraud_prevention baseline and risk outputs.

Risks:

- Incomplete masking can leak secrets in logs/errors.
- Audit events without consistent schema lose forensic value.

Dependencies:

- Epic 2 typed error contract.
- Epic 3 auth lifecycle events.

Epic Acceptance Criteria:

- Secret redaction policy is enforced and testable.
- Auditable event schema is implemented at required checkpoints.
- Fraud baseline signals and risk outputs are deterministic.
- Compliance evidence package is produced per release.

### Story E4-S1: Enforce redaction policy on errors and metadata

As a security lead,
I want sensitive values masked in all SDK error outputs,
So that operational logs cannot expose secrets.

Traceability:

- PRD: NFR1, NFR2
- Architecture: Security Architecture -> Redaction Policy

**Acceptance Criteria:**

**Given** messages/metadata containing apiKey, privateKey, token, card fields
**When** SDK emits errors
**Then** sensitive values are masked according to policy
**And** no raw secret patterns appear in serialized outputs

Definition of Tests:

- Deterministic redaction snapshot tests over representative payloads.
- CI regex secret scan over unit/integration test logs.

### Story E4-S2: Implement audit event schema and core emission points

As a compliance auditor,
I want traceable SDK events with correlation metadata,
So that behavior can be reconstructed per release.

Traceability:

- PRD: FR19
- Architecture: Audit Requirements -> Auditable Events, Traceability Fields

**Acceptance Criteria:**

**Given** auth and request lifecycle operations
**When** events are emitted
**Then** each event includes timestamp, sdkVersion, eventType, correlationId, endpointPath, hostMode
**And** errorType and redactionApplied fields are present when applicable

Definition of Tests:

- Deterministic event-schema validation tests.
- Contract tests for mandatory event emission checkpoints.

### Story E4-S3: Automate CI secret scan and release evidence package

As a maintainer,
I want compliance evidence generated automatically,
So that release readiness is auditable and repeatable.

Traceability:

- PRD: NFR1, FR19
- Architecture: Fintech Compliance Matrix, Audit Requirements -> Evidence Package

**Acceptance Criteria:**

**Given** CI execution on release candidate branch
**When** quality/compliance jobs run
**Then** secret scan, contract tests, and benchmark reports are generated
**And** release evidence package is archived with deterministic naming

Definition of Tests:

- Pipeline integration tests for evidence artifact generation.
- Deterministic checks that required artifact set is complete.

### Story E4-S4: Add fraud baseline signals and risk output contract

As a security lead,
I want minimum fraud detection signals surfaced consistently,
So that risk handling can be enforced by policy.

Traceability:

- PRD: FR19
- Architecture: Fraud Prevention -> Minimal Detection Signals, Risk Handling Policy

**Acceptance Criteria:**

**Given** repeated auth failures or suspicious retry patterns
**When** fraud baseline logic evaluates runtime context
**Then** riskLevel, triggeredSignals, and recommendedAction are produced deterministically
**And** high-risk state emits explicit risk events

Definition of Tests:

- Deterministic unit tests for low/medium/high risk mapping.
- Event emission tests for RISK_FLAGGED and related outputs.

## Epic 5: Developer Tool Experience and Documentation Contracts

Objective: Close developer_tool compliance gaps from validation report.

Scope:

- language matrix and installation methods.
- endpoint/host/mode method mapping.
- code examples strategy with compile checks.
- integration-test strategy documentation.

Risks:

- Documentation drift can reappear without automated checks.
- Examples may rot if not validated in CI.

Dependencies:

- Epic 1 contract alignment.
- Epic 7 additive API methods.

Epic Acceptance Criteria:

- Language and installation matrices are complete and accurate.
- Method-to-endpoint/host/mode mapping covers all public methods.
- Example catalog compiles and links to method mapping.
- Sandbox integration-test strategy is documented and reusable.

### Story E5-S1: Publish language matrix and installation methods

As a technical decision maker,
I want explicit runtime/language support and installation options,
So that adoption risk is clear.

Traceability:

- PRD: FR1, FR3
- Architecture: Developer Tool Architecture -> Language Matrix, Installation Methods

**Acceptance Criteria:**

**Given** official docs artifacts
**When** language/runtime and installation sections are published
**Then** support level and command patterns are explicit per runtime/package manager
**And** unsupported/experimental environments are clearly marked

Definition of Tests:

- Deterministic doc lint checks for required matrix sections.
- Command validation checks for installation snippets.

### Story E5-S2: Build complete method-to-endpoint-host-mode mapping

As a backend integrator,
I want transparent method routing details,
So that integration behavior is predictable.

Traceability:

- PRD: FR3, FR15
- Architecture: Documentation and Contract Layer

**Acceptance Criteria:**

**Given** the public SDK surface
**When** mapping documentation is generated
**Then** each method has endpoint, host, and payload mode documented
**And** mapping includes parity methods added in current cycle

Definition of Tests:

- Deterministic coverage check ensuring 100% public method mapping.
- Link integrity checks from examples to mapping entries.

### Story E5-S3: Implement code examples strategy with CI compile gate

As a developer,
I want trustworthy runnable examples,
So that integration starts quickly and correctly.

Traceability:

- PRD: FR15, FR20
- Architecture: Code Examples Strategy

**Acceptance Criteria:**

**Given** official quick-start and core-flow examples
**When** docs CI executes
**Then** all snippets compile in deterministic checks
**And** compatibility-sensitive examples include before/after variants where required

Definition of Tests:

- Deterministic snippet compile tests.
- Snapshot checks for required taxonomy coverage of examples.

### Story E5-S4: Document integration-test strategy for sandbox credentials

As a maintainer,
I want a secure integration-testing playbook,
So that end-to-end validation does not expose secrets.

Traceability:

- PRD: FR20
- Architecture: Project Structure and Boundaries -> Testing Rules

**Acceptance Criteria:**

**Given** sandbox-only credential policy
**When** integration-test strategy is documented
**Then** credential handling and redaction constraints are explicit
**And** deterministic success/failure integration scenarios are listed

Definition of Tests:

- Policy compliance test for no plaintext credentials in examples.
- Deterministic integration smoke checklist validation in CI.

## Epic 6: Semver Governance and Migration Safety

Objective: Operationalize ADR-004 and pending default-switch governance.

Scope:

- compatibility profile flags and usage contract.
- release checklist with semver classification gates.
- migration note requirements and code examples.
- PD-5 strict default switch planning.

Risks:

- Semver misclassification can cause accidental breaking releases.
- Missing migration notes can produce production regressions.

Dependencies:

- Epic 2 and Epic 3 behavior flags.
- Release process ownership.

Epic Acceptance Criteria:

- Compatibility profile is documented and validated.
- Every compatibility-affecting release includes semver class and migration notes.
- PD-5 plan defines trigger and date for strict-mode default review.

### Story E6-S1: Implement compatibility profile contract

As an SDK consumer,
I want explicit compatibility controls,
So that I can adopt changes progressively.

Traceability:

- PRD: FR4, FR8
- Architecture: ADR-004

**Acceptance Criteria:**

**Given** runtime configuration
**When** compatibility profile values are provided
**Then** legacyErrorMode, businessFailureMode, and authMode are validated and applied consistently
**And** defaults are documented for current major version

Definition of Tests:

- Deterministic configuration contract tests for valid/invalid combinations.
- Mode behavior tests for each profile axis.

### Story E6-S2: Add release semver gate and changelog governance

As a release manager,
I want mandatory semver classification checks,
So that behavior changes are released safely.

Traceability:

- PRD: FR4, NFR6
- Architecture: ADR-004 Release Policy

**Acceptance Criteria:**

**Given** a release candidate
**When** governance checks execute
**Then** release is blocked if semver impact classification is missing
**And** changelog includes migration impact and compatibility profile notes

Definition of Tests:

- Deterministic release-template validation checks.
- CI policy test that fails on missing semver/migration sections.

### Story E6-S3: Standardize migration guide structure and examples

As an integrator,
I want migration guidance with before/after code,
So that upgrades are predictable.

Traceability:

- PRD: FR4, FR8
- Architecture: Migration Guide Strategy

**Acceptance Criteria:**

**Given** compatibility-impacting changes
**When** migration guide is generated
**Then** guide includes what changed, why, affected users, compatibility flags, and verification checklist
**And** before/after snippets are included for each changed behavior

Definition of Tests:

- Deterministic docs lint for required migration sections.
- Spot-check tests that sample migrations map to changed features.

### Story E6-S4: Resolve PD-5 strict default switch governance plan

As product and maintainer leadership,
I want a dated strict-mode default switch plan,
So that the major-version transition is controlled.

Traceability:

- PRD: DG3, NFR6
- Architecture: Pending Decisions PD-5

**Acceptance Criteria:**

**Given** adoption telemetry and migration readiness indicators
**When** PD-5 decision is finalized
**Then** target release and deprecation timeline are documented
**And** communication plan includes compatibility fallback window

Definition of Tests:

- Governance checklist verification for PD-5 decision artifact.
- Release readiness test asserting presence of deprecation timeline fields.

## Epic 7: Priority API Parity Expansion (Links, Withdrawals, Checkout)

Objective: Add priority API domains with additive, typed, and tested SDK contracts.

Scope:

- Collection links APIs.
- Withdrawals APIs.
- Checkout session API conditional on PD-4/DG5.
- Public export and documentation mapping updates.

Risks:

- Endpoint mismatch between reference specs and runtime behavior.
- Scope expansion can reduce quality if DG5 is ignored.

Dependencies:

- Epic 2 and Epic 3 foundational reliability.
- Decision PD-4 and PD-5 where applicable.

Epic Acceptance Criteria:

- Links and withdrawals methods are exposed, typed, and documented.
- Checkout session is implemented only if DG5 criteria are met.
- New methods include deterministic success/failure tests and mapping docs.

### Story E7-S1: Add collection links resource methods

As an integrator,
I want create/update/list collection links methods,
So that payment-link workflows are available through the SDK.

Traceability:

- PRD: FR12, FR15, FR19
- Architecture: PRD -> Architecture Traceability Matrix (FR12/FR15)

**Acceptance Criteria:**

**Given** selected links endpoints in scope
**When** links resource methods are added
**Then** methods expose typed request/response contracts and Resource extension pattern
**And** docs include endpoint/host/mode mapping

Definition of Tests:

- Deterministic success and failure tests per method.
- Contract tests validating exports and type availability.

### Story E7-S2: Add withdrawals resource methods

As an integrator,
I want withdrawal create/query methods,
So that payout workflows are available through the SDK.

Traceability:

- PRD: FR13, FR15, FR19
- Architecture: PRD -> Architecture Traceability Matrix (FR13/FR15)

**Acceptance Criteria:**

**Given** selected withdrawals endpoints in scope
**When** withdrawals resource methods are added
**Then** methods are typed, exported, and documented with host/mode details
**And** deterministic failure behavior follows Epic 2 contract

Definition of Tests:

- Deterministic success/failure endpoint tests.
- Integration mapping tests for host and payload mode routing.

### Story E7-S3: Resolve checkout session scope and implement conditionally (PD-4/DG5)

As product and tech leadership,
I want checkout session implementation gated by explicit quality criteria,
So that scope decisions do not degrade release reliability.

Traceability:

- PRD: FR14, DG5
- Architecture: Pending Decisions PD-4, PD-5 and Priority API workstream

**Acceptance Criteria:**

**Given** DG5 decision and quality status of links/withdrawals
**When** checkout scope is evaluated
**Then** checkout methods are implemented only if gate criteria are satisfied
**And** if deferred, backlog and roadmap record include explicit rationale and next due date

Definition of Tests:

- Gate compliance test for decision record existence.
- If implemented: deterministic success/failure contract tests.

### Story E7-S4: Complete export/type/docs linkage for new parity methods

As an SDK consumer,
I want new parity methods fully discoverable from top-level exports and docs,
So that usage is consistent across TS and JS workflows.

Traceability:

- PRD: FR15
- Architecture: Documentation and Contract Layer; Structure Rules

**Acceptance Criteria:**

**Given** newly added parity resources
**When** package build artifacts and docs are generated
**Then** top-level exports include all intended methods and types
**And** README mapping table references each new method

Definition of Tests:

- Deterministic build and export surface snapshot tests.
- Documentation cross-reference checks for all new methods.

## Implementation Sequence Plan

### Recommended Order

1. Epic 1 (contract alignment and unresolved drift)
2. Epic 2 (error/HTTP determinism; ADR-001 and ADR-003)
3. Epic 3 (auth lifecycle; ADR-002)
4. Epic 4 (compliance controls and evidence automation)
5. Epic 6 (semver governance and migration safety; ADR-004)
6. Epic 5 (developer-tool documentation contracts)
7. Epic 7 (parity expansion under quality gates)

### Parallelization Opportunities

- Epic 4 and Epic 5 can run in parallel after Epic 2 baseline contract is stable.
- Epic 6 governance artifacts can start in parallel with Epic 3 implementation.
- Epic 7 story E7-S1 and E7-S2 can run in parallel once shared transport/auth contracts are stable.

### Likely Blockers

- DG3 policy rollout sequencing must remain compatibility-first in current major.
- Missing official webhook signature contract keeps webhook utility out of scope.

## Decision Register (Resolved 2026-03-28)

1. PD-1 (DG1): plans.update support scope
   Owner: SDK Maintainer
   Due date: 2026-04-04
   Status: Closed
   Decision: mark unsupported in current cycle.

2. PD-2 (DG2): customers.list pagination contract
   Owner: SDK Maintainer
   Due date: 2026-04-04
   Status: Closed
   Decision: add optional args as backward-compatible minor.

3. PD-3 (DG4): webhook signature verification scope
   Owner: Security Lead + Tech Lead
   Due date: 2026-04-08
   Status: Closed
   Decision: defer until official algorithm contract is validated.

4. PD-4 (DG5): checkout session scope in phase 3
   Owner: Product + Tech Lead
   Due date: 2026-04-08
   Status: Closed
   Decision: defer checkout session to next cycle.

5. PD-5: strict mode default switch date
   Owner: Product + Maintainer
   Due date: 2026-04-15
   Status: Closed
   Decision: keep opt-in in current major and evaluate default flip for next major.

## Readiness Checklist

- [x] Every FR is mapped to at least one epic.
- [x] Every epic has explicit user-value objective.
- [x] ADR-001 to ADR-004 are covered by dedicated epics/stories.
- [x] Fintech compliance sections (compliance matrix, security architecture, audit requirements, fraud prevention) are covered.
- [x] Developer-tool sections (language matrix, installation methods, code examples strategy, migration guide strategy) are covered.
- [x] Deterministic test definitions are present in every story.
- [x] Secret redaction and secret-scan evidence are explicitly required.
- [x] Semver and migration impact are explicit in governance stories.
- [x] Decisions PD-1 to PD-5 are closed and recorded with owners and due dates.
