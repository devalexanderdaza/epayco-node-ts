# Project Overview — epayco-sdk-node-ts

## Purpose

**epayco-sdk-node-ts** (package name `epayco-sdk-node-ts`) is a **Node.js client library** for the [Epayco](https://www.epayco.co) payment platform. It wraps HTTP calls to Epayco’s APIs so applications can tokenize cards, manage customers and subscriptions, process charges, and use channels such as PSE, cash networks, Daviplata, and Safetypay.

Remote API base URLs are configurable via environment variables (see `src/constants.ts`); defaults point to Epayco production hosts.

## Executive summary

| Aspect               | Detail                                         |
| -------------------- | ---------------------------------------------- |
| **Repository type**  | Monolith (single package)                      |
| **Primary language** | TypeScript                                     |
| **Runtime**          | Node.js ≥ 18 (uses global `fetch`)             |
| **Distribution**     | npm package; published `files`: `dist` only    |
| **Module formats**   | ESM and CommonJS (`exports` in `package.json`) |
| **Testing**          | Vitest (`tests/**/*.test.ts`)                  |
| **Lint/format**      | Biome                                          |

## Tech stack summary

- **Build:** `tsup` — dual CJS/ESM, declarations, source maps, path alias `@` → `src`
- **HTTP:** Native `fetch` (`src/http.ts`); Bearer token after login
- **Crypto:** AES-style helpers for encrypted request bodies (`src/crypto.ts`, used by `Resource`)
- **i18n for errors:** JSON maps in `src/data/errors.json`; language from client config (`ES` / `EN`)

## Architecture type

**Layered SDK:** a thin **facade** (`Epayco` in `src/index.ts`) exposes **resource** objects (`Token`, `Customers`, `Charge`, …). Each resource extends `Resource`, which centralizes authentication, URL selection (standard vs secure vs Apify), payload encryption/mapping, and `sendRequest`.

## Documentation map

| Document                                             | Description                            |
| ---------------------------------------------------- | -------------------------------------- |
| [index.md](./index.md)                               | Master index and links                 |
| [architecture.md](./architecture.md)                 | Structure, data flow, extension points |
| [source-tree-analysis.md](./source-tree-analysis.md) | Directory layout                       |
| [component-inventory.md](./component-inventory.md)   | Public SDK modules and methods         |
| [development-guide.md](./development-guide.md)       | Setup, scripts, testing                |

## User-facing entry

- **Factory:** `createEpayco(options)` (also default export)
- **Class:** `Epayco` — holds credentials and resource instances

## Known documentation drift

The root **README.md** includes examples for `epayco.plans.update(...)`. The current TypeScript implementation in `src/resources/plans.ts` exposes `create`, `get`, `list`, and `delete` only—no `update` method. Treat README as partially legacy until aligned with code.
