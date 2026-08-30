// @vitest-environment happy-dom

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GLOBAL_EN_CONTACT_PAGE } from "@/content/public-site/global-en/pages/contact";
import { buildPageHead } from "@/editions/page-head";
import type { ContactFormResult } from "@/lib/contact-schema";
import { Route } from "@/routes/contact";
import { renderContactNativeDocument } from "./contact-native-document.server";
import { ContactPage } from "./contact-page";

const submissionId = "0198ef3d-34e1-7f14-a74d-e09b66d14b11";

function staticDocument(node = <ContactPage />) {
	return new DOMParser().parseFromString(renderToStaticMarkup(node), "text/html");
}

describe("English Site 1.0 Contact route", () => {
	it("uses the English shell and exact approved Contact copy", () => {
		const document = staticDocument();
		expect(Route.options.component).toBeDefined();
		expect(document.querySelector('[data-generation="site-v1"][data-page="contact"]')).not.toBeNull();
		expect(document.querySelector('a[href="/contact"][aria-current="page"]')).not.toBeNull();
		expect(document.querySelector("h1")?.textContent).toBe(GLOBAL_EN_CONTACT_PAGE.hero.headline);
		expect(document.body.textContent).toContain(GLOBAL_EN_CONTACT_PAGE.hero.body);
		for (const text of [
			GLOBAL_EN_CONTACT_PAGE.form.workEmailLabel,
			GLOBAL_EN_CONTACT_PAGE.form.nameLabel,
			GLOBAL_EN_CONTACT_PAGE.form.companyLabel,
			GLOBAL_EN_CONTACT_PAGE.form.curiosityLabel,
			GLOBAL_EN_CONTACT_PAGE.form.submitLabel,
			GLOBAL_EN_CONTACT_PAGE.form.expansionLabel,
			...GLOBAL_EN_CONTACT_PAGE.form.expandedFields,
		]) expect(document.body.textContent).toContain(text);
	});

	it("emits exact typed metadata, canonical URL, reciprocal locale URL, and Contact WebPage JSON-LD", () => {
		const head = (Route.options.head as () => ReturnType<typeof buildPageHead>)();
		expect(head.meta).toContainEqual({ title: GLOBAL_EN_CONTACT_PAGE.metadata.title });
		expect(head.meta).toContainEqual({ name: "description", content: GLOBAL_EN_CONTACT_PAGE.metadata.description });
		expect(head.links).toContainEqual({ rel: "canonical", href: "https://yonaris.com/contact" });
		expect(head.links).toContainEqual({ rel: "alternate", hrefLang: "zh-CN", href: "https://yonaris.com/zh/contact" });
		const graph = JSON.parse(head.scripts[0].children)["@graph"] as Array<Record<string, unknown>>;
		const webPage = graph.find((node) => node["@type"] === "WebPage");
		expect(webPage?.["@id"]).toBe("https://yonaris.com/contact#webpage");
		expect(webPage?.url).toBe("https://yonaris.com/contact");
		expect(webPage?.name).toBe(GLOBAL_EN_CONTACT_PAGE.metadata.title);
		expect(webPage?.description).toBe(GLOBAL_EN_CONTACT_PAGE.metadata.description);
	});

	it("contains one memorable aperture rather than cards or fake instant output", () => {
		const document = staticDocument();
		expect(document.querySelectorAll("[data-contact-aperture]")).toHaveLength(1);
		expect(document.querySelector("[data-contact-aperture]")?.getAttribute("data-v1-state")).toBe("idle");
		expect(document.querySelector("[data-product-question-workspace], [data-casework-walkthrough], [data-human-agent-lens], [role='tablist']")).toBeNull();
		const positiveClaims = (document.body.textContent ?? "").replace(GLOBAL_EN_CONTACT_PAGE.boundary, "");
		expect(document.body.textContent).toContain(GLOBAL_EN_CONTACT_PAGE.boundary);
		expect(positiveClaims).not.toMatch(/instant audit|automated score|generated report|meeting slot|response (?:time|sla)/i);
	});

	it.each([
		{
			status: "invalid" as const,
			values: { locale: "en" as const, workEmail: "wrong", name: "Ava", companyOrWebsite: "", curiosity: "Kept", marketQuestion: "", marketOrLanguage: "", buyerOrCommercialContext: "", requestType: "conversation" as const, botField: "" },
			fieldErrors: { workEmail: "Enter a valid work email." },
		},
		{
			status: "unconfirmed" as const,
			values: { locale: "en" as const, workEmail: "ava@acme.example", name: "Ava", companyOrWebsite: "", curiosity: "Kept", marketQuestion: "", marketOrLanguage: "", buyerOrCommercialContext: "", requestType: "conversation" as const, botField: "" },
			message: "We could not confirm delivery. Your details are still here—please try again.",
		},
	] satisfies ContactFormResult[])("server-renders a real no-JS $status state with preserved values", (result) => {
		const document = staticDocument(<ContactPage initialResult={result} initialSubmissionId={submissionId} />);
		expect(document.querySelector("[data-contact-aperture]")?.getAttribute("data-v1-state")).toBe(result.status);
		expect(document.querySelector<HTMLInputElement>('[name="workEmail"]')?.value).toBe(result.values.workEmail);
		expect(document.querySelector<HTMLInputElement>('[name="name"]')?.value).toBe("Ava");
		expect(document.body.textContent).toContain("Kept");
		expect(document.querySelector("form")?.getAttribute("method")).toBe("post");
	});

	it("makes the native skip link keyboard-revealable and declaratively focuses each server result", () => {
		const values = {
			locale: "en" as const,
			workEmail: "ava@acme.example",
			name: "Ava",
			companyOrWebsite: "",
			curiosity: "Kept",
			marketQuestion: "Server-retained market question",
			marketOrLanguage: "",
			buyerOrCommercialContext: "",
			requestType: "conversation" as const,
			botField: "",
		};
		const native = (result: ContactFormResult) => renderContactNativeDocument(
			result,
			submissionId,
			{ locale: "en", requestType: "conversation" },
		);
		const invalidHtml = native({
			status: "invalid",
			values,
			fieldErrors: { marketQuestion: "This value was rejected by the server." },
		});
		const invalidDocument = new DOMParser().parseFromString(invalidHtml, "text/html");
		const style = invalidDocument.querySelector("style")?.textContent ?? "";

		expect(style).toContain(".site-v1-skip-link:focus");
		expect(style).toContain(".site-v1-skip-link:focus-visible");
		expect(invalidDocument.querySelector('[name="marketQuestion"][autofocus]')).not.toBeNull();
		expect(invalidDocument.querySelector("details[data-contact-high-intent]")?.hasAttribute("open")).toBe(true);

		const unconfirmedDocument = new DOMParser().parseFromString(native({
			status: "unconfirmed",
			values,
			message: "Delivery was not confirmed.",
		}), "text/html");
		expect(unconfirmedDocument.querySelector('[data-contact-status="unconfirmed"][tabindex="-1"][autofocus]')).not.toBeNull();

		const confirmedDocument = new DOMParser().parseFromString(native({ status: "confirmed" }), "text/html");
		expect(confirmedDocument.querySelector('[data-contact-status="confirmed"][tabindex="-1"][autofocus]')).not.toBeNull();
	});
});
