# Source Tree Analysis

Repository root: `epayco-node-ts/`

```
epayco-node-ts/
├── package.json          # Package metadata, scripts, exports (dist), engines Node >=18
├── tsconfig.json       # Strict TS; path alias "@/*" -> src/*
├── tsup.config.ts      # Build: entry src/index.ts, CJS+ESM, dts, Node 18 target
├── biome.json          # Linter/formatter config
├── vitest.config.ts    # Tests: tests/**/*.test.ts, alias @ -> src
├── README.md           # Usage examples (npm package name epayco-sdk-node)
├── src/                # Library source (published via compiled dist/)
│   ├── index.ts        # ENTRY: Epayco class, createEpayco, re-exports
│   ├── types.ts        # EpaycoOptions, option interfaces, ApiResponse
│   ├── constants.ts    # BASE_URL, BASE_URL_SECURE, BASE_URL_APIFY (env overrides)
│   ├── http.ts         # authenticate(), sendRequest(), getIp()
│   ├── crypto.ts       # Encryption helpers for Resource.setData
│   ├── errors.ts       # EpaycoError + messages from JSON
│   ├── keylang.ts      # Key mapping for encrypted / Apify payloads
│   ├── resources/
│   │   ├── resource.ts # Abstract Resource: request pipeline
│   │   ├── index.ts    # Re-exports all resource classes
│   │   ├── token.ts
│   │   ├── customers.ts
│   │   ├── plans.ts
│   │   ├── subscriptions.ts
│   │   ├── bank.ts     # PSE
│   │   ├── cash.ts
│   │   ├── charge.ts
│   │   ├── daviplata.ts
│   │   └── safetypay.ts
│   └── data/
│       ├── errors.json
│       ├── keylang.json
│       ├── keylangs.json
│       └── keylang_apify.json
├── tests/              # Vitest specs mirroring resources + crypto/errors
└── dist/               # Build output (gitignored); not source
```

## Critical folders

| Path                        | Role                                                         |
| --------------------------- | ------------------------------------------------------------ |
| `src/index.ts`              | Public API surface and `Epayco` constructor                  |
| `src/resources/resource.ts` | Shared HTTP/auth/encryption behavior                         |
| `src/resources/*.ts`        | Per-domain Epayco API wrappers                               |
| `src/data/*.json`           | Error strings and key-mapping data for payloads              |
| `tests/`                    | Unit/integration-style tests against mocked or live patterns |

## Entry points

- **Library:** `src/index.ts` → compiled to `dist/index.js` / `dist/index.cjs` with types.

## Excluded / non-runtime

- `_bmad/`, `_bmad-output/`, `.cursor/`, `.opencode/`, `.github/skills/` — tooling and BMAD assets, not part of the npm package `files` list.
