# Development Guide

## Prerequisites

- **Node.js** ≥ 18 (see `package.json` `engines`)
- **pnpm** (used in `prepublishOnly`; npm/yarn can work if you adjust commands)

## Install

```bash
pnpm install
```

## Environment variables (optional)

Defined in `src/constants.ts` with defaults for Epayco hosts:

| Variable         | Purpose                                                             |
| ---------------- | ------------------------------------------------------------------- |
| `BASE_URL_SDK`   | Primary API base (default `https://api.secure.payco.co`)            |
| `SECURE_URL_SDK` | Secure host for encrypted flows (default `https://secure.payco.co`) |
| `BASE_URL_APIFY` | Apify host (default `https://apify.epayco.co`)                      |

Use these for staging or testing against non-production endpoints.

## Scripts

| Command           | Description                                |
| ----------------- | ------------------------------------------ |
| `pnpm build`      | `tsup` — outputs `dist/` (CJS, ESM, types) |
| `pnpm test`       | `vitest run`                               |
| `pnpm test:watch` | Vitest watch mode                          |
| `pnpm lint`       | `biome check .`                            |
| `pnpm lint:fix`   | Biome with `--write --unsafe`              |
| `pnpm format`     | `biome format --write .`                   |
| `pnpm typecheck`  | `tsc --noEmit`                             |

## Project conventions

- **Path alias:** `@/` maps to `src/` (see `tsconfig.json` and `vitest.config.ts`).
- **Package type:** `"type": "module"` — ESM-first; CJS via `require` entry in `exports`.
- **Published files:** only `dist/` is included in the npm package (`files` field).

## Testing

- Tests: `tests/**/*.test.ts`
- Setup: `tests/setup.ts` if present for shared mocks
- Run all tests: `pnpm test`  
  _(Scan run: 10 files, 36 tests passed.)_

## CI/CD

No `.github/workflows` directory was present at documentation time. Add workflows locally if you need automated test/lint on push or publish.

## Contributing

There is no `CONTRIBUTING.md` in the repository root. For pull requests, follow Biome rules and ensure `pnpm test` and `pnpm typecheck` pass before submitting.
