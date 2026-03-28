# AGENTS.md - AI Agent Guidelines for epayco-sdk-node-ts

> Node.js TypeScript SDK for the ePayco payment platform API

## Build, Lint, and Test Commands

| Command              | Description                           |
| -------------------- | ------------------------------------- |
| `pnpm build`         | Build CJS + ESM + .d.ts to `dist/`    |
| `pnpm test`          | Run all tests once                    |
| `pnpm test:watch`    | Run tests in watch mode               |
| `pnpm lint`          | Check linting issues (Biome)          |
| `pnpm lint:fix`      | Fix linting issues automatically      |
| `pnpm format`        | Format code with Biome                |
| `pnpm typecheck`     | TypeScript type checking (`tsc --noEmit`) |

### Running a Single Test

```bash
# Run tests matching a pattern
pnpm test -- -t "pattern"

# Run a specific test file
pnpm test tests/customers.test.ts

# Run tests in watch mode for a specific file
pnpm test:watch tests/charge.test.ts
```

## Technology Stack

| Area           | Technology                  | Notes                                              |
| -------------- | --------------------------- | -------------------------------------------------- |
| Runtime        | Node.js >= 18               | `engines` in `package.json`                        |
| Language       | TypeScript ~5.9             | `strict: true`, `noUncheckedIndexedAccess: true`   |
| Module System  | ESM (`"type": "module"`)    | Dual CJS + ESM output via tsup                     |
| Build Tool     | tsup ^8.5                   | Entry: `src/index.ts` -> `dist/`                   |
| HTTP Client    | Native `fetch`              | No axios; see `src/http.ts`                        |
| Crypto         | `node:crypto`               | AES-CBC for legacy ePayco compatibility            |
| Lint/Format    | Biome ^2.4.5                | NOT ESLint/Prettier                                |
| Tests          | Vitest ^4                   | `globals: true`, Node environment                  |
| Path Alias     | `@/*` -> `./src/*`          | Configured in tsconfig, tsup, vitest               |

## Code Style Guidelines

### Imports

- Use **`@/` path alias** for internal imports: `import { Charge } from "@/resources/charge"`
- Group imports: external packages first, then internal with `@/` prefix
- Use `import type` for type-only imports

```typescript
import { describe, expect, it } from "vitest";
import type { CustomerCreateOptions } from "@/types";
import { Resource } from "@/resources/resource";
```

### Naming Conventions

| Element    | Convention      | Example                                  |
| ---------- | --------------- | ---------------------------------------- |
| Classes    | PascalCase      | `Epayco`, `Customers`, `EpaycoError`     |
| Methods    | lowerCamelCase  | `create`, `getBanks`, `addDefaultCard`   |
| Files      | lowerCamelCase  | `customers.ts`, `resource.ts`            |
| Types      | PascalCase      | `CustomerCreateOptions`, `ApiResponse`   |
| Constants  | SCREAMING_SNAKE | `BASE_URL`, `BASE_URL_SECURE`            |

### Formatting (Biome)

- **Indentation**: 2 spaces (not tabs)
- Run `pnpm lint` before finishing any changes
- Use `pnpm lint:fix` to auto-fix issues

### TypeScript Rules

- **Strict mode**: Avoid `any`, prefer type narrowing
- **`noUncheckedIndexedAccess`**: Array/object index access may be `undefined`
- **`EpaycoConfig.test`**: Stored as string `"TRUE"` or `"FALSE"`, NOT boolean
- **`ApiResponse`**: Uses `[key: string]: unknown` - responses are NOT validated at runtime
- Extend `ErrorCode` in `src/types.ts` only when adding entries to `src/data/errors.json`

### Error Handling

- Custom `EpaycoError` class extends `Error` with localized messages (ES/EN)
- Constructor validation throws `EpaycoError` with code `"100"` for invalid config
- Invalid `lang` throws plain `Error` (not `EpaycoError`)
- **Known issue**: `sendRequest` does NOT check `res.ok` - HTTP errors may not throw

## Architecture Overview

### Facade Pattern

Main `Epayco` class exposes all resource instances:

```typescript
const epayco = createEpayco({ apiKey, privateKey, lang, test });
epayco.customers.create(options);
epayco.charge.create(options);
```

### Resource Base Class

`Resource` (`src/resources/resource.ts`) centralizes:
- Authentication (Bearer token)
- URL selection (3 hosts)
- Payload transformation (encryption, keylang mapping)

### Three API Hosts

| Constant          | Default URL                      | Usage                        |
| ----------------- | -------------------------------- | ---------------------------- |
| `BASE_URL`        | `https://api.secure.payco.co`    | Standard API                 |
| `BASE_URL_SECURE` | `https://secure.payco.co`        | Legacy `restpagos` routes    |
| `BASE_URL_APIFY`  | `https://apify.epayco.co`        | Modern Apify routes          |

### Resource.request() Flags

| Flag       | Purpose                                              |
| ---------- | ---------------------------------------------------- |
| `sw`       | Use `BASE_URL_SECURE` for legacy routes              |
| `cashData` | Cash payment flow with keylang mapping               |
| `card`     | Skip auto IP and test injection                      |
| `apify`    | Use `BASE_URL_APIFY` with Basic auth + keylang_apify |

## Testing Patterns

Tests live in `tests/**/*.test.ts`. Use Vitest with mocked fetch:

```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTestClient, mockFetch } from "./setup";

describe("ResourceName", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = mockFetch({ token: "test_bearer" });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should call correct endpoint", async () => {
    const client = createTestClient();
    await client.resource.method(options);
    
    const calls = fetchMock.mock.calls;
    const call = calls.find((c: unknown[]) => 
      typeof c[0] === "string" && c[0].includes("/expected/path")
    );
    expect(call).toBeDefined();
  });
});
```

## Critical Implementation Details

### Authentication

- Currently **re-authenticates on EVERY request** (no JWT caching)
- Bearer token from `auth.bearer_token ?? auth.token`
- Apify login uses `Authorization: Basic ${base64};` with **trailing semicolon**

### Payload Injection

- Always adds `extras_epayco: { extra5: "P44" }`
- Auto-injects `ip` (via `api.ipify.org`) and `test` unless `card` flag is true

### Encryption

`src/crypto.ts` mirrors legacy CryptoJS behavior. Do NOT replace without compatibility tests.

### Keylang System

`langkey()` / `langkeyApify()` map developer keys to API keys via JSON dictionaries. Unmapped keys pass through unchanged.

## Adding New Resources

1. Create `src/resources/[name].ts` extending `Resource`
2. Export from `src/resources/index.ts`
3. Add property to `Epayco` class in `src/index.ts`
4. Define types in `src/types.ts`
5. Add tests in `tests/[name].test.ts`

## Key Files Reference

| Area        | Files                                                |
| ----------- | ---------------------------------------------------- |
| Entry       | `src/index.ts` (Epayco class, createEpayco factory)  |
| HTTP/Auth   | `src/http.ts`, `src/resources/resource.ts`           |
| Types       | `src/types.ts`                                       |
| Errors      | `src/errors.ts`, `src/data/errors.json`              |
| Crypto      | `src/crypto.ts`                                      |
| Constants   | `src/constants.ts`                                   |
| Tests       | `tests/*.test.ts`, `tests/setup.ts`                  |
| Build       | `tsup.config.ts`, `tsconfig.json`, `biome.json`      |

## Known Issues

- **`sendRequest`** returns `res.json()` without checking `res.ok`
- Error code 102 message shows `[101]` (copy/paste bug in `errors.json`)
- Error 109 lists fewer cash providers than `CashProvider` type supports
- README documents `plans.update()` which does NOT exist in code
- `customers.list()` takes no args while README shows pagination

## Security Reminders

- NEVER log or expose `privateKey`, card data, or tokens
- Do NOT commit test credentials to the repo
- Verify Apify Basic auth format against official docs before changes

## Reference Documentation

- `_bmad-output/project-context.md` - Comprehensive AI agent context
- `references/EPAYCO_NODE_TS_DEVELOPMENT_SPEC.md` - Development specification
- `references/epayco-openapi.yaml` - ePayco API OpenAPI spec
- `references/CURSOR_REPORT.md` - Technical analysis report
