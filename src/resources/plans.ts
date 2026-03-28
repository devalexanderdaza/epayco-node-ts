import { Resource } from "@/resources/resource";
import type { ApiResponse, PlanCreateOptions } from "@/types";

// PD-1 Decision: plans.update marked as unsupported in current cycle
// Reference: _bmad-output/planning-artifacts/decision-records-2026-03-28.md#PD-1
// Decision rationale: No active usage telemetry (per PD-1 decision); scheduled for future consideration in roadmap backlog
// Semver impact: Patch (documentation clarification only - method never existed)
// Closed: 2026-03-28

export class Plans extends Resource {
  create(options: PlanCreateOptions): Promise<ApiResponse> {
    return this.request(
      "post",
      "/recurring/v1/plan/create",
      options as Record<string, unknown>,
    );
  }

  get(uid: string): Promise<ApiResponse> {
    return this.request(
      "get",
      `/recurring/v1/plan/${this._epayco.apiKey}/${uid}`,
      {},
    );
  }

  list(): Promise<ApiResponse> {
    return this.request(
      "get",
      `/recurring/v1/plans/${this._epayco.apiKey}`,
      {},
    );
  }

  delete(uid: string): Promise<ApiResponse> {
    return this.request(
      "post",
      `/recurring/v1/plan/remove/${this._epayco.apiKey}/${uid}`,
      {},
    );
  }
}
