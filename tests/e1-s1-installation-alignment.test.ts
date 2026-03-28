import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("E1-S1: Installation Alignment", () => {
  it("should have matching package name in README and package.json", () => {
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), "package.json"), "utf-8"),
    );
    const readmeContent = readFileSync(
      join(process.cwd(), "README.md"),
      "utf-8",
    );

    const officialPackageName = packageJson.name;
    const readmeInstallCommand = readmeContent.match(/npm i ([\w-/]+)/)?.[1];

    expect(readmeInstallCommand).toBe(officialPackageName);
    expect(officialPackageName).toBe("epayco-sdk-node-ts");
  });
});
