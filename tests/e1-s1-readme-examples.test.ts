// PSEUDOCÓDIGO (plan):
// 1) Reemplazar imports con prefijo "node:" por imports estándar ("fs", "path").
// 2) Mantener la lógica del test.
// 3) Evitar posibles undefined en capturas de regex usando valor por defecto.
// 4) Conservar validaciones actuales y expectativas finales.

import { readFileSync } from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";

describe("E1-S1: README Examples Structure", () => {
  it("should have syntactically valid code examples in README", () => {
    const readmeContent = readFileSync(
      join(process.cwd(), "README.md"),
      "utf-8",
    );

    // Extract JavaScript/TypeScript code blocks
    const codeBlockPattern =
      /```(?:javascript|typescript|js|ts)?\n([\s\S]*?)\n```/g;
    let exampleCount = 0;
    const invalidExamples: Array<{ index: number; issue: string }> = [];

    const matches = readmeContent.matchAll(codeBlockPattern);
    for (const match of matches) {
      const code = match[1] ?? "";
      exampleCount++;

      // Basic parse check: should not have obviously unmatched braces
      const openBraces = (code.match(/{/g) || []).length;
      const closeBraces = (code.match(/}/g) || []).length;
      const openParens = (code.match(/\(/g) || []).length;
      const closeParens = (code.match(/\)/g) || []).length;

      if (openBraces !== closeBraces) {
        invalidExamples.push({
          index: exampleCount,
          issue: `unmatched braces: ${openBraces} open, ${closeBraces} close`,
        });
      }

      if (openParens !== closeParens) {
        invalidExamples.push({
          index: exampleCount,
          issue: `unmatched parentheses: ${openParens} open, ${closeParens} close`,
        });
      }
    }

    expect(exampleCount).toBeGreaterThan(0);
    expect(invalidExamples).toHaveLength(0);
  });
});
