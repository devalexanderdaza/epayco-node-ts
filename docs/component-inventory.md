# Component Inventory — Public SDK Surface

For this library, “components” are **exported modules and classes** that consumers instantiate or call. The default export is `createEpayco` (same as named export).

## Core exports (`src/index.ts`)

| Export                                             | Kind     | Description                                |
| -------------------------------------------------- | -------- | ------------------------------------------ |
| `createEpayco`                                     | function | Factory: `createEpayco(options) => Epayco` |
| `Epayco`                                           | class    | Facade holding all resources               |
| `EpaycoError`                                      | class    | Error with localized message from code     |
| `EpaycoOptions`, `EpaycoConfig`, option interfaces | types    | Re-exported from `@/types`                 |

## `Epayco` instance properties

| Property        | Class           | Role                                  |
| --------------- | --------------- | ------------------------------------- |
| `token`         | `Token`         | Card tokenization                     |
| `customers`     | `Customers`     | Customer CRUD-style operations        |
| `plans`         | `Plans`         | Recurring plans                       |
| `subscriptions` | `Subscriptions` | Subscriptions lifecycle + charge      |
| `bank`          | `Bank`          | PSE banks list and transactions       |
| `cash`          | `Cash`          | Cash network payments (provider enum) |
| `charge`        | `Charge`        | One-off card charges                  |
| `safetypay`     | `Safetypay`     | Safetypay create                      |
| `daviplata`     | `Daviplata`     | Daviplata create + confirm            |

## Resource methods (by file)

### Token (`token.ts`)

- `create(options: TokenCreateOptions)`

### Customers (`customers.ts`)

- `create`, `get`, `list`, `update`, `delete`, `addDefaultCard`, `addNewToken`

### Plans (`plans.ts`)

- `create`, `get`, `list`, `delete`  
  _(No `update` in current source—README may still mention it.)_

### Subscriptions (`subscriptions.ts`)

- `create`, `get`, `list`, `cancel`, `charge`

### Bank (`bank.ts`)

- `create`, `get`, `getBanks`

### Cash (`cash.ts`)

- `create(type: CashProvider, options)`, `get`

### Charge (`charge.ts`)

- `create`, `get`

### Daviplata (`daviplata.ts`)

- `create`, `confirm`

### Safetypay (`safetypay.ts`)

- `create`

## Internal building blocks (not typically imported by apps)

| Module     | Responsibility                          |
| ---------- | --------------------------------------- |
| `Resource` | Auth + `request()` + `setData()`        |
| `http`     | Login, generic JSON POST/GET, IP helper |
| `crypto`   | Encrypt helpers for payload path        |
| `keylang`  | Field name mapping for Apify / cash     |

## JSON data assets

- `src/data/errors.json` — Epayco error codes × language
- `src/data/keylang*.json` — Payload key translation for encryption/Apify flows
