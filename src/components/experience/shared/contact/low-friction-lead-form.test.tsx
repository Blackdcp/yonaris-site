// @vitest-environment happy-dom

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GLOBAL_EN_CONTACT_PAGE } from "@/content/public-site/global-en/pages/contact";
import { GLOBAL_EN_CONTACT_FORM_UI } from "@/content/public-site/global-en/pages/contact";
import type { ContactFormResult } from "@/lib/contact-schema";
import { LowFrictionLeadForm } from "./low-friction-lead-form";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const submissionId = "0198ef3d-34e1-7f14-a74d-e09b66d14b11";
let root: Root | undefined;
let host: HTMLDivElement | undefined;

function form(result?: ContactFormResult) {
	return (
		<LowFrictionLeadForm
			copy={GLOBAL_EN_CONTACT_PAGE}
			uiCopy={GLOBAL_EN_CONTACT_FORM_UI}
			locale="en"
			privacyHref="/privacy"
			requestType="conversation"
			initialResult={result}
			initialSubmissionId={submissionId}
		/>
	);
}

async function mount(result?: ContactFormResult, reduced = false) {
	vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
		matches: reduced && query === "(prefers-reduced-motion: reduce)",
		media: query,
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		addListener: vi.fn(),
		removeListener: vi.fn(),
		dispatchEvent: vi.fn(() => true),
	}) as MediaQueryList);
	host = document.createElement("div");
	document.body.append(host);
	root = createRoot(host);
	await act(async () => root?.render(form(result)));
	return host;
}

function aperture(parent: ParentNode) {
	const node = parent.querySelector<HTMLElement>("[data-contact-aperture]");
	if (!node) throw new Error("Contact aperture not mounted");
	return node;
}

function input(parent: ParentNode, name: string) {
	const node = parent.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);
	if (!node) throw new Error(`Contact input ${name} not mounted`);
	return node;
}

async function setValue(parent: ParentNode, name: string, value: string) {
	const node = input(parent, name);
	await act(async () => {
		Object.getOwnPropertyDescriptor(node instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, "value")?.set?.call(node, value);
		node.dispatchEvent(new Event("input", { bubbles: true }));
		node.dispatchEvent(new Event("change", { bubbles: true }));
	});
}

async function submit(parent: ParentNode) {
	const node = parent.querySelector<HTMLFormElement>("form");
	if (!node) throw new Error("Contact form not mounted");
	await act(async () => node.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
}

afterEach(async () => {
	if (root) await act(async () => root?.unmount());
	host?.remove();
	root = undefined;
	host = undefined;
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe("low-friction contact aperture", () => {
	it("renders a real native form with only work email required and high-intent context collapsed", () => {
		const document = new DOMParser().parseFromString(renderToStaticMarkup(form()), "text/html");
		const nativeForm = document.querySelector("form");
		expect(aperture(document).dataset.v1State).toBe("idle");
		expect(nativeForm?.getAttribute("method")).toBe("post");
		expect(nativeForm?.getAttribute("action")).toBe("/api/contact");
		expect(document.querySelectorAll("[required]")).toHaveLength(1);
		expect(document.querySelector('[name="workEmail"][required][type="email"]')).not.toBeNull();
		expect(document.querySelector('[name="name"]')?.hasAttribute("required")).toBe(false);
		expect(document.querySelector('[name="companyOrWebsite"]')?.hasAttribute("required")).toBe(false);
		expect(document.querySelector('[name="curiosity"]')?.hasAttribute("required")).toBe(false);
		const expansion = document.querySelector("details[data-contact-high-intent]");
		expect(expansion?.hasAttribute("open")).toBe(false);
		expect(expansion?.querySelectorAll("input, textarea")).toHaveLength(3);
		expect(document.querySelector('[name="botField"]')).not.toBeNull();
		expect(document.querySelector('[name="locale"]')?.getAttribute("value")).toBe("en");
		expect(document.querySelector('[name="requestType"]')?.getAttribute("value")).toBe("conversation");
	});

	it("opens from idle to focused without losing the email value", async () => {
		const mounted = await mount();
		await setValue(mounted, "workEmail", "ava@acme.example");
		await act(async () => input(mounted, "workEmail").dispatchEvent(new FocusEvent("focusin", { bubbles: true })));
		expect(aperture(mounted).dataset.v1State).toBe("focused");
		expect(input(mounted, "workEmail").value).toBe("ava@acme.example");
	});

	it("uses a distinct expanded state and keeps it directly available with reduced motion", async () => {
		const mounted = await mount(undefined, true);
		const details = mounted.querySelector<HTMLDetailsElement>("details[data-contact-high-intent]");
		if (!details) throw new Error("High-intent expansion missing");
		details.open = true;
		await act(async () => details.dispatchEvent(new Event("toggle", { bubbles: true })));
		expect(aperture(mounted).dataset.v1State).toBe("expanded");
		expect(aperture(mounted).dataset.motionPreference).toBe("reduced");
	});

	it("shows invalid state, preserves optional values, and focuses the first invalid field", async () => {
		const mounted = await mount();
		await setValue(mounted, "name", "Ava Chen");
		await setValue(mounted, "workEmail", "not-an-email");
		await setValue(mounted, "curiosity", "Could Yonaris fit?");
		await submit(mounted);
		expect(aperture(mounted).dataset.v1State).toBe("invalid");
		expect(input(mounted, "workEmail").getAttribute("aria-invalid")).toBe("true");
		expect(document.activeElement).toBe(input(mounted, "workEmail"));
		expect(input(mounted, "name").value).toBe("Ava Chen");
		expect(input(mounted, "curiosity").value).toBe("Could Yonaris fit?");
	});

	it("keeps values and moves focus to retry feedback when delivery is unconfirmed", async () => {
		vi.stubGlobal("fetch", vi.fn(async () => Response.json({ status: "unconfirmed", values: {}, message: "not confirmed" }, { status: 503 })));
		const mounted = await mount();
		await setValue(mounted, "workEmail", "ava@acme.example");
		await setValue(mounted, "curiosity", "A preserved question");
		await submit(mounted);
		expect(aperture(mounted).dataset.v1State).toBe("unconfirmed");
		expect(input(mounted, "workEmail").value).toBe("ava@acme.example");
		expect(input(mounted, "curiosity").value).toBe("A preserved question");
		expect(document.activeElement).toBe(mounted.querySelector('[data-contact-status="unconfirmed"]'));
		expect(mounted.textContent).not.toContain(GLOBAL_EN_CONTACT_PAGE.success);
	});

	it("resolves only explicit server confirmation into a focused personal follow-up state", async () => {
		vi.stubGlobal("fetch", vi.fn(async () => Response.json({ status: "confirmed" }, { status: 202 })));
		const mounted = await mount();
		await setValue(mounted, "workEmail", "ava@acme.example");
		await submit(mounted);
		expect(aperture(mounted).dataset.v1State).toBe("confirmed");
		const status = mounted.querySelector<HTMLElement>('[data-contact-status="confirmed"]');
		expect(status?.textContent).toContain(GLOBAL_EN_CONTACT_PAGE.success);
		expect(document.activeElement).toBe(status);
		expect(input(mounted, "workEmail").value).toBe("ava@acme.example");
		expect(mounted.textContent).not.toMatch(/instant audit|automated score|generated report|meeting slot|response (?:time|sla)/i);
	});

	it("renders the privacy intent as an explicit manual-review boundary", () => {
		const markup = renderToStaticMarkup(
			<LowFrictionLeadForm copy={GLOBAL_EN_CONTACT_PAGE} uiCopy={GLOBAL_EN_CONTACT_FORM_UI} locale="en" privacyHref="/privacy" requestType="privacy" initialSubmissionId={submissionId} />,
		);
		expect(markup).toContain('name="requestType" value="privacy"');
		expect(markup).toMatch(/manual privacy review/i);
		expect(markup).toMatch(/does not automatically delete/i);
	});

	it("takes operational, privacy, validation, status, and link copy from the edition contract", () => {
		const uiCopy = {
			...GLOBAL_EN_CONTACT_FORM_UI,
			fieldsetLegend: "edition legend",
			botFieldLabel: "edition bot label",
			privacyBoundary: "edition manual boundary",
			privacySubmitLabel: "edition privacy submit",
			disclosure: "edition disclosure",
			privacyLinkLabel: "edition privacy link",
		} as const;
		const markup = renderToStaticMarkup(
			<LowFrictionLeadForm copy={GLOBAL_EN_CONTACT_PAGE} uiCopy={uiCopy} locale="zh-CN" privacyHref="/zh/privacy" requestType="privacy" initialSubmissionId={submissionId} />,
		);
		for (const value of ["edition legend", "edition bot label", "edition manual boundary", "edition privacy submit", "edition disclosure", "edition privacy link"]) {
			expect(markup).toContain(value);
		}
		expect(markup).toContain('href="/zh/privacy"');
	});
});
