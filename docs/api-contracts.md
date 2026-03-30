# API Contracts (SDK Surface -> Upstream Endpoints)

## Scope

This file documents the current TypeScript SDK method contracts and the upstream route each method calls.

## Contract Table

| SDK Resource | SDK Method | HTTP | Upstream Path | Mode Notes |
| --- | --- | --- | --- | --- |
| Token | `create(options)` | POST | `/v1/tokens` | default |
| Customers | `create(options)` | POST | `/payment/v1/customer/create` | default |
| Customers | `get(uid)` | GET | `/payment/v1/customer/{apiKey}/{uid}` | default |
| Customers | `list()` | GET | `/payment/v1/customers/{apiKey}` | default |
| Customers | `update(uid, options)` | POST | `/payment/v1/customer/edit/{apiKey}/{uid}` | default |
| Customers | `delete(options)` | POST | `/v1/remove/token` | default |
| Customers | `addDefaultCard(options)` | POST | `/payment/v1/customer/reasign/card/default` | `card=true` |
| Customers | `addNewToken(options)` | POST | `/v1/customer/add/token` | `card=true` |
| Plans | `create(options)` | POST | `/recurring/v1/plan/create` | default |
| Plans | `get(uid)` | GET | `/recurring/v1/plan/{apiKey}/{uid}` | default |
| Plans | `list()` | GET | `/recurring/v1/plans/{apiKey}` | default |
| Plans | `delete(uid)` | POST | `/recurring/v1/plan/remove/{apiKey}/{uid}` | default |
| Subscriptions | `create(options)` | POST | `/recurring/v1/subscription/create` | default |
| Subscriptions | `get(uid)` | GET | `/recurring/v1/subscription/{uid}/{apiKey}` | default |
| Subscriptions | `list()` | GET | `/recurring/v1/subscriptions/{apiKey}` | default |
| Subscriptions | `cancel(uid)` | POST | `/recurring/v1/subscription/cancel` | default |
| Subscriptions | `charge(options)` | POST | `/payment/v1/charge/subscription/create` | default |
| Bank | `create(options)` | POST | `/restpagos/pagos/debitos.json` | `sw=true` |
| Bank | `get(uid)` | GET | `/restpagos/pse/transactioninfomation.json?...` | `sw=true` |
| Bank | `getBanks()` | GET | `/restpagos/pse/bancos.json?...` | `sw=true` |
| Cash | `create(type, options)` | POST | `/restpagos/v2/efectivo/{provider}` | `sw=true,cashData=true` |
| Cash | `get(uid)` | GET | `/restpagos/transaction/response.json?...` | `sw=true` |
| Charge | `create(options)` | POST | `/payment/v1/charge/create` | default |
| Charge | `get(uid)` | GET | `/restpagos/transaction/response.json?...` | `sw=true` |
| Safetypay | `create(options)` | POST | `/payment/process/safetypay` | `card=true,apify=true` |
| Daviplata | `create(options)` | POST | `/payment/process/daviplata` | `card=true,apify=true` |
| Daviplata | `confirm(options)` | POST | `/payment/confirm/daviplata` | `card=true,apify=true` |

## Shared Request Contract

All resource methods delegate to:

`request(method, url, data, sw, cashData, card, apify)`

Where:

- `sw` selects secure host (`BASE_URL_SECURE`)
- `apify` selects Apify host (`BASE_URL_APIFY`)
- default path uses `BASE_URL`
- `cashData` and default mode alter payload formatting behavior
- `card=true` skips IP/test auto-injection

## Input and Output Contracts

- Inputs: strongly typed interfaces in `src/types.ts`
- Output: `Promise<ApiResponse>` (`Record<string, unknown>`)
- Error type: `EpaycoError` for selected SDK-side validation scenarios

## Current Contract Gaps

- `plans.update` is not part of the current SDK surface.
- `customers.list` has no typed pagination parameters.
- Runtime response schemas are not validated with schema libraries.
