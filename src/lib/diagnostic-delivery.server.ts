/**
 * Temporary compatibility surface for the legacy `/api/diagnostic` contract.
 * Security, process-local replay handling, and Cloudflare delivery live only in
 * the canonical contact core.
 */
export {
	createDiagnosticLeadHandler,
	DiagnosticDeliveryError,
	readJsonBodyLimited,
	sendLeadWithCloudflare,
	type DeliverDiagnosticLead,
	type DiagnosticDeliveryEnv,
	type DiagnosticHandlerDeps,
} from "./contact-delivery.server";
