// @vitest-environment happy-dom

import type { ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GLOBAL_EN_CASEWORK_PAGE } from "@/content/public-site/global-en/pages/casework";
import { GLOBAL_EN_COMPANY_PAGE } from "@/content/public-site/global-en/pages/company";
import { GLOBAL_EN_CONTACT_PAGE } from "@/content/public-site/global-en/pages/contact";
import { GLOBAL_EN_HOME_PAGE } from "@/content/public-site/global-en/pages/home";
import { GLOBAL_EN_HUMAN_AGENT_PAGE } from "@/content/public-site/global-en/pages/human-agent";
import { GLOBAL_EN_PRIVACY_PAGE } from "@/content/public-site/global-en/pages/privacy";
import { GLOBAL_EN_PRODUCT_PAGE } from "@/content/public-site/global-en/pages/product";
import { Route as HomeRoute } from "@/routes/index";
import { Route as ProductRoute } from "@/routes/product";
import { Route as CaseworkRoute } from "@/routes/casework";
import { Route as CompanyRoute } from "@/routes/company";
import { Route as HumanAgentRoute } from "@/routes/human-agent";
import { Route as ContactRoute } from "@/routes/contact";
import { Route as PrivacyRoute } from "@/routes/privacy";
import { Route as PlatformRoute } from "@/routes/platform";
import { Route as FeaturesRoute } from "@/routes/features";
import { Route as ApproachRoute } from "@/routes/approach";
import { Route as MethodologyRoute } from "@/routes/methodology";
import { Route as ResultsRoute } from "@/routes/results";
import { Route as GeoRoute } from "@/routes/geo";
import { Route as OffSiteAeoRoute } from "@/routes/off-site-aeo";
import { Route as DiagnosticRoute } from "@/routes/diagnostic";
import { Route as PricingRoute } from "@/routes/pricing";
import { Route as VisionRoute } from "@/routes/vision";
import { HomePage } from "./pages/home-page";
import { ProductPage } from "./pages/product-page";
import { CaseworkPage } from "./pages/casework-page";
import { CompanyPage } from "./pages/company-page";
import { HumanAgentPage } from "./pages/human-agent-page";
import { ContactPage } from "./pages/contact-page";

type PrivacyModule = { readonly PrivacyPage?: ComponentType };
const privacyModule = (await import("./pages/privacy-page").catch(() => undefined)) as PrivacyModule | undefined;

const canonicalPages = [
	["home", HomePage, GLOBAL_EN_HOME_PAGE.hero.headline],
	["product", ProductPage, GLOBAL_EN_PRODUCT_PAGE.hero.headline],
	["casework", CaseworkPage, GLOBAL_EN_CASEWORK_PAGE.hero.headline],
	["company", CompanyPage, GLOBAL_EN_COMPANY_PAGE.hero.headline],
	["human-agent", HumanAgentPage, GLOBAL_EN_HUMAN_AGENT_PAGE.hero.headline],
	["contact", ContactPage, GLOBAL_EN_CONTACT_PAGE.hero.headline],
	["privacy", privacyModule?.PrivacyPage, GLOBAL_EN_PRIVACY_PAGE.hero.headline],
] as const;

const canonicalRoutes = [
	[HomeRoute, GLOBAL_EN_HOME_PAGE],
	[ProductRoute, GLOBAL_EN_PRODUCT_PAGE],
	[CaseworkRoute, GLOBAL_EN_CASEWORK_PAGE],
	[CompanyRoute, GLOBAL_EN_COMPANY_PAGE],
	[HumanAgentRoute, GLOBAL_EN_HUMAN_AGENT_PAGE],
	[ContactRoute, GLOBAL_EN_CONTACT_PAGE],
	[PrivacyRoute, GLOBAL_EN_PRIVACY_PAGE],
] as const;

const aliases = [
	["/platform", PlatformRoute, "/product"],
	["/features", FeaturesRoute, "/product"],
	["/approach", ApproachRoute, "/product#how-it-works"],
	["/methodology", MethodologyRoute, "/product#how-it-works"],
	["/results", ResultsRoute, "/casework"],
	["/geo", GeoRoute, "/product#markets-languages"],
	["/off-site-aeo", OffSiteAeoRoute, "/product#markets-languages"],
	["/diagnostic", DiagnosticRoute, "/contact"],
	["/pricing", PricingRoute, "/contact"],
	["/vision", VisionRoute, "/company"],
] as const;
const aliasSources = new Set<string>(aliases.map(([source]) => source));

type RedirectHandler = (context: { readonly request: Request }) => Response | Promise<Response>;
type RedirectRoute = {
	readonly options: { readonly server?: { readonly handlers?: Partial<Record<"GET" | "HEAD", RedirectHandler>> } };
};

describe("English Site 1.0 canonical route boundary", () => {
	it("renders every canonical English page through a dedicated Site 1.0 composition", () => {
		for (const [key, Page, headline] of canonicalPages) {
			expect(Page, `${key} needs a dedicated page assembler`).toBeTypeOf("function");
			if (!Page) continue;
			const document = new DOMParser().parseFromString(renderToStaticMarkup(<Page />), "text/html");
			expect(document.querySelector(`[data-generation="site-v1"][data-page="${key}"]`)).not.toBeNull();
			expect(document.querySelectorAll("main")).toHaveLength(1);
			expect(document.querySelectorAll("h1")).toHaveLength(1);
			expect(document.querySelector("h1")?.textContent).toBe(headline);
			expect(document.querySelector('[data-generation="site-06"]')).toBeNull();
		}
	});

	it("publishes the exact approved metadata for all seven canonical routes", () => {
		for (const [route, copy] of canonicalRoutes) {
			const head = (route.options.head as unknown as () => {
				readonly meta: readonly Record<string, string>[];
				readonly links: readonly Record<string, string>[];
			})();
			expect(head.meta).toContainEqual({ title: copy.metadata.title });
			expect(head.meta).toContainEqual({ name: "description", content: copy.metadata.description });
		}
	});

	it.each(aliases)("makes %s a direct, bodyless 308 for GET and HEAD", async (from, route, destination) => {
		const redirectRoute = route as unknown as RedirectRoute;
		for (const method of ["GET", "HEAD"] as const) {
			const handler = redirectRoute.options.server?.handlers?.[method];
			expect(handler, `${from} must expose ${method}`).toBeTypeOf("function");
			if (!handler) continue;
			const response = await handler({ request: new Request(`https://yonaris.com${from}?utm=x`, { method }) });
			const [path, fragment] = destination.split("#", 2);
			expect(response.status).toBe(308);
			expect(response.headers.get("location")).toBe(`${path}?utm=x${fragment ? `#${fragment}` : ""}`);
			expect(await response.text()).toBe("");
			expect(aliasSources.has(destination)).toBe(false);
		}
	});

	it("preserves a privacy intent on the direct Diagnostic compatibility redirect", async () => {
		const route = DiagnosticRoute as unknown as RedirectRoute;
		const handler = route.options.server?.handlers?.GET;
		expect(handler).toBeTypeOf("function");
		if (!handler) return;
		const response = await handler({ request: new Request("https://yonaris.com/diagnostic?intent=privacy") });
		expect(response.headers.get("location")).toBe("/contact?intent=privacy");
	});
});
