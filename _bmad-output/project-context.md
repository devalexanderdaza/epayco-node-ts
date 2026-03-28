---
project_name: epayco-node-ts
user_name: Alexander
date: "2026-03-28T12:00:00Z"
sections_completed:
  - technology_stack
  - language_rules
  - framework_rules
  - testing_rules
  - quality_rules
  - workflow_rules
  - anti_patterns
status: complete
rule_count: 48
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

| Area          | Choice                       | Notes                                                                          |
| ------------- | ---------------------------- | ------------------------------------------------------------------------------ |
| Runtime       | **Node.js ≥ 18**             | `engines` in `package.json`; build target `node18` (tsup).                     |
| Language      | **TypeScript ~5.9**          | `strict: true`, `noUncheckedIndexedAccess: true`, `moduleResolution: bundler`. |
| Module system | **ESM** (`"type": "module"`) | Published as **CJS + ESM** (`main` / `module` / `exports` in `package.json`).  |
| Bundler       | **tsup ^8.5**                | Single entry `src/index.ts` → `dist/` with `.cjs`, `.js`, `.d.ts`, sourcemaps. |
| HTTP          | **Native `fetch`**           | No `axios` or third-party HTTP client; see `src/http.ts`.                      |
| Crypto        | **`node:crypto`**            | AES-CBC aligned with legacy ePayco / CryptoJS behavior; see `src/crypto.ts`.   |
| Lint / format | **Biome ^2.4.5**             | `biome.json`; not ESLint/Prettier.                                             |
| Tests         | **Vitest ^4**                | Node environment, `globals: true`, alias `@` → `src` (see `vitest.config.ts`). |
| Path alias    | **`@/*` → `./src/*`**        | Configured in `tsconfig.json`, `tsup.config.ts`, and Vitest.                   |

**Environment overrides (optional):** `BASE_URL_SDK`, `SECURE_URL_SDK`, `BASE_URL_APIFY` override default API hosts in `src/constants.ts`.

---

## Critical Implementation Rules

### Language-Specific Rules

- Preserve **strict TypeScript** semantics: avoid `any`, prefer narrowing; respect `noUncheckedIndexedAccess` (array/object index access may be `undefined`).
- Use the **`@/` import alias** for internal modules (e.g. `@/resources/charge`), consistent with existing files.
- **`EpaycoConfig.test`** is the string `"TRUE"` or `"FALSE"`, not a boolean—downstream code and payloads expect that shape after construction.
- **`EpaycoOptions.lang`** is optional and defaults to `"ES"`; only `"ES"` and `"EN"` are valid. Invalid `lang` throws a **plain `Error`** (`LANG: … is invalid`), while missing/invalid keys for the client constructor throw **`EpaycoError`** with code `"100"`.
- Extend **`ErrorCode`** in `src/types.ts` only when adding matching entries to **`src/data/errors.json`** (both `ES` and `EN` messages).
- **`ApiResponse`** and many option interfaces use index signatures or `[key: string]: unknown`—responses from ePayco are **not validated at runtime**; do not assume JSON matches types without an explicit parsing/validation layer (out of scope unless the task adds it).

### Library / SDK Architecture Rules

- **Facade:** `Epayco` (`src/index.ts`) constructs all resource classes and exposes them as properties. Adding a new top-level capability requires **constructing it in the constructor** and **exporting the class** from `src/resources/index.ts`.
- **Base class:** `Resource` (`src/resources/resource.ts`) centralizes **`authenticate` → Bearer token → `sendRequest`**. Every call currently **re-authenticates**; do not assume JWT caching unless you implement it deliberately (see known gaps in `references/` specs).
- **`Resource.request(method, url, data, sw?, cashData?, card?, apify?)`** flags control behavior—agents must understand them before adding endpoints:
  - **`sw`:** use **`BASE_URL_SECURE`** (`secure.payco.co`) for legacy `restpagos` JSON routes; combined with encryption path in `setData` when not Apify/cash.
  - **`cashData`:** cash payload branch: `langkey` mapping, `public_key`, fixed `i`, `enpruebas`, `lenguaje`, `p`.
  - **`card`:** when `true`, **skips** auto `ip` and `test` injection in `request()` (used for card-token style flows).
  - **`apify`:** `BASE_URL_APIFY`, Basic auth login, **`langkeyApify`** mapping for body keys.
- **Always injected:** `data.extras_epayco = { extra5: "P44" }` before transformations—do not remove without understanding ePayco expectations.
- **IP:** If `card` is false and `data.ip` is missing, **`getIp()`** calls `https://api.ipify.org`—document behavior when adding features; production code may need explicit `ip` in the payload.
- **Authentication headers for API requests:** `type: sdk-jwt`, `lang: NODE`, `Authorization: Bearer …` (token from `auth.bearer_token ?? auth.token`).
- **Apify login:** `Authorization: Basic ${base64(apiKey:privateKey)};` includes a **trailing semicolon** in `authenticate(..., apify: true)`—treat as contract-sensitive; verify against official docs before “fixing”.
- **Encryption:** `encrypt` / `encryptHex` in `src/crypto.ts` intentionally mirror legacy behavior (fixed IV handling from hex). Do not replace with generic AES usage without compatibility proof and tests.
- **Keylang:** `langkey` / `langkeyApify` map keys via JSON dictionaries; **unmapped keys pass through unchanged** (`?? value`). New API fields may work or may silently send wrong names—prefer tests or explicit mapping when touching payloads.

### Testing Rules

- Tests live under **`tests/**/\*.test.ts`**; use **`vitest`** (`describe`/`it`/`expect`); **`globals: true`** enables globals without per-file imports if configured (existing tests import from `vitest` explicitly in some files—follow the dominant style in neighboring files).
- Use **`mockFetch`** and **`createTestClient`** from `tests/setup.ts` for consistent **`fetch` mocking** and client construction.
- Favor **assertions on URL, method, and request shape** (headers/body) rather than relying on real network calls—there are **no integration tests** against sandbox in-repo by default.
- When adding resources or changing `Resource.request`, add or extend tests that **pin the composed URL and flags** (see existing `tests/*.test.ts` patterns).

### Code Quality & Style Rules

- Run **`pnpm lint`** / **`biome check`** (or `npm run lint`) before finishing; use **`biome check --write`** only when formatting/lint fixes are intended.
- **Formatter:** 2 spaces, spaces not tabs (`biome.json`).
- **`tsup`:** entry remains **`src/index.ts`** unless the build strategy changes; keep **dual format** unless semver-major change is agreed.
- **Naming:** Resource classes are **PascalCase** (`Bank`, `Charge`); methods are **lowerCamelCase** matching domain verbs (`create`, `get`, `list`). File names are **lowerCamelCase** domain names (`charge.ts`, `customers.ts`).
- Avoid adding **runtime dependencies** without strong justification—the published package currently has **no production dependencies** in `package.json`.

### Development Workflow Rules

- **Scripts:** `build` (tsup), `test` / `test:watch` (vitest), `typecheck` (`tsc --noEmit`), `lint` / `lint:fix`, `format` (biome).
- **`prepublishOnly`** runs `pnpm build`—ensure **`dist/`** is build output for publishing; `files` field publishes only `dist`.
- **Authoritative behavior** for implementation details is **`src/`**, not `README.md` or older reports: **`references/EPAYCO_NODE_TS_DEVELOPMENT_SPEC.md`** and **`references/CURSOR_REPORT.md`** describe intentional gaps (e.g. README documents **`plans.update`** but **`Plans`** has no `update`; **`customers.list()`** takes no args while README shows pagination). Align docs and code only via **explicit tasks** and **semver-aware** API changes.

### Critical Don't-Miss Rules

- **`sendRequest`** returns **`res.json()`** without checking **`res.ok`**—HTTP errors or non-JSON bodies can throw or yield misleading results; improving this is a **behavioral/API decision**, not a silent one-line change.
- **Do not log or expose** `privateKey`, card data, or tokens in errors, tests fixtures committed to the repo, or debug prints.
- **`errors.json`:** Some messages have **wrong numeric prefixes** (e.g. code `102` text says `[101]`) and **109** text lists fewer cash providers than `CashProvider` in `src/types.ts`—fixing copy is welcome but requires **consistency review** with `Cash` routes.
- **Charge/Bank/Cash `get` URLs** use **`&&`** between query parameters (legacy style in code)—do not “clean” to `&` without verifying server compatibility.
- **Split payments** are modeled as **extra fields on transaction payloads** (see README examples), not as a separate resource class—do not invent `split.ts` unless the project explicitly adds that abstraction.
- **OpenAPI / Postman** under `references/` describe a **broader API** than this SDK implements; use them for **parity planning**, not as “everything must exist” for every change.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code.
- Follow **all** rules above; when in doubt, prefer the option that preserves **backward compatibility** and **documented ePayco wire behavior**.
- After behavioral changes to HTTP, auth, or encryption, update **tests** and mention **semver** impact in changelogs or PR descriptions when applicable.

**For Humans:**

- Keep this file **lean** and focused on agent needs; update when the stack, `Resource.request` contract, or security assumptions change.
- Review periodically for outdated references (e.g. when JWT caching or HTTP error handling lands).

Last Updated: 2026-03-28
