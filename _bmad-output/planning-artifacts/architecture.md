---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/prd-validation-report.md
  - references/EPAYCO_NODE_TS_DEVELOPMENT_SPEC.md
  - references/TECH_REPORT.md
  - references/CURSOR_REPORT.md
  - references/epayco-openapi.yaml
  - README.md
  - src/
workflowType: architecture
project_name: epayco-node-ts
user_name: Alexander
date: 2026-03-28
classification:
  projectType: developer_tool
  domain: fintech
  complexity: high
lastStep: 8
status: complete
completedAt: 2026-03-28
---

# Architecture Decision Document - epayco-node-ts

## Executive Summary

This architecture defines an actionable, semver-aware evolution path for epayco-node-ts, focused on closing the critical validation gaps still open in the PRD cycle:

1. Fintech domain compliance: compliance matrix, security architecture, audit requirements, fraud prevention.
2. Developer-tool readiness: language matrix, installation methods, code examples strategy, migration guide strategy.

The design preserves the current SDK core (Node.js + TypeScript, Resource base class, strict typing, Vitest/Biome) while introducing explicit contracts for errors, HTTP semantics, authentication lifecycle, compatibility modes, and compliance evidence.

## Project Context Analysis

### Requirements Overview

Functional drivers:

- FR5-FR8 require deterministic runtime error behavior with migration safety.
- FR9-FR11 require token reuse with bounded retries and test/debug control.
- FR12-FR15 require additive parity expansion with endpoint/host/payload clarity.
- FR16-FR20 require docs-surface alignment, deterministic tests, and release discipline.

Non-functional drivers:

- NFR1-NFR2 require strict redaction and secret-safe observability.
- NFR3-NFR4 require typed transport failures and bounded auth retry behavior.
- NFR5 requires measurable auth overhead reduction through token cache.
- NFR6 requires semver gatekeeping for breaking behaviors.
- NFR7-NFR8 require enforceable implementation standards and test coverage.

### Scale and Complexity

- Complexity: High (regulated fintech + SDK compatibility constraints).
- Primary domain: Node.js SDK platform for payment APIs.
- Cross-cutting concerns: security, compatibility, reliability, compliance evidence, documentation traceability.

## Architecture Scope and Boundaries

### In Scope

- Error contract hardening and taxonomy.
- HTTP response policy, including HTTP 200 with business failure payloads.
- Token cache lifecycle and concurrency controls.
- Developer-tool architecture artifacts (language matrix, installation, examples, migration).
- Compliance controls and evidence model for fintech expectations.

### Out of Scope

- Dashboard/UI concerns.
- Full OpenAPI parity in one release.
- Webhook verification implementation without official signature contract.

## Current and Target Architecture

### Current Baseline

- Facade: src/index.ts builds resources and exposes SDK surface.
- Shared transport/auth path: src/resources/resource.ts -> src/http.ts.
- Error localization: src/errors.ts + src/data/errors.json.
- Resource model: all API resources extend Resource.

### Target Logical Components

1. SDK Public Surface

- Epayco facade, resource methods, public types, migration flags.

2. Transport and Error Layer

- sendRequest status handling, parse guards, typed error mapping.

3. Authentication Layer

- token provider/cache, retry policy, invalidation and lock per credentials.

4. Security and Compliance Layer

- redaction policy, audit event emitter, compliance evidence collector.

5. Documentation and Contract Layer

- method-to-endpoint mapping, compatibility notes, migration guides, examples.

## ADRs (Architecture Decision Records)

### ADR-001: Error Taxonomy and Error Contract

Status: Accepted

Context:

- PRD requires typed, catchable errors with remediation metadata (FR5, FR6, FR7).
- Current behavior can blur HTTP failures, parse failures, and business-level failures.

Decision:

- Introduce canonical SDK error taxonomy with explicit errorType values:
  - CONFIG_ERROR
  - NETWORK_ERROR
  - HTTP_ERROR
  - AUTH_ERROR
  - PARSE_ERROR
  - BUSINESS_ERROR
  - VALIDATION_ERROR
  - RATE_LIMIT_ERROR
  - INTERNAL_ERROR
- Standardize thrown contract for all SDK-controlled failures:
  - name: EpaycoError
  - errorCode: string
  - errorType: ErrorType
  - message: string (localized)
  - remediationHint: string
  - requestId?: string
  - statusCode?: number
  - cause?: unknown
  - details?: Record<string, unknown> (redacted)

Consequences:

- Positive: deterministic handling in integrator code and tests.
- Tradeoff: stricter behavior may alter consumer catch logic.

Semver/Migration:

- Default behavior in next minor uses compatibility mode for legacy semantics.
- Hard default switch to strict mode only in major.

### ADR-002: Token Cache Lifecycle (TTL, Refresh, Retry, Invalidation)

Status: Accepted

Context:

- Current implementation authenticates on every request.
- PRD requires measurable performance improvement and bounded retries (FR9-FR11, NFR4-NFR5).

Decision:

- Add in-memory token cache keyed by credential fingerprint + host mode.
- Token lifecycle policy:
  - TTL source priority: token expiry from auth response -> configured ttlMs -> default 10m.
  - Proactive refresh window: refresh when remaining TTL <= 60s.
  - Retry bounds: max 2 retries after auth failure.
  - Concurrency: single-flight login lock per cache key (max 1 active login).
  - Invalidation triggers:
    - 401/403 from protected request.
    - Explicit invalidateToken() call.
    - Credential changes.
    - TTL expiration.
- Configuration options:
  - tokenCache: enabled by default.
  - tokenCacheTtlMs: optional override.
  - disableTokenCache: true for tests/debug.

Consequences:

- Positive: lower auth overhead and reduced request latency.
- Tradeoff: stale token edge cases require strict invalidation flow.

Semver/Migration:

- Additive options in minor.
- Legacy auth-per-request mode available via explicit flag until major cutover.

### ADR-003: HTTP Policy for HTTP 200 with success=false

Status: Accepted (Compatibility-first)

Context:

- ePayco endpoints may return HTTP 200 with business-level failure payloads.
- PRD DG3 requires explicit policy.

Decision:

- Policy modes:
  - compatibility (default in minor): return payload, annotate metadata when business failure is detected.
  - strict (opt-in): throw BUSINESS_ERROR with payload attached in redacted details.
- Business failure detection rule:
  - payload.success === false OR payload.status in known failure states.
- Add client config:
  - businessFailureMode: "compatibility" | "strict".

Consequences:

- Positive: safe rollout with explicit contract and no surprise breakage.
- Tradeoff: dual-mode behavior requires explicit testing matrix.

Semver/Migration:

- Keep compatibility default in current major.
- Re-evaluate strict default for next major with migration notice.

### ADR-004: Semver Compatibility and Migration Mode Strategy

Status: Accepted

Context:

- PRD requires semver discipline and migration safety (FR4, FR8, NFR6).

Decision:

- Introduce centralized compatibility profile:
  - legacyErrorMode: preserves v1.x error semantics.
  - businessFailureMode: compatibility/strict.
  - authMode: perRequest/cached.
- Release policy:
  - Patch: docs, non-observable internals, typo fixes.
  - Minor: additive APIs and opt-in behavior flags.
  - Major: default behavior flips or breaking contract changes.
- Every release must include:
  - migration notes
  - compatibility table
  - upgrade examples before/after

Consequences:

- Positive: lower integrator migration risk and clearer change governance.
- Tradeoff: temporary dual behavior increases maintenance load.

Semver/Migration:

- Mandatory migration guide section for each compatibility-affecting release.

## Fintech Compliance Matrix

| Requirement                       | Control                                                       | Evidence                                                      | Owner                |
| --------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------- | -------------------- |
| Secret safety (NFR1)              | Redaction middleware for logs/errors; CI secret scan on tests | CI artifact: secret scan report = 0 findings; redaction tests | SDK Maintainer       |
| Typed secure errors (FR6, NFR2)   | Unified EpaycoError with sanitized details                    | Unit tests for redaction + contract snapshots                 | SDK Maintainer       |
| Transport reliability (NFR3)      | res.ok guard + parse-safe fallback + typed mapping            | HTTP failure branch tests; contract tests                     | Tech Lead            |
| Auth resilience (NFR4, NFR5)      | Token cache lock + bounded retries + invalidation triggers    | Auth lifecycle benchmark + retry tests                        | Tech Lead            |
| Release governance (NFR6)         | Semver gate checklist in release template                     | Release PR checklist + changelog sections                     | Maintainer + Product |
| Endpoint traceability (FR3, FR15) | Method-to-endpoint/host/mode matrix in docs                   | Docs CI check + reviewed mapping table                        | Tech Writer          |
| Auditability                      | Structured SDK events and correlation id propagation          | Event schema tests + sample evidence package                  | Security Lead        |
| Fraud baseline                    | Risk signal extraction and policy response levels             | Fraud signal unit tests + decision logs                       | Security Lead        |

## Security Architecture

### Threat Model (Primary)

1. Secret leakage in logs/errors.
2. Token replay or stale-token misuse.
3. Misclassification of payment failure conditions.
4. Insecure handling of raw third-party response payloads.
5. Overly permissive retries enabling abuse patterns.

### Security Controls

- Secret handling:
  - Never persist apiKey/privateKey/token in logs.
  - Masking policy for token/card/private key patterns.
- Transport controls:
  - Typed network/HTTP/parse paths with safe fallback.
- Auth controls:
  - Single-flight login lock per credential set.
  - Bounded retries and explicit invalidation.
- Contract controls:
  - Strict redaction before error enrichment.
  - Compatibility flags to avoid unsafe forced migrations.

### Redaction Policy

- Fields to mask: apiKey, privateKey, authorization, bearer_token, token, card_number, cvv, cvc.
- Masking rule: preserve first 4 + last 2 chars when useful; else full redact.
- Verification method:
  - Snapshot tests over error serialization.
  - CI regex guard over test output logs.

## Audit Requirements

### Auditable Events

- AUTH_START, AUTH_SUCCESS, AUTH_FAILURE
- REQUEST_SENT, RESPONSE_RECEIVED
- HTTP_ERROR_MAPPED, PARSE_ERROR_MAPPED, BUSINESS_ERROR_DETECTED
- TOKEN_CACHE_HIT, TOKEN_CACHE_MISS, TOKEN_INVALIDATED
- COMPATIBILITY_MODE_USED

### Retention and Traceability

- Retention:
  - CI artifacts: 90 days minimum.
  - Release evidence packages: per release tag.
- Traceability fields in every audit event:
  - timestamp
  - sdkVersion
  - eventType
  - correlationId
  - endpointPath
  - hostMode
  - errorType (if any)
  - redactionApplied: boolean

### Evidence Package (per release)

- Contract test report.
- Secret scan report.
- Benchmark report for token cache overhead.
- Docs traceability matrix update (methods/endpoints/modes).

## Fraud Prevention (Minimum Baseline)

### Minimal Detection Signals

- Repeated auth failures per credential fingerprint.
- Rapid repeated transaction attempts with same high-risk dimensions.
- Suspicious endpoint switching patterns across hosts/modes.
- Excessive retries after business failures.

### Risk Handling Policy

- Risk levels:
  - Low: log audit event.
  - Medium: add warning metadata in response context.
  - High: throttle retries and emit explicit RISK_FLAGGED event.
- Risk output contract:
  - riskLevel: low|medium|high
  - triggeredSignals: string[]
  - recommendedAction: observe|review|throttle

### Fraud Evidence

- Tests asserting signal detection behavior.
- Release notes section documenting risk logic changes.

## Developer Tool Architecture Sections

### Language Matrix (Initial)

| Language/Runtime       | Support Level | Delivery                  | Notes                                 |
| ---------------------- | ------------- | ------------------------- | ------------------------------------- |
| TypeScript (Node >=18) | GA            | Primary SDK source + d.ts | Canonical implementation              |
| JavaScript (Node >=18) | GA            | ESM/CJS outputs           | Same runtime behavior, typed via d.ts |
| Bun runtime            | Experimental  | Community guidance only   | No guaranteed CI matrix yet           |
| Deno                   | Not supported | N/A                       | No official compatibility commitment  |

### Installation Methods

| Method          | Status  | Command Pattern                | Use Case                  |
| --------------- | ------- | ------------------------------ | ------------------------- |
| npm             | GA      | npm install epayco-sdk-node-ts | Default public usage      |
| pnpm            | GA      | pnpm add epayco-sdk-node-ts    | Monorepos / pnpm users    |
| yarn            | GA      | yarn add epayco-sdk-node-ts    | Existing yarn projects    |
| Git URL install | Limited | npm i owner/repo#tag           | Temporary validation only |

### Code Examples Strategy

- Example taxonomy:
  - Quick start (install + initialize).
  - Core flows (token, customer, charge).
  - Error handling by taxonomy.
  - Compatibility mode examples (legacy vs strict).
  - New parity domains (links, withdrawals, checkout session if enabled).
- Example quality gates:
  - All snippets compile in CI.
  - Every example links to method-to-endpoint/host/mode table.
  - Every compatibility-sensitive example has before/after block.

### Migration Guide Strategy

- Guide structure per release:
  1. What changed.
  2. Why it changed.
  3. Who is affected.
  4. Compatibility flags to preserve old behavior.
  5. Exact before/after code snippets.
  6. Verification checklist.
- Trigger for mandatory migration note:
  - Any change touching error behavior, auth lifecycle, HTTP/business failure interpretation, or public method signatures.

## Implementation Patterns and Consistency Rules

### Naming and Type Rules

- Keep Resource subclass pattern for all new resources.
- Public method names in lowerCamelCase.
- Option and response types in PascalCase.
- No new broad any usage in public API paths.

### Structure Rules

- Transport and auth behavior centralized in src/http.ts and src/resources/resource.ts.
- Public exports normalized through src/index.ts and src/resources/index.ts.
- Compatibility flags and error contracts represented in src/types.ts.

### Testing Rules

- Deterministic success + failure path tests for each added/changed method.
- Dedicated tests for compatibility modes and cache lifecycle branches.
- Contract snapshots for serialized errors (including redaction).

## Project Structure and Boundaries (Execution Mapping)

### Logical Workstreams to Files

1. Error contract and taxonomy

- src/errors.ts
- src/types.ts
- src/http.ts
- src/data/errors.json
- tests/errors.test.ts
- tests/charge.test.ts

2. Token lifecycle and cache

- src/resources/resource.ts
- src/http.ts
- src/types.ts
- tests/setup.ts
- tests/epayco.test.ts

3. Documentation and migration discipline

- README.md
- docs/development-guide.md
- \_bmad-output/planning-artifacts/architecture.md
- release notes template (to be added)

4. Parity expansion and endpoint mapping

- src/resources/\*.ts
- src/resources/index.ts
- src/index.ts
- src/types.ts
- tests/\*.test.ts

## PRD -> Architecture Traceability Matrix

| PRD Item         | Architecture Coverage                                     | Artifact/Control                                |
| ---------------- | --------------------------------------------------------- | ----------------------------------------------- |
| FR1, FR2         | Installation methods + API surface consistency governance | Developer-tool installation matrix + docs gate  |
| FR3, FR15        | Method-to-endpoint/host/mode documentation contract       | Compliance matrix control + docs CI requirement |
| FR4, FR8         | Semver compatibility profile and migration mode           | ADR-004                                         |
| FR5, FR6, FR7    | Typed error taxonomy + parse/HTTP guards                  | ADR-001                                         |
| FR9, FR10, FR11  | Cache lifecycle with lock/retry/invalidation              | ADR-002                                         |
| FR12, FR13, FR14 | Additive parity in bounded phases                         | Workstream mapping + release policy             |
| FR16, FR17, FR18 | Contract alignment and message/type consistency           | Docs + errors governance controls               |
| FR19, FR20       | Deterministic test and evidence package policy            | Testing rules + audit requirements              |
| NFR1, NFR2       | Secret handling and redaction verification                | Security architecture + compliance matrix       |
| NFR3             | Deterministic typed non-2xx handling                      | ADR-001 + ADR-003                               |
| NFR4             | Bounded retries + single-flight auth                      | ADR-002                                         |
| NFR5             | Token overhead benchmark target                           | Audit evidence package                          |
| NFR6             | Semver-gated behavior changes                             | ADR-004                                         |
| NFR7, NFR8       | Resource pattern and test minimum bars                    | Consistency rules                               |
| DG1              | plans.update resolution path                              | Pending decision list                           |
| DG2              | customers.list pagination contract                        | Pending decision list                           |
| DG3              | 200 + success=false policy                                | ADR-003                                         |
| DG4              | webhook signature scope                                   | Pending decision list                           |
| DG5              | checkout session in phase 3                               | Pending decision list                           |

## Validation Readiness Against Critical Report Gaps

### Fintech Domain Compliance

- compliance_matrix: Complete in this document.
- security_architecture: Complete in this document.
- audit_requirements: Complete in this document.
- fraud_prevention: Complete in this document.

### Developer Tool Compliance

- language_matrix: Complete in this document.
- installation_methods: Complete in this document.
- code_examples: Complete strategy in this document.
- migration_guide: Complete strategy in this document.

## Pending Decisions (Owner + Due Date)

| ID         | Decision                             | Owner                     | Due Date   | Options                                   | Recommendation                                                                      |
| ---------- | ------------------------------------ | ------------------------- | ---------- | ----------------------------------------- | ----------------------------------------------------------------------------------- |
| PD-1 (DG1) | plans.update support scope           | SDK Maintainer            | 2026-04-04 | Implement now vs mark unsupported         | Mark unsupported in current cycle; schedule additive implementation in parity phase |
| PD-2 (DG2) | customers.list pagination contract   | SDK Maintainer            | 2026-04-04 | Add optional args vs document non-support | Add optional args as backward-compatible minor                                      |
| PD-3 (DG4) | webhook signature verification scope | Security Lead + Tech Lead | 2026-04-08 | Implement now vs defer                    | Defer until official algorithm contract is validated                                |
| PD-4 (DG5) | checkout session in phase 3          | Product + Tech Lead       | 2026-04-08 | Include vs defer                          | Include only if links and withdrawals stay on quality target                        |
| PD-5       | Strict mode default switch date      | Product + Maintainer      | 2026-04-15 | Next minor vs next major                  | Keep opt-in in current major; plan default flip for next major                      |

## Checklist for CE (Create Epics and Stories)

- [ ] Convert each ADR (001-004) into at least one implementation epic.
- [ ] Create a dedicated epic for compliance controls and evidence automation.
- [ ] Create stories for redaction tests, secret-scan CI gating, and audit event schema.
- [ ] Create stories for token cache lock, retry bounds, invalidation triggers, and benchmark harness.
- [ ] Create stories for compatibility profile flags and migration guide generation.
- [ ] Create stories for language/install/example matrices and docs CI checks.
- [ ] Link each story to PRD IDs (FR/NFR/DG) in acceptance criteria.
- [ ] Add deterministic success/failure tests requirement to every API behavior story.
- [ ] Add release-governance story: semver gate + changelog + migration notes template.
- [ ] Confirm pending decisions PD-1 to PD-5 before starting implementation stories that depend on them.

## Recommended Next Step

Proceed to CE using this document as architecture source of truth, starting with epics for:

1. Reliability contracts (errors + HTTP policy).
2. Auth lifecycle and performance.
3. Compliance and security evidence.
4. Developer-tool documentation and migration discipline.
