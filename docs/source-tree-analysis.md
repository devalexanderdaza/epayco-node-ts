# Source Tree Analysis

## Annotated Project Tree

```text
epayco-node-ts/
├── src/                          # SDK implementation
│   ├── index.ts                  # Public facade entrypoint (Epayco + exports)
│   ├── types.ts                  # Public TypeScript contracts
│   ├── constants.ts              # Base URLs and env overrides
│   ├── http.ts                   # Auth + HTTP helpers (fetch)
│   ├── crypto.ts                 # AES helpers and basic auth encoding
│   ├── errors.ts                 # EpaycoError class
│   ├── keylang.ts                # Payload key translation helpers
│   ├── data/                     # Static data maps (errors, key translations)
│   └── resources/                # Domain modules (Token, Plans, Cash, etc.)
├── tests/                        # Vitest unit and contract tests
│   ├── setup.ts                  # Test client + fetch mock helpers
│   └── *.test.ts                 # Resource and behavior tests
├── references/                   # External references/specs (OpenAPI, Postman, reports)
├── docs/                         # Generated project knowledge for AI workflows
├── package.json                  # Scripts, metadata, dependencies, engines
├── tsconfig.json                 # TS strict configuration and path aliases
├── tsup.config.ts                # Build outputs (CJS/ESM + d.ts)
├── vitest.config.ts              # Test runner setup and coverage include
└── biome.json                    # Lint/format config
```

## Critical Folders and Purpose

- `src/resources/`
  - Domain-oriented SDK surface.
  - Each file maps to one payment capability.
- `src/data/`
  - Runtime dictionaries for error localization and key translation.
  - Critical to compatibility with provider payload conventions.
- `tests/`
  - Prevents regressions in URL composition and resource-level behavior.
- `references/`
  - Source of truth for parity planning (OpenAPI and Postman collection).

## Entry Points and Flows

- Primary package entry: `src/index.ts`
- Build entry: `src/index.ts` (configured in `tsup.config.ts`)
- Test entry pattern: `tests/**/*.test.ts`

## Integration Paths

- `Resource.request()` -> `authenticate()` -> `sendRequest()`
- `Resource.request()` -> `setData()` -> (`encrypt` / `langkey` mapping)
- `Epayco` facade composes all domain resources with a shared config object.
