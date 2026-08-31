import type { BuyerQuestionRecord } from "@/content/public-site/contracts/buyer-question";
import type { ProductPageCopy } from "@/content/public-site/contracts/pages/product";
import { WorkspaceRecordInspector, type ProductEvidenceLensConfig, type ProductWorkspaceLabels } from "./workspace-record-inspector";
import type { WorkspaceViewId } from "./workspace-state";

interface WorkspaceStageProps {
	readonly activeView: WorkspaceViewId;
	readonly enhanced: boolean;
	readonly record: BuyerQuestionRecord;
	readonly copy: ProductPageCopy;
	readonly evidenceLens: ProductEvidenceLensConfig;
	readonly labels: ProductWorkspaceLabels;
}

export function WorkspaceStage({ activeView, enhanced, record, copy, evidenceLens, labels }: WorkspaceStageProps) {
	return (
		<div className="site-v1-workspace-stage" aria-live="polite">
			<WorkspaceRecordInspector activeView={activeView} enhanced={enhanced} record={record} copy={copy} evidenceLens={evidenceLens} labels={labels} />
		</div>
	);
}
