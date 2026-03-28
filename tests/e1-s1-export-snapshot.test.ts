import { describe, expect, it } from "vitest";
import { Epayco } from "../src/index";

describe("E1-S1: Export Surface Snapshot", () => {
  it("should have deterministic, documented public surface", () => {
    const epayco = new Epayco({
      apiKey: "test_key",
      privateKey: "test_secret",
      test: true,
      lang: "EN",
    });

    const surface: Record<string, string[]> = {};

    // Build surface map from instance
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
        surface[resourceName] = Object.getOwnPropertyNames(
          Object.getPrototypeOf(resource),
        )
          .filter(
            (m) =>
              typeof resource[m as keyof typeof resource] === "function" &&
              !m.startsWith("_"),
          )
          .sort();
      }
    }

    // Each resource should have documented methods
    expect(surface).toMatchSnapshot();
  });
});
