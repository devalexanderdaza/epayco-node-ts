# Project Documentation Index

**Project:** epayco-sdk-node-ts  
**Scan date:** 2026-03-28  
**Documentation output language:** English (per BMM `document_output_language`)

## Project overview

- **Type:** Monolith — single npm package (TypeScript SDK)
- **Primary language:** TypeScript
- **Architecture:** Client SDK with facade + resource classes extending shared `Resource` HTTP layer

## Quick reference

| Item            | Detail                                                         |
| --------------- | -------------------------------------------------------------- |
| **Tech stack**  | TypeScript, Node ≥ 18, tsup, Vitest, Biome                     |
| **Entry point** | `src/index.ts` → `createEpayco` / `Epayco`                     |
| **Pattern**     | Epayco REST client; encrypted and Apify-specific payload paths |

## Generated documentation

- [Project overview](./project-overview.md)
- [Architecture](./architecture.md)
- [Source tree analysis](./source-tree-analysis.md)
- [Component inventory (SDK surface)](./component-inventory.md)
- [Development guide](./development-guide.md)

## Existing documentation

- [README.md](../README.md) — installation and usage examples (note possible drift vs `plans` API in code)

## Getting started

1. `pnpm install`
2. `pnpm build`
3. `pnpm test`

For integration, instantiate the client with `apiKey`, `privateKey`, `test`, and optional `lang` (`ES` | `EN`). See [development-guide.md](./development-guide.md) for scripts and env vars.

## State file

Workflow state for rescans: [project-scan-report.json](./project-scan-report.json)
