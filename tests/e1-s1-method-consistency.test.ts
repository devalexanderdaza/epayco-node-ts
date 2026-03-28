import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createEpayco } from "../src/index";

describe("E1-S1: Method Surface Consistency", () => {
  it("should only document methods that exist in the SDK exports", () => {
    const readmeContent = readFileSync(
      join(process.cwd(), "README.md"),
      "utf-8",
    );

    // Extract documented method patterns: epayco.RESOURCE.METHOD(
    const methodPattern = /epayco\.([\w]+)\.([\w]+)\(/g;
    const documentedMethods = new Set<string>();
    const matches = readmeContent.matchAll(methodPattern);
    for (const match of matches) {
      documentedMethods.add(`${match[1]}.${match[2]}`);
    }

    // Create an SDK instance to get the actual exported surface
    const epayco = createEpayco({
      apiKey: "test_public_key",
      privateKey: "test_private_key",
      test: true,
      lang: "EN",
    });

    // Get actual exported surface
    const actualSurface = new Set<string>();
    const resourceNames = [
      "token",
      "customers",
      "plans",
      "subscriptions",
      "bank",
      "cash",
      "charge",
      "safetypay",
      "daviplata",
    ] as const;

    for (const resourceName of resourceNames) {
      const resource = epayco[resourceName] as unknown as Record<
        string,
        unknown
      >;
      if (resource) {
        const proto = Object.getPrototypeOf(resource);
        for (const methodName of Object.getOwnPropertyNames(proto)) {
          if (
            typeof proto[methodName as keyof typeof proto] === "function" &&
            !methodName.startsWith("_") &&
            methodName !== "constructor"
          ) {
            actualSurface.add(`${resourceName}.${methodName}`);
          }
        }
      }
    }

    // Assert documented methods exist in surface
    const missingMethods: string[] = [];
    for (const method of documentedMethods) {
      if (!actualSurface.has(method)) {
        missingMethods.push(method);
      }
    }

    expect(missingMethods.length).toBe(0);
    expect(documentedMethods.size).toBeGreaterThan(0);
  });
});
