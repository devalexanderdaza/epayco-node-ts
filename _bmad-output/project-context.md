---
project_name: 'epayco-node-ts'
user_name: 'Devalexanderdaza'
date: '2026-03-29T22:17:55-05:00'
sections_completed: ['technology_stack']
existing_patterns_found: 12
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

### Core Runtime & Language

- Node.js >=18
- TypeScript ^5.9.3 (`strict: true`, `noUncheckedIndexedAccess: true`, `moduleResolution: bundler`)
- ESM package (`type: module`) with dual build output (ESM + CJS)

### Build & Packaging

- tsup ^8.5.1
- Entry point: `src/index.ts`
- Outputs: `dist/index.js`, `dist/index.cjs`, declaration files enabled

### Testing

- Vitest ^4.0.18
- Environment: `node`
- Test include glob: `tests/**/*.test.ts`
- Coverage provider: `v8`, includes `src/**`

### Linting & Formatting

- Biome ^2.4.5
- 2-space indentation
- Linting uses `recommended` rule set

### Path Aliasing

- Alias `@` -> `src` (configured in `tsconfig.json`, `vitest.config.ts`, and `tsup.config.ts`)

## Critical Implementation Rules

_To be collaboratively generated in step-02._
