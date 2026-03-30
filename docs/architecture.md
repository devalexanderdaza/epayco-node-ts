# Architecture Document

## Executive Summary

This repository implements a Node.js TypeScript SDK for ePayco integrations. The architecture is intentionally compact and relies on a facade that aggregates domain resources, all powered by a shared request pipeline.

The system optimizes maintainability by centralizing:

- Authentication
- HTTP request dispatch
- Payload translation and encryption rules
- Base URL selection across ePayco surfaces

## Architecture Pattern

- Primary Pattern: Facade + Resource Modules + Shared Transport Core
- Repository Shape: Monolith library
- Boundary Style: SDK methods mapped to external HTTP endpoints

## Runtime Components

### Facade Layer

- File: `src/index.ts`
- Responsibilities:
  - Validates options (`apiKey`, `privateKey`, `test`, `lang`)
  - Normalizes runtime flags (`test` -> `TRUE|FALSE`)
  - Instantiates all resource modules with shared config

### Resource Layer

- Folder: `src/resources/`
- Responsibilities:
  - Expose domain APIs (`create`, `get`, `list`, `delete`, etc.)
  - Forward endpoint-specific data to shared `request()`
  - Keep business capability segmentation clear

### Shared Request Core

- File: `src/resources/resource.ts`
- Responsibilities:
  - Calls `authenticate()`
  - Injects common metadata (`extras_epayco`, `test`, `ip`)
  - Switches payload mode using request flags:
    - default encrypted flow
    - `sw` secure legacy flow
    - `cashData` mode
    - `card` mode
    - `apify` mode
  - Selects final host URL based on mode

### HTTP and Auth Layer

- File: `src/http.ts`
- Responsibilities:
  - Performs auth for legacy and Apify paths
  - Sends JSON requests via native `fetch`
  - Resolves public IP fallback when needed

### Data and Mapping Layer

- Files:
  - `src/keylang.ts`
  - `src/data/keylang.json`
  - `src/data/keylang_apify.json`
  - `src/data/errors.json`
- Responsibilities:
  - Translate logical field names to provider-specific key contracts
  - Provide localized error messages by code

## Domain Module Map

- `Token`: card tokenization
- `Customers`: customer lifecycle + card binding operations
- `Plans`: recurring plan CRUD subset (without update)
- `Subscriptions`: recurring subscriptions + charge + cancel
- `Bank`: PSE and bank listing/lookup
- `Cash`: cash payment providers (efecty/baloto/gana/redservi/puntored/sured)
- `Charge`: charge and transaction lookup
- `Safetypay`: Safetypay processing
- `Daviplata`: Daviplata create/confirm operations

## Data Architecture

No internal database is used by this SDK. Data architecture is request/response-oriented:

- Input contracts are typed in `src/types.ts`.
- Outbound payloads are transformed dynamically before transport.
- Responses are returned as generic API objects (`ApiResponse`), with domain-specific interpretation left to consumers.

## API Design Characteristics

- Synchronous-looking async methods returning `Promise<ApiResponse>`.
- Domain-consistent method naming (`create/get/list/delete/cancel/confirm`).
- Host and payload concerns hidden from SDK consumers.

## Security and Compliance Decisions

- AES compatibility mode retained for legacy encrypted paths.
- Basic Auth and Bearer token flows handled internally.
- Sensitive credentials are passed through constructor config; no persistence layer.

## Testing Strategy

- Unit-focused tests with mocked `fetch`.
- Coverage emphasis on transport composition and route contracts.
- No mandatory live integration tests in default CI scripts.

## Deployment and Distribution

- Distributed as npm package.
- Build output produced with `tsup` to support ESM and CJS consumers.
- Node.js 18+ required.

## Architecture Decisions and Trade-offs

- Decision: centralize request complexity in `Resource`.
  - Benefit: lower duplication and faster endpoint additions.
  - Cost: flag-based request behavior can become harder to reason about at scale.

- Decision: keep broad `ApiResponse` for consumer flexibility.
  - Benefit: supports inconsistent upstream contracts.
  - Cost: reduced compile-time guarantees for downstream app logic.

- Decision: preserve key translation dictionaries.
  - Benefit: shields consumers from heterogeneous API payload naming.
  - Cost: requires ongoing mapping maintenance as API evolves.
