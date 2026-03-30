# Development Guide

## Prerequisites

- Node.js >= 18
- npm or pnpm

## Installation

```bash
npm install
```

## Local Quality Commands

```bash
npm run typecheck
npm test
npm run build
```

Optional formatting/linting:

```bash
npm run lint
npm run lint:fix
npm run format
```

## Build Output

- Tool: `tsup`
- Entry: `src/index.ts`
- Outputs:
  - `dist/index.js` (ESM)
  - `dist/index.cjs` (CommonJS)
  - declaration files (`.d.ts`)

## Testing Approach

- Framework: Vitest
- Environment: Node
- Test pattern: `tests/**/*.test.ts`
- Main strategy:
  - Mock `fetch`
  - Assert URL composition and request behavior
  - Validate facade and resource contracts

## Project Conventions

- TypeScript strict mode is enforced.
- Path alias `@/*` resolves to `src/*`.
- Runtime HTTP calls should go through the shared request flow in `Resource`.
- New endpoint integrations should be added as resource methods under `src/resources/`.

## Adding a New Resource Method

1. Add or update method in the proper file under `src/resources/`.
2. Reuse `this.request(...)` with correct mode flags.
3. Extend input interfaces in `src/types.ts` if new payload contracts are needed.
4. Add or update tests in `tests/`.
5. Update README examples and this documentation set if public behavior changes.

## Environment Variables

These variables can override default host values:

- `BASE_URL_SDK`
- `SECURE_URL_SDK`
- `BASE_URL_APIFY`

## Known Operational Caveats

- Authentication currently occurs per request.
- Error normalization for non-JSON/non-2xx responses is limited.
- Automatic IP discovery depends on an external service (`api.ipify.org`).
