export const WORKSPACE_VIEW_IDS = [
	"buyer-questions",
	"current-answers",
	"sources-gaps",
	"actions-under-review",
	"outcome-review",
] as const;

export type WorkspaceViewId = (typeof WORKSPACE_VIEW_IDS)[number];

export const WORKSPACE_OBJECT_KINDS = [
	"question",
	"answers",
	"reasons",
	"evidence",
	"gap",
	"action",
	"review",
	"conditions",
] as const;

export type WorkspaceObjectKind = (typeof WORKSPACE_OBJECT_KINDS)[number];
export type WorkspaceObjectEmphasis = "primary" | "supporting" | "ambient";

const EMPHASIS_BY_VIEW: Record<WorkspaceViewId, Readonly<Partial<Record<WorkspaceObjectKind, Exclude<WorkspaceObjectEmphasis, "ambient">>>>> = {
	"buyer-questions": { question: "primary", conditions: "supporting", answers: "supporting" },
	"current-answers": { answers: "primary", reasons: "supporting", question: "supporting" },
	"sources-gaps": { evidence: "primary", reasons: "supporting", gap: "supporting" },
	"actions-under-review": { action: "primary", gap: "supporting", evidence: "supporting" },
	"outcome-review": { review: "primary", action: "supporting", conditions: "supporting" },
};

export function getWorkspaceObjectEmphasis(view: WorkspaceViewId, object: WorkspaceObjectKind): WorkspaceObjectEmphasis {
	return EMPHASIS_BY_VIEW[view][object] ?? "ambient";
}

export interface WorkspaceState {
	readonly activeView: WorkspaceViewId;
}

export type WorkspaceAction =
	| { readonly type: "select"; readonly view: WorkspaceViewId }
	| { readonly type: "next" }
	| { readonly type: "previous" };

export const initialWorkspaceState: WorkspaceState = { activeView: WORKSPACE_VIEW_IDS[0] };

export function workspaceStateReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
	if (action.type === "select") return state.activeView === action.view ? state : { activeView: action.view };
	const currentIndex = WORKSPACE_VIEW_IDS.indexOf(state.activeView);
	const offset = action.type === "next" ? 1 : -1;
	const activeView = WORKSPACE_VIEW_IDS[(currentIndex + offset + WORKSPACE_VIEW_IDS.length) % WORKSPACE_VIEW_IDS.length];
	return activeView ? { activeView } : state;
}
