export const WORKSPACE_VIEW_IDS = [
	"buyer-questions",
	"current-answers",
	"sources-gaps",
	"actions-under-review",
	"outcome-review",
] as const;

export type WorkspaceViewId = (typeof WORKSPACE_VIEW_IDS)[number];

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
