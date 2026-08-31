import { timingSafeEqual } from "node:crypto";
import {
	ContactDeliveryError,
	createContactLeadHandler,
	type ContactHandlerDeps,
	type DeliverContactLead,
} from "./contact-delivery.server";

export const CONTACT_E2E_TOKEN_ENV = "YONARIS_CONTACT_E2E_TOKEN";
export const CONTACT_E2E_TOKEN_HEADER = "X-Yonaris-Contact-E2E-Token";
export const CONTACT_E2E_OUTCOME_HEADER = "X-Yonaris-Contact-E2E-Outcome";
export const CONTACT_E2E_TRANSPORT_HEADER = "X-Yonaris-Contact-E2E-Transport";

export type ContactE2EOutcome = "confirmed" | "unconfirmed";

type ContactRouteHandlerDeps = Omit<ContactHandlerDeps, "deliver"> & {
	readonly productionDeliver: DeliverContactLead;
	readonly createE2EDeliver?: (outcome: ContactE2EOutcome) => DeliverContactLead;
};

const E2E_DELIVERY_ENV = Object.freeze({
	CLOUDFLARE_ACCOUNT_ID: "local-e2e-disabled",
	CLOUDFLARE_EMAIL_API_TOKEN: "local-e2e-disabled",
	CLOUDFLARE_EMAIL_FROM: "e2e@yonaris.com",
	MARKETING_LEAD_RECIPIENT: "local-e2e@gmail.com",
});

function isHighEntropyToken(value: string | undefined): value is string {
	return Boolean(value && /^[A-Za-z0-9_-]{48,128}$/u.test(value));
}

function tokensMatch(expected: string, actual: string | null): boolean {
	if (!isHighEntropyToken(expected) || !actual) return false;
	const expectedBytes = Buffer.from(expected, "utf8");
	const actualBytes = Buffer.from(actual, "utf8");
	return expectedBytes.byteLength === actualBytes.byteLength && timingSafeEqual(expectedBytes, actualBytes);
}

function isLoopbackRequest(request: Request): boolean {
	const url = new URL(request.url);
	return url.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname);
}

function gateResponse(status: number, code: "forbidden_request" | "invalid_request"): Response {
	return new Response(JSON.stringify({ ok: false, code }), {
		status,
		headers: {
			"Cache-Control": "no-store",
			"Content-Type": "application/json; charset=utf-8",
			"Referrer-Policy": "no-referrer",
			"X-Content-Type-Options": "nosniff",
		},
	});
}

function defaultE2EDeliver(outcome: ContactE2EOutcome): DeliverContactLead {
	if (outcome === "confirmed") return async () => undefined;
	return async () => { throw new ContactDeliveryError("delivery_unconfirmed"); };
}

export function createContactRoutePostHandler(deps: ContactRouteHandlerDeps): (request: Request) => Promise<Response> {
	const productionHandler = createContactLeadHandler({ ...deps, deliver: deps.productionDeliver });
	const e2eHandlers = Object.fromEntries(
		(["confirmed", "unconfirmed"] as const).map((outcome) => [
			outcome,
			createContactLeadHandler({
				...deps,
				getEnv: () => E2E_DELIVERY_ENV,
				deliver: deps.createE2EDeliver?.(outcome) ?? defaultE2EDeliver(outcome),
			}),
		]),
	) as Record<ContactE2EOutcome, (request: Request) => Promise<Response>>;

	return async (request: Request) => {
		const suppliedToken = request.headers.get(CONTACT_E2E_TOKEN_HEADER);
		const suppliedOutcome = request.headers.get(CONTACT_E2E_OUTCOME_HEADER);
		const requestsE2E = suppliedToken !== null || suppliedOutcome !== null;
		if (!requestsE2E) return productionHandler(request);

		const configuredToken = deps.getEnv()[CONTACT_E2E_TOKEN_ENV]?.trim();
		if (!isLoopbackRequest(request) || !isHighEntropyToken(configuredToken) || !tokensMatch(configuredToken, suppliedToken)) {
			return gateResponse(403, "forbidden_request");
		}
		if (suppliedOutcome !== "confirmed" && suppliedOutcome !== "unconfirmed") {
			return gateResponse(400, "invalid_request");
		}
		const response = await e2eHandlers[suppliedOutcome](request);
		response.headers.set(CONTACT_E2E_TRANSPORT_HEADER, "fake");
		return response;
	};
}
