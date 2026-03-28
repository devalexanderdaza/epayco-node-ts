---
stepsCompleted:
  - step-01-init.md
  - step-02-discovery.md
  - step-02b-vision.md
  - step-02c-executive-summary.md
  - step-03-success.md
  - step-04-journeys.md
  - step-05-domain.md
  - step-06-innovation.md
  - step-07-project-type.md
  - step-08-scoping.md
  - step-09-functional.md
  - step-10-nonfunctional.md
  - step-11-polish.md
  - step-12-complete.md
inputDocuments:
  - references/EPAYCO_NODE_TS_DEVELOPMENT_SPEC.md
  - references/TECH_REPORT.md
  - references/CURSOR_REPORT.md
  - references/epayco-openapi.yaml
  - README.md
  - src/
workflowType: prd
documentLanguage: English
projectContext: brownfield
classification:
  projectType: developer_tool
  domain: fintech
  complexity: high
documentCounts:
  briefCount: 0
  researchCount: 2
  brainstormingCount: 0
  projectDocsCount: 6
---

# Product Requirements Document - epayco-node-ts

Author: Alexander
Date: 2026-03-28

## Executive Summary

epayco-node-ts is a TypeScript SDK for Node.js that abstracts ePayco payment APIs across legacy and Apify hosts into a unified, typed developer interface. The current codebase has strong engineering foundations (strict TypeScript, Vitest, Biome, dual ESM/CJS builds) but requires product hardening before broader adoption.

This PRD defines a phased roadmap to convert the current technical specification into an actionable product plan focused on reliability, clarity, and prioritized API parity. The plan does not target full OpenAPI coverage in one release; it targets progressive parity with measurable outcomes and semver-safe rollout decisions.

### What Makes This Special

- It treats SDK behavior consistency as a product capability, not only a technical concern.
- It explicitly aligns roadmap, semver impact, and compatibility risks to avoid accidental breaking changes.
- It provides traceability from each epic to concrete code evidence and impacted files.

## Problem and Opportunity

### Problem

- The SDK and docs are misaligned in key areas, creating integration risk and support overhead.
- HTTP and auth behavior are not production-hardened for common payment edge cases.
- API surface coverage is materially smaller than the documented OpenAPI/Postman landscape.
- Developer trust is reduced when contracts are unclear (error behavior, method availability, package naming in docs).

### Opportunity

- Turn a technically solid SDK base into a reliable, enterprise-ready integration product.
- Improve developer onboarding and time-to-first-success with accurate docs and predictable runtime behavior.
- Expand parity in high-value domains (payment links, withdrawals, checkout session) while preserving compatibility.

## Goals and Non-Goals

### Goals

- Deliver an actionable phased roadmap derived from the technical spec.
- Normalize product documentation to match real SDK behavior.
- Improve reliability in transport/auth/error handling.
- Add prioritized API domains with tests and clear host/mode mapping.
- Preserve semver discipline for all externally visible behavior changes.

### Non-Goals

- Full ePayco OpenAPI parity in a single release.
- Dashboard/UI replacement.
- Mutual TLS support in this PRD cycle.
- Mandatory runtime schema validation for all responses in initial phases.

## Personas and Primary Use Cases

### Persona 1: Backend Integrator Engineer

- Needs a fast, predictable Node SDK for payment workflows.
- Cares about typed methods, stable contracts, and clear examples.

Primary use cases:

- Tokenize cards, create customers, charge payments, handle subscriptions.
- Diagnose API failures quickly with actionable errors.

### Persona 2: Platform/SDK Maintainer

- Needs semver-safe evolution and testable acceptance criteria.
- Cares about avoiding regressions while adding new domains.

Primary use cases:

- Add endpoints/resources with minimal architecture drift.
- Keep docs, tests, and behavior aligned per release.

### Persona 3: Technical Decision Maker (CTO/Lead)

- Needs confidence the SDK is production-ready for payment-critical flows.
- Cares about risk, rollout safety, and roadmap clarity.

Primary use cases:

- Evaluate adoption risk and migration cost.
- Approve phased investment based on measurable outcomes.

## Scope by Phase (Aligned to SPEC Roadmap)

### Phase 1: Stabilization

- Align README with package and actual API surface.
- Resolve known inconsistencies in errors and listed capabilities.
- Add focused tests for corrected behavior and docs examples.

### Phase 2: HTTP and Authentication Hardening

- Introduce explicit HTTP failure handling and error taxonomy.
- Add JWT cache/refresh strategy to avoid re-login on every request.
- Define and document opt-in vs default behavior changes.

### Phase 3: Priority API Parity

- Add one or two high-value domains first:
  - Collection links.
  - Withdrawals.
  - Smart checkout session (if prioritized by business).
- Ensure each added method documents host/mode flags and test coverage.

### Phase 4: Hardening and Ecosystem Confidence

- Webhook verification utility only if official algorithm is fully specified.
- Optional runtime validation for critical responses.
- Improve generated docs and release communication quality.

## Prioritized Functional Requirements

### Capability Area: Documentation and Product Contract

- FR1: Developers can install the correct package name from official docs.
- FR2: Developers can see only methods that exist in the current SDK version.
- FR3: Developers can understand per-method host/mode expectations from docs.
- FR4: Maintainers can publish release notes with semver impact and migration notes.

### Capability Area: Transport and Error Reliability

- FR5: SDK requests can distinguish network/HTTP failures from API business failures.
- FR6: SDK users can catch typed errors with actionable metadata.
- FR7: SDK requests can handle non-JSON responses without silent crashes.
- FR8: SDK users can choose compatibility mode for legacy error behavior when applicable.

### Capability Area: Authentication Lifecycle

- FR9: SDK can reuse valid auth tokens across multiple requests.
- FR10: SDK can refresh or re-authenticate on token expiration/authorization failure.
- FR11: SDK users can configure or disable token cache for testing/debug scenarios.

### Capability Area: API Parity Expansion

- FR12: SDK users can create, update, and list collection links through dedicated methods.
- FR13: SDK users can create and consult withdrawals through dedicated methods.
- FR14: SDK users can create checkout sessions if selected for phase scope.
- FR15: Each new method maps to documented endpoint, host, and payload mode.

### Capability Area: Existing Surface Alignment

- FR16: SDK and README agree on plans capabilities (including update decision).
- FR17: SDK and README agree on customers list pagination support decision.
- FR18: Cash provider messaging aligns with supported provider type union.

### Capability Area: Developer Confidence and Testability

- FR19: Every changed or added behavior is covered by deterministic tests.
- FR20: Integration-test strategy is documented for sandbox-only secure credentials.

## Non-Functional Requirements

### Security

- NFR1: No sensitive secrets (private keys, tokens, card data) are logged in normal or error paths.
- NFR2: Error objects must redact or avoid raw secret exposure by default.

### Reliability

- NFR3: HTTP layer must return deterministic typed failures for non-2xx responses.
- NFR4: Authentication retry/caching logic must not duplicate uncontrolled login bursts.

### Performance

- NFR5: Repeated SDK operations should avoid per-request auth latency when token remains valid.

### Compatibility

- NFR6: Behavior changes with breaking potential must be gated via semver-major or explicit opt-in.

### Maintainability

- NFR7: New resources follow existing Resource pattern and test conventions.
- NFR8: Every new endpoint method includes test coverage and documentation linkage.

## Risks, Dependencies, and Assumptions

### Key Risks

- R1: Breaking runtime behavior while hardening HTTP/error flow.
- R2: API/docs drift persists if README and code are not version-locked.
- R3: Token caching can introduce stale-token bugs if TTL/refresh strategy is incorrect.
- R4: Expanding parity too quickly can lower quality of existing critical flows.
- R5: Incomplete webhook signature documentation can lead to insecure or incorrect helper implementations.

### Dependencies

- D1: OpenAPI/Postman as reference sources for endpoint surface.
- D2: Access to ePayco sandbox behavior for integration validation.
- D3: Maintainer capacity for phased rollout and release-note discipline.

### Assumptions

- A1: SPEC remains source-of-truth for phase boundaries.
- A2: Brownfield continuity is required; migration friction must be minimized.
- A3: Not all endpoints need immediate abstraction to deliver product value.

## Measurable Success Criteria

- SC1: README-package mismatch reduced to zero in the next release.
- SC2: All documented methods in README exist in the SDK (or are clearly version-scoped).
- SC3: HTTP/auth hardening epics ship with tests demonstrating failure-path handling.
- SC4: Average auth calls per multi-request flow reduced through token reuse.
- SC5: At least one prioritized parity domain ships with complete tests and docs.
- SC6: No critical regressions in existing payment flows after stabilization/hardening phases.

## Epic Acceptance Criteria

### Epic 1: Documentation and Existing Resource Alignment

- AC1.1: README installation command uses the published package name.
- AC1.2: README no longer advertises non-existent methods for current version.
- AC1.3: Decision recorded for plans update support: implement or document as not supported.
- AC1.4: Decision recorded for customers list pagination: implement or document as not supported.
- AC1.5: Error message catalog corrections are consistent with type unions and provider coverage.

### Epic 2: HTTP and Error Handling

- AC2.1: Non-2xx responses are handled with typed SDK errors.
- AC2.2: Non-JSON responses return controlled parse failures.
- AC2.3: 200 responses with business-failure payloads follow a documented policy.
- AC2.4: Tests cover transport, parse, and business-error branches.

### Epic 3: Authentication Cache and Lifecycle

- AC3.1: Token cache keying strategy is documented and implemented.
- AC3.2: Token reuse reduces repeated login calls in multi-request scenarios.
- AC3.3: Expired/invalid token path triggers re-auth with bounded retries.
- AC3.4: Test/debug mode can disable cache.

### Epic 4: Priority API Parity

- AC4.1: New resource methods expose selected priority domains.
- AC4.2: Each method includes host and mode mapping validation tests.
- AC4.3: Public types for new methods are available from top-level exports.
- AC4.4: README/docs include method-to-endpoint mapping.

### Epic 5: Quality Hardening and Validation Utilities

- AC5.1: Webhook helper is added only if official verification contract is complete.
- AC5.2: Optional runtime validation is scoped to critical payloads if introduced.
- AC5.3: Documentation generation strategy is defined for public API evolution.

## Traceability Matrix

### Epic 1: Documentation and Existing Resource Alignment

- Existing technical evidence:
  - README installs a different package name than package metadata.
  - README documents plans update while plans resource has no update method.
  - README suggests customer list pagination while customers list has no args.
  - Error catalog contains code prefix mismatch and cash provider mismatch.
- Impacted files:
  - README.md
  - src/resources/plans.ts
  - src/resources/customers.ts
  - src/data/errors.json
  - src/types.ts
- Compatibility risks:
  - Implementing missing methods may change public API shape (minor if additive).
  - Removing/altering documented behavior can be breaking for users relying on docs assumptions.

### Epic 2: HTTP and Error Handling

- Existing technical evidence:
  - sendRequest currently returns res.json without status guard.
  - authenticate also parses JSON without explicit status handling.
- Impacted files:
  - src/http.ts
  - src/errors.ts
  - src/types.ts
  - tests/
- Compatibility risks:
  - Throwing exceptions for previously returned payloads may be breaking.
  - Error type changes can affect consumer catch logic.

### Epic 3: Authentication Cache and Lifecycle

- Existing technical evidence:
  - Resource.request authenticates on every request.
- Impacted files:
  - src/resources/resource.ts
  - src/http.ts
  - src/types.ts
  - tests/
- Compatibility risks:
  - Token cache can introduce stale state edge cases.
  - Refresh semantics may change timing and side effects.

### Epic 4: Priority API Parity

- Existing technical evidence:
  - OpenAPI includes links/withdraw/session domains not wrapped in src/resources.
- Impacted files:
  - src/resources/
  - src/index.ts
  - src/resources/index.ts
  - src/types.ts
  - tests/
  - README.md
- Compatibility risks:
  - Low risk if additive, but medium if shared request behavior is modified.
  - Endpoint mismatch risk between OpenAPI and runtime ePayco behavior.

### Epic 5: Quality Hardening and Validation Utilities

- Existing technical evidence:
  - Reports identify webhook helper gap and optional validation opportunity.
- Impacted files:
  - src/
  - tests/
  - README.md
- Compatibility risks:
  - Enforced validation may reject payloads previously accepted.
  - Incorrect webhook assumptions can create false trust.

## Semver Impact Analysis

### Likely Patch

- Documentation-only fixes with no runtime/API behavior change.
- Error text typo corrections that do not alter code contracts.
- Internal refactors with zero observable behavior difference.

### Likely Minor

- Adding new resource classes/methods without changing existing signatures.
- Adding optional configuration flags with backward-compatible defaults.
- Adding new exported types that do not break existing imports.

### Likely Major

- Changing default HTTP error behavior from returning payloads to throwing errors.
- Changing interpretation of successful HTTP status with business-failure payload.
- Changing authentication flow semantics in a way that alters observable behavior.
- Removing or renaming public methods/types.

## Open Questions and Pending Decisions

- Q1: Should plans update be implemented now or removed from docs until supported?
- Q2: Should customers list support pagination arguments in SDK surface?
- Q3: Should 200 with success=false throw by default, or remain compatibility-first?
- Q4: What is the official webhook signature verification contract and timeline?
- Q5: Is checkout session in-scope for Phase 3 or deferred?

## Explicit Assumptions and Pending Validations

### Assumptions

- S1: SPEC phase ordering remains approved.
- S2: Fintech domain complexity requires explicit security/compliance NFRs.
- S3: Priority parity starts with links/withdraw due business impact and manageable scope.

### Pending Validations

- V1: Confirm ePayco behavior for 200 + success=false across critical endpoints.
- V2: Confirm Apify auth header trailing semicolon requirement with official docs.
- V3: Confirm pagination support expectations for customer listing endpoint.
- V4: Confirm exact release policy for introducing typed error exceptions.

## Inconsistencies Detected and Recommended Resolution

### Inconsistency 1

- Observation: README package installation string differs from package metadata.
- Risk: Wrong installation target and support incidents.
- Resolution: Update README installation and add release note.

### Inconsistency 2

- Observation: README documents plans update, but plans resource lacks update.
- Risk: Integration attempts fail or require workaround.
- Resolution: Choose one path explicitly: implement method (minor) or remove docs claim (patch).

### Inconsistency 3

- Observation: README implies customers list pagination input; current method has no args.
- Risk: Developer confusion and silent ignored expectations.
- Resolution: Implement optional pagination args (minor) or document non-support.

### Inconsistency 4

- Observation: TECH report states axios while code uses native fetch.
- Risk: Design decisions made from stale assumptions.
- Resolution: Treat code plus SPEC/CURSOR report as source of truth; mark TECH note as historical.

### Inconsistency 5

- Observation: Error code 102 text prefix and 109 cash providers mismatch code/type surface.
- Risk: Misleading debugging and poor developer trust.
- Resolution: Correct error messages and align with CashProvider union.

## Release Prioritization Proposal for Next Cycle

### Conservative Option

- Scope:
  - Epic 1 only (docs and existing surface alignment).
  - Minimal-risk test additions.
- Benefits:
  - Fast trust recovery with low regression risk.
- Tradeoffs:
  - Core reliability and parity gaps remain open.

### Balanced Option

- Scope:
  - Epic 1 + Epic 2 + Epic 3 (with compatibility-first defaults).
  - Start design and stubs for one parity domain.
- Benefits:
  - Significant reliability gains and better developer confidence.
- Tradeoffs:
  - Requires careful semver/migration communication.

### Aggressive Option

- Scope:
  - Epic 1 through Epic 4 in one cycle.
  - Include at least two parity domains plus HTTP/auth hardening.
- Benefits:
  - Maximum product momentum and feature coverage.
- Tradeoffs:
  - Highest regression and delivery risk; stronger QA burden required.

## Recommended Plan

Use the Balanced option:

- It addresses highest risk areas first (contract clarity + runtime reliability).
- It keeps compatibility manageable while enabling near-term parity expansion.
- It creates cleaner handoff inputs for architecture and epic decomposition.
