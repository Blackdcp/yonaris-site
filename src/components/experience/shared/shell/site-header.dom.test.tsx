// @vitest-environment happy-dom

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { SiteHeader } from "./site-header";
import type { SiteShellCopy } from "./site-shell";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const copy = {
	brandLabel: "Yonaris home",
	skipLabel: "Skip to content",
	primaryNavigationLabel: "Primary navigation",
	mobileNavigationLabel: "Mobile navigation",
	footerNavigationLabel: "Footer navigation",
	menuLabel: "Menu",
	closeMenuLabel: "Close menu",
	contactCtaLabel: "Talk to Yonaris",
	localeLabel: "中文",
	localeAccessibleLabel: "View this page in Chinese",
	readingControlDescription: "One canonical fact, two readers",
	labels: {
		home: "Home",
		product: "Product",
		casework: "Casework",
		company: "Company",
		"human-agent": "Human / Agent",
		contact: "Contact",
		privacy: "Privacy",
		"agent-index": "Agent documents",
		"markets-languages": "Markets & languages",
	},
} as const satisfies SiteShellCopy;

let host: HTMLDivElement;
let root: Root;

beforeEach(async () => {
	host = document.createElement("div");
	document.body.append(host);
	root = createRoot(host);
	await act(async () => {
		root.render(<SiteHeader edition="global-en" pageKey="product" copy={copy} />);
	});
});

afterEach(async () => {
	await act(async () => root.unmount());
	host.remove();
});

function header(): HTMLElement {
	const element = host.querySelector<HTMLElement>(".site-v1-header");
	if (!element) throw new Error("Header not mounted");
	return element;
}

function menuButton(): HTMLButtonElement {
	const element = host.querySelector<HTMLButtonElement>(".site-v1-header__menu-button");
	if (!element) throw new Error("Menu button not mounted");
	return element;
}

function panel(): HTMLElement {
	const element = host.querySelector<HTMLElement>("#site-v1-mobile-navigation");
	if (!element) throw new Error("Mobile panel not mounted");
	return element;
}

async function toggleMenu() {
	await act(async () => menuButton().click());
}

describe("mounted progressive header", () => {
	it("keeps SSR primary navigation readable, then marks the mounted header as enhanced", () => {
		const ssr = renderToStaticMarkup(<SiteHeader edition="global-en" pageKey="product" copy={copy} />);
		expect(ssr).toContain("data-site-v1-primary-navigation");
		expect(ssr).toContain('class="site-v1-header__utilities"');
		expect(ssr).toContain('href="/zh/product"');
		expect(ssr).not.toContain("data-site-v1-enhanced");
		expect(header().getAttribute("data-site-v1-enhanced")).toBe("true");
	});

	it("opens and closes the real panel while keeping aria-expanded and hidden accurate", async () => {
		expect(menuButton().getAttribute("aria-expanded")).toBe("false");
		expect(panel().hidden).toBe(true);
		await toggleMenu();
		expect(menuButton().getAttribute("aria-expanded")).toBe("true");
		expect(panel().hidden).toBe(false);
		await toggleMenu();
		expect(menuButton().getAttribute("aria-expanded")).toBe("false");
		expect(panel().hidden).toBe(true);
	});

	it("closes on Escape and restores focus from a mobile route link to the menu button", async () => {
		await toggleMenu();
		const route = panel().querySelector<HTMLAnchorElement>('a[href="/casework"]');
		if (!route) throw new Error("Mobile route link not mounted");
		route.focus();
		expect(document.activeElement).toBe(route);
		await act(async () => route.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
		expect(menuButton().getAttribute("aria-expanded")).toBe("false");
		expect(panel().hidden).toBe(true);
		expect(document.activeElement).toBe(menuButton());
	});

	it("closes on mobile route selection", async () => {
		await toggleMenu();
		const route = panel().querySelector<HTMLAnchorElement>('a[href="/casework"]');
		if (!route) throw new Error("Mobile route link not mounted");
		route.addEventListener("click", (event) => event.preventDefault());
		await act(async () => route.click());
		expect(menuButton().getAttribute("aria-expanded")).toBe("false");
		expect(panel().hidden).toBe(true);
	});

	it("closes on locale selection while preserving the manifest-derived destination", async () => {
		await toggleMenu();
		const locale = panel().querySelector<HTMLAnchorElement>(".site-v1-header__mobile-locale");
		if (!locale) throw new Error("Mobile locale link not mounted");
		expect(locale.getAttribute("href")).toBe("/zh/product");
		locale.addEventListener("click", (event) => event.preventDefault());
		await act(async () => locale.click());
		expect(menuButton().getAttribute("aria-expanded")).toBe("false");
		expect(panel().hidden).toBe(true);
	});

	it("uses enhancement-gated mobile CSS so SSR and hydrated modes each expose one navigation path", () => {
		const css = readFileSync(resolve(process.cwd(), "src/styles/site-v1/shell.css"), "utf8");
		expect(css).toMatch(/\.site-v1-header__menu-button\s*\{[^}]*display:\s*none;/s);
		const mobile = css.slice(css.indexOf("@media (max-width: 44rem)"));
		expect(mobile).toMatch(/\.site-v1-header__utilities\s*\{[^}]*grid-column:\s*1 \/ -1;[^}]*grid-row:\s*3;[^}]*display:\s*flex;/s);
		expect(mobile).toMatch(/\.site-v1-header\[data-site-v1-enhanced="true"\] \.site-v1-header__primary\s*\{[^}]*display:\s*none;/s);
		expect(mobile).toMatch(/\.site-v1-header\[data-site-v1-enhanced="true"\] \.site-v1-header__menu-button\s*\{[^}]*display:\s*inline-flex;/s);
		expect(mobile).toMatch(/\.site-v1-header\[data-site-v1-enhanced="true"\] \.site-v1-header__utilities\s*\{[^}]*display:\s*none;/s);
		expect(mobile).not.toMatch(/\n\s*\.site-v1-header__menu-button\s*\{[^}]*display:\s*inline-flex;/s);
		expect(mobile).not.toMatch(/\n\s*\.site-v1-header__utilities\s*\{[^}]*display:\s*none;/s);
	});
});
