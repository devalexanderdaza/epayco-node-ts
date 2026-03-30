# Project Documentation Index

## Project Overview

- **Name:** epayco-sdk-node-ts
- **Type:** monolith library
- **Primary Language:** TypeScript
- **Architecture:** Facade + domain resources + shared request pipeline

## Quick Reference

- **Entry Point:** `src/index.ts`
- **Runtime:** Node.js >= 18
- **Build:** tsup (ESM + CJS + d.ts)
- **Tests:** Vitest (`tests/**/*.test.ts`)

## Generated Documentation

- [Project Overview](./project-overview.md)
- [Architecture](./architecture.md)
- [Source Tree Analysis](./source-tree-analysis.md)
- [Component Inventory](./component-inventory.md)
- [Development Guide](./development-guide.md)
- [API Contracts](./api-contracts.md)
- [Project Scan Report State](./project-scan-report.json)

## Existing Documentation

- [Repository README](../README.md) - Public usage and examples (contains some legacy content).
- [Technical Report](../references/TECH_REPORT.md) - Prior analysis and recommendations.
- [Development Spec](../references/EPAYCO_NODE_TS_DEVELOPMENT_SPEC.md) - Product and engineering roadmap notes.
- [Cursor Report](../references/CURSOR_REPORT.md) - Additional repository assessment.
- [OpenAPI Contract](../references/epayco-openapi.yaml) - API contract reference.

## Getting Started for AI-Assisted Work

1. Read `project-overview.md` for context.
2. Read `architecture.md` to understand technical constraints and design decisions.
3. Use `component-inventory.md` to locate the right module before editing.
4. Use `api-contracts.md` to map SDK methods to upstream ePayco endpoints.
5. Use `development-guide.md` before running local quality commands.

## Notes

- This documentation reflects the project state as of 2026-03-29.
- No deep-dive area was requested in this run.
