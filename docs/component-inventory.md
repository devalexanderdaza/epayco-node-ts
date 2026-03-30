# Component Inventory

## Component Taxonomy

This SDK is organized by runtime role instead of UI components.

### Facade Components

| Component | File | Responsibility |
| --- | --- | --- |
| `Epayco` | `src/index.ts` | Main public client that composes all resources |
| `createEpayco` | `src/index.ts` | Factory helper for client construction |

### Core Infrastructure Components

| Component | File | Responsibility |
| --- | --- | --- |
| `Resource` | `src/resources/resource.ts` | Shared request orchestrator |
| `authenticate` | `src/http.ts` | Login flow for legacy/Apify endpoints |
| `sendRequest` | `src/http.ts` | Generic HTTP JSON request sender |
| `getIp` | `src/http.ts` | IP auto-resolution helper |
| `encrypt` / `encryptHex` | `src/crypto.ts` | Legacy-compatible payload encryption helpers |
| `encodeBasicAuth` | `src/crypto.ts` | Basic authorization token helper |
| `langkey` / `langkeyApify` | `src/keylang.ts` | Payload key mapping adapters |
| `EpaycoError` | `src/errors.ts` | Localized SDK error class |

### Domain Resource Components

| Resource | File | Main Methods |
| --- | --- | --- |
| `Token` | `src/resources/token.ts` | `create` |
| `Customers` | `src/resources/customers.ts` | `create`, `get`, `list`, `update`, `delete`, `addDefaultCard`, `addNewToken` |
| `Plans` | `src/resources/plans.ts` | `create`, `get`, `list`, `delete` |
| `Subscriptions` | `src/resources/subscriptions.ts` | `create`, `get`, `list`, `cancel`, `charge` |
| `Bank` | `src/resources/bank.ts` | `create`, `get`, `getBanks` |
| `Cash` | `src/resources/cash.ts` | `create`, `get` |
| `Charge` | `src/resources/charge.ts` | `create`, `get` |
| `Safetypay` | `src/resources/safetypay.ts` | `create` |
| `Daviplata` | `src/resources/daviplata.ts` | `create`, `confirm` |

### Static Data Components

| Data Asset | File | Purpose |
| --- | --- | --- |
| Error dictionary | `src/data/errors.json` | Error code -> localized message mapping |
| Generic keylang map | `src/data/keylang.json` | Legacy payload key translation |
| Apify keylang map | `src/data/keylang_apify.json` | Apify payload key translation |

## Reusability Notes

- Highly reusable:
  - `Resource.request()` orchestration pipeline
  - `http.ts` helpers
  - `crypto.ts` compatibility helpers
- Domain-specific:
  - Individual resource endpoint methods

## Gaps and Alignment Notes

- `Plans` does not currently expose `update`.
- Customer list method currently has no typed pagination parameters.
- Split-like capabilities appear as payload fields in payment operations rather than a dedicated resource class.
