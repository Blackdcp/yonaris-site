import {
	DIAGNOSTIC_HYDRATION_INTENT_STATE_KEY,
	DIAGNOSTIC_INTENT_STATE_KEY,
} from "./diagnostic-request-intent";
import {
	CONTACT_HYDRATION_INTENT_STATE_KEY,
	CONTACT_INTENT_STATE_KEY,
} from "./contact-request-intent";

const SENSITIVE_PROPERTY_KEYS = new Set([
	"website",
	"brand",
	"market",
	"question",
	"competitors",
	"name",
	"email",
	"phone",
	"company",
	"workemail",
	"companyorwebsite",
	"curiosity",
	"marketquestion",
	"marketorlanguage",
	"buyerorcommercialcontext",
	"botfield",
	"submissionid",
	"consent",
	"companyurl",
	"domain",
	"uuid",
	"idempotencykey",
	"response",
	"payload",
	"lead",
	"intent",
	"requesttype",
	"yonarisdiagnosticintent",
	"yonarisdiagnostichydrationintent",
	"yonariscontactintent",
	"yonariscontacthydrationintent",
]);
const URL_PROPERTY_KEYS = new Set(["$current_url", "$referrer", "$initial_referrer", "$initial_current_url"]);

export function buildDiagnosticAnalyticsBootstrapScript(): string {
	const diagnosticStateKey = JSON.stringify(DIAGNOSTIC_INTENT_STATE_KEY);
	const diagnosticHydrationKey = JSON.stringify(DIAGNOSTIC_HYDRATION_INTENT_STATE_KEY);
	const contactStateKey = JSON.stringify(CONTACT_INTENT_STATE_KEY);
	const contactHydrationKey = JSON.stringify(CONTACT_HYDRATION_INTENT_STATE_KEY);
	return `(()=>{const p=location.pathname;const c=p==="/contact"||p==="/zh/contact";const d=p==="/diagnostic"||p==="/zh/diagnostic";if((c||d)&&location.search){const v=new URLSearchParams(location.search).getAll("intent");const s=Object.assign({},history.state);const di=${diagnosticStateKey};const dh=${diagnosticHydrationKey};const ci=${contactStateKey};const ch=${contactHydrationKey};delete s[di];delete s[dh];delete s[ci];delete s[ch];const i=c?ci:di;const h=c?ch:dh;if(v.length===1&&v[0]==="privacy"){s[i]="privacy";s[h]="privacy";if(!s.__TSR_key&&!s.key){const k=(Math.random()+1).toString(36).substring(7);s.__TSR_index=0;s.key=k;s.__TSR_key=k}}history.replaceState(s,"",location.pathname+location.hash)}})();`;
}

function sanitizeUrlLike(value: string): string {
	if (
		!value ||
		[...value].some((character) => {
			const codePoint = character.codePointAt(0);
			return /\s/u.test(character) || (codePoint !== undefined && (codePoint <= 0x1f || codePoint === 0x7f));
		})
	)
		return "";
	const absolute = /^[a-z][a-z\d+.-]*:\/\//iu.test(value);
	try {
		const url = new URL(value, "https://yonaris.invalid");
		url.search = "";
		return absolute ? url.toString() : `${url.pathname}${url.hash}`;
	} catch {
		return "";
	}
}

export function sanitizeAnalyticsUrl(value: string): string {
	return sanitizeUrlLike(value);
}

export function sanitizeAnalyticsReferrer(value: string): string {
	return sanitizeUrlLike(value);
}

function normalizePropertyKey(key: string): string {
	return key.replace(/[^a-z\d]/giu, "").toLowerCase();
}

function sanitizeNestedValue(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(sanitizeNestedValue);
	if (typeof value !== "object" || value === null) return value;
	return sanitizeAnalyticsProperties(value as Record<string, unknown>);
}

export function sanitizeAnalyticsProperties(properties: Record<string, unknown>): Record<string, unknown> {
	const sanitized: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(properties)) {
		if (SENSITIVE_PROPERTY_KEYS.has(normalizePropertyKey(key))) continue;
		if (URL_PROPERTY_KEYS.has(key) && typeof value === "string") {
			sanitized[key] = key.includes("referrer") ? sanitizeAnalyticsReferrer(value) : sanitizeAnalyticsUrl(value);
			continue;
		}
		sanitized[key] = sanitizeNestedValue(value);
	}
	return sanitized;
}
