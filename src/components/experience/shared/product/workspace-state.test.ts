import { describe, expect, it } from "vitest";

describe("product workspace state", () => {
	it("moves one persistent workspace through the five semantic views without inventing a sixth state", async () => {
		const modulePath = "./workspace-state.ts";
		const workspace = await import(/* @vite-ignore */ modulePath).catch(() => null);
		expect(workspace, "workspace-state must exist before its transitions can be exercised").not.toBeNull();
		if (!workspace) return;

		expect(workspace.WORKSPACE_VIEW_IDS).toEqual([
			"buyer-questions",
			"current-answers",
			"sources-gaps",
			"actions-under-review",
			"outcome-review",
		]);
		let state = workspace.initialWorkspaceState;
		for (const expected of workspace.WORKSPACE_VIEW_IDS.slice(1)) {
			state = workspace.workspaceStateReducer(state, { type: "next" });
			expect(state.activeView).toBe(expected);
		}
		expect(workspace.workspaceStateReducer(state, { type: "next" }).activeView).toBe("buyer-questions");
		expect(workspace.workspaceStateReducer(state, { type: "select", view: "sources-gaps" }).activeView).toBe("sources-gaps");
	});
});
