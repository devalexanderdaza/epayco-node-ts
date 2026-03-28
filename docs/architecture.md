# Architecture — epayco-sdk-node-ts

## Executive summary

The SDK is a **single-package TypeScript library** that exposes a **facade object** (`Epayco`) composed of **resource classes**. Each resource targets a subset of Epayco’s HTTP APIs. All network access goes through an abstract **`Resource`** base class that performs login, builds headers, selects the correct base URL, and optionally transforms payloads (encryption, key language mapping, or Apify-specific mapping).

## Technology stack

| Category | Technology          | Notes                                 |
| -------- | ------------------- | ------------------------------------- |
| Language | TypeScript (strict) | `tsconfig` ES2022, bundler resolution |
| Runtime  | Node.js ≥ 18        | Relies on global `fetch`              |
| Build    | tsup                | CJS + ESM, `.d.ts`, sourcemaps        |
| Tests    | Vitest 4.x          | Node environment, `@` alias           |
| Quality  | Biome 2.x           | `lint`, `format` scripts              |

## Architecture pattern

**Client SDK / adapter layer:** no embedded HTTP server. The design is:

1. **Configuration** — `EpaycoOptions` validated in `Epayco` constructor (`apiKey`, `privateKey`, `test`, optional `lang`).
2. **Authentication** — `authenticate()` in `http.ts` posts to `/v1/auth/login` (or Apify login with Basic auth).
3. **Request execution** — `Resource.request()` obtains a bearer token, merges `extras_epayco`, fills `ip` (via `getIp()` unless card flow), sets `test` mode, then delegates to `setData()` when using secure or Apify paths.
4. **Payload encoding** — Three paths in `setData()`: Apify key mapping (`langkeyApify`), cash-specific mapping (`langkey` + static fields), or AES encryption of fields (`encrypt` / `encryptHex`) for default API routes.

## Data and configuration

- **No local database** — all persistent state lives on Epayco’s servers.
- **Types** — `src/types.ts` defines request option interfaces; responses are largely `ApiResponse` (`Record`-like) for flexibility.
- **Errors** — `EpaycoError` maps numeric codes to localized strings from `src/data/errors.json`.

## API design (SDK surface)

The SDK does not define REST routes; it **consumes** Epayco REST paths inside each resource (e.g. `/recurring/v1/plan/create`). See [component-inventory.md](./component-inventory.md) for the method list.

## Security notes

- **Secrets:** `privateKey` is used for encryption and login; consumers must not expose it client-side in browsers.
- **IP:** `getIp()` calls `https://api.ipify.org` when `ip` is not set—consider privacy and reliability for your deployment.

## Source tree reference

See [source-tree-analysis.md](./source-tree-analysis.md).

## Development workflow

See [development-guide.md](./development-guide.md).

## Testing strategy

Tests live under `tests/`, one file per domain (`charge.test.ts`, `customers.test.ts`, …) plus `crypto.test.ts`, `errors.test.ts`, `epayco.test.ts`. They use Vitest with the same path aliases as production code.

## Deployment

The artifact is an **npm package** (`prepublishOnly` runs `pnpm build`). There is **no Dockerfile or GitHub Actions workflow** in this repository at scan time—release process is undefined in-repo.
