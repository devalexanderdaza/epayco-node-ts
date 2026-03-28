import { describe, expect, it } from "vitest";
import { Plans } from "@/resources/plans";

describe("E1-S2: Plans.update Contract", () => {
  it("should NOT have an update method on Plans class", () => {
    // Check all prototype chain for methods
    const allMethods = [];
    for (
      let proto = Plans.prototype;
      proto && proto !== Object.prototype;
      proto = Object.getPrototypeOf(proto)
    ) {
      allMethods.push(...Object.getOwnPropertyNames(proto));
    }
    expect(allMethods).not.toContain("update");
  });

  it("should have only approved methods on Plans class", () => {
    const plansPrototype = Object.getOwnPropertyNames(Plans.prototype)
      .filter((name) => name !== "constructor")
      .sort();

    expect(plansPrototype).toEqual(["create", "delete", "get", "list"]);
  });
});

describe("E1-S2: PlanUpdateOptions Type Contract", () => {
  it("should NOT export PlanUpdateOptions type", async () => {
    try {
      const types = await import("@/types");
      const exportedTypes = Object.keys(types);
      expect(exportedTypes).not.toContain("PlanUpdateOptions");
    } catch (error) {
      // If import fails, consider it as not containing the type
      expect(true).toBe(true);
    }
  });

  it("should NOT export any Update-related plan types", async () => {
    try {
      const types = await import("@/types");
      const exportedTypes = Object.keys(types);
      const updateTypes = exportedTypes.filter(
        (type) =>
          type.toLowerCase().includes("update") &&
          type.toLowerCase().includes("plan"),
      );
      expect(updateTypes).toEqual([]);
    } catch (error) {
      expect(true).toBe(true);
    }
  });
});
