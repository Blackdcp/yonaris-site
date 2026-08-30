// @vitest-environment happy-dom

import type { ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GLOBAL_EN_PRIVACY_PAGE } from "@/content/public-site/global-en/pages/privacy";
import { buildPageHead } from "@/editions/page-head";
import { Route } from "@/routes/privacy";
import { ContactPage } from "./contact-page";

type PrivacyModule = { readonly PrivacyPage?: ComponentType };
const subject = (await import("./privacy-page").catch(() => undefined)) as PrivacyModule | undefined;

describe("English Site 1.0 Privacy route", () => {
	it("uses a dedicated editorial assembler with the exact approved document sequence", () => {
		expect(subject?.PrivacyPage).toBeTypeOf("function");
		if (!subject?.PrivacyPage) return;
		const document = new DOMParser().parseFromString(renderToStaticMarkup(<subject.PrivacyPage />), "text/html");
		expect(Route.options.component).toBe(subject.PrivacyPage);
		expect(document.querySelector('[data-generation="site-v1"][data-page="privacy"]')).not.toBeNull();
		expect(document.querySelectorAll("main")).toHaveLength(1);
		expect(document.querySelectorAll("h1")).toHaveLength(1);
		expect(document.querySelector("h1")?.textContent).toBe(GLOBAL_EN_PRIVACY_PAGE.hero.headline);
		expect(document.body.textContent).toContain(GLOBAL_EN_PRIVACY_PAGE.hero.body);

		const sections = [...document.querySelectorAll<HTMLElement>("[data-privacy-section]")];
		expect(sections.map((section) => section.dataset.privacySection)).toEqual([
			"submitted",
			"delivered",
			"used",
			"retention",
		]);
		expect(sections.map((section) => section.querySelector("h2")?.textContent)).toEqual([
			"What you submit",
			"How it is delivered",
			"How it is used",
			"Retention and deletion",
		]);
		expect(sections.map((section) => section.querySelector("p")?.textContent)).toEqual([
			GLOBAL_EN_PRIVACY_PAGE.submitted,
			GLOBAL_EN_PRIVACY_PAGE.delivered,
			GLOBAL_EN_PRIVACY_PAGE.used,
			GLOBAL_EN_PRIVACY_PAGE.retention,
		]);
		expect(document.querySelector("[data-contact-aperture], [role='tablist']")).toBeNull();
	});

	it("resolves the typed privacy-request action into the privacy contact mode", () => {
		expect(subject?.PrivacyPage).toBeTypeOf("function");
		if (!subject?.PrivacyPage) return;
		const privacyDocument = new DOMParser().parseFromString(
			renderToStaticMarkup(<subject.PrivacyPage />),
			"text/html",
		);
		expect(privacyDocument.querySelector('a[href="/contact?intent=privacy"]')?.textContent).toBe(
			GLOBAL_EN_PRIVACY_PAGE.action.label,
		);

		const contactDocument = new DOMParser().parseFromString(
			renderToStaticMarkup(<ContactPage requestType="privacy" />),
			"text/html",
		);
		expect(contactDocument.querySelector('input[name="requestType"]')?.getAttribute("value")).toBe("privacy");
		expect(contactDocument.body.textContent).toMatch(/manual (?:privacy )?review/i);
		expect(contactDocument.body.textContent).toMatch(/does not (?:automatically |auto-?)delete/i);
	});

	it("emits exact metadata, canonical links and Privacy WebPage JSON-LD", () => {
		const head = (Route.options.head as () => ReturnType<typeof buildPageHead>)();
		expect(head.meta).toContainEqual({ title: "Privacy — Yonaris" });
		expect(head.meta).toContainEqual({
			name: "description",
			content: "How Yonaris receives, uses, retains and responds to information submitted through the contact form.",
		});
		expect(head.links).toContainEqual({ rel: "canonical", href: "https://yonaris.com/privacy" });
		expect(head.links).toContainEqual({ rel: "alternate", hrefLang: "zh-CN", href: "https://yonaris.com/zh/privacy" });
		const graph = JSON.parse(head.scripts[0].children)["@graph"] as Array<Record<string, unknown>>;
		const webPage = graph.find((node) => node["@type"] === "WebPage");
		expect(webPage?.name).toBe(GLOBAL_EN_PRIVACY_PAGE.metadata.title);
		expect(webPage?.description).toBe(GLOBAL_EN_PRIVACY_PAGE.metadata.description);
	});
});
