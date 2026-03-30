# Project Overview: epayco-sdk-node-ts

## Executive Summary

`epayco-sdk-node-ts` is a TypeScript SDK for Node.js that wraps ePayco payment services behind a single typed client (`Epayco`).
The codebase is a single-package monolith (library type) with strict TypeScript settings, dual module output (ESM + CJS), and a test-first workflow using Vitest.

The architecture follows a facade + resource pattern:

- `Epayco` is the public facade.
- Resource classes (`Token`, `Customers`, `Plans`, etc.) encapsulate domain-specific operations.
- `Resource.request()` centralizes authentication, payload shaping/encryption, and HTTP dispatch.

## Project Classification

- Repository Type: Monolith
- Project Type: Library SDK
- Primary Language: TypeScript
- Runtime Baseline: Node.js >= 18
- Packaging: npm package (`type: module`) with CJS + ESM exports

## Primary Use Cases

- Tokenization and card operations
- Customer management
- Recurring plans and subscriptions
- Card charges
- PSE and cash collection flows
- Alternative payment methods (Daviplata, Safetypay)

## Technology Stack

| Category | Technology | Version / Mode | Why It Matters |
| --- | --- | --- | --- |
| Language | TypeScript | ^5.9.3 (strict) | Strong typing and safer SDK surface |
| Runtime | Node.js | >=18 | Required for native fetch and modern JS APIs |
| Build | tsup | ^8.5.1 | Produces ESM + CJS + declaration files |
| Testing | Vitest | ^4.0.18 | Fast unit tests with fetch mocking |
| Lint/Format | Biome | ^2.4.5 | Unified linting/formatting rules |
| Crypto | node:crypto | Native | AES compatibility for legacy encrypted flows |

## Architecture Pattern

- Pattern: Facade + Domain Resources + Shared Request Pipeline
- Entry Point: `src/index.ts`
- Shared Core: `src/resources/resource.ts`, `src/http.ts`, `src/crypto.ts`, `src/keylang.ts`

## Public SDK Surface

The `Epayco` client exposes these resources:

- `token`
- `customers`
- `plans`
- `subscriptions`
- `bank`
- `cash`
- `charge`
- `safetypay`
- `daviplata`

See `./component-inventory.md` and `./api-contracts.md` for details.

## Key Design Decisions

- Unified resource API around `request(method, url, data, flags...)` to avoid duplicated transport logic.
- Three base URLs supported (`api.secure.payco.co`, `secure.payco.co`, `apify.epayco.co`) selected by request mode.
- Key translation (`keylang`) is used to adapt SDK keys to provider-specific payload keys.
- Legacy-compatible AES transformation is preserved for encrypted request flows.

## Test Posture

- Unit tests cover client initialization, resource behavior, URL composition, and selected contract consistency.
- Tests mock `globalThis.fetch`; no live integration test suite is included by default.

## Known Constraints

- Authentication is currently requested per operation (`authenticate` in each request path).
- HTTP responses are parsed as JSON directly; status normalization is limited.
- README examples include some legacy expectations that differ from the typed SDK surface.
