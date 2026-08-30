import { existsSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SITE_V1_ASSETS } from "./assets";

const publicRoot = new URL("../../../public/", import.meta.url);

describe("Site 1.0 generated asset manifest", () => {
	it("records three distinct local masters with generated provenance and page ownership", () => {
		expect(Object.keys(SITE_V1_ASSETS)).toEqual([
			"hero-evidence-field",
			"product-observation-room",
			"company-light-corridor",
		]);

		const masters = Object.values(SITE_V1_ASSETS).map((asset) => asset.master.src);
		expect(new Set(masters).size).toBe(3);
		for (const asset of Object.values(SITE_V1_ASSETS)) {
			expect(asset.master.src).toMatch(/^\/assets\/site-v1\/.+\.png$/);
			expect(asset.master.width).toBeGreaterThanOrEqual(1600);
			expect(asset.master.height).toBeGreaterThan(0);
			expect(asset.provenance.generator).toBe("OpenAI built-in image generation");
			expect(asset.provenance.prompt).toMatch(/no (?:words or )?text/i);
			expect(asset.provenance.prompt.length).toBeGreaterThan(180);
			expect(asset.focalPoint.x).toBeGreaterThanOrEqual(0);
			expect(asset.focalPoint.x).toBeLessThanOrEqual(1);
			expect(asset.mobileCrop).toMatch(/center|left|right/);
			expect(asset.presentation === "decorative" ? asset.alt === "" : asset.alt.length > 0).toBe(true);
			expect(existsSync(new URL(asset.master.src.slice(1), publicRoot))).toBe(true);
		}
	});

	it("ships WebP and AVIF responsive derivatives at practical widths without upscaling", () => {
		for (const asset of Object.values(SITE_V1_ASSETS)) {
			const expectedWidths = [640, 1024, 1600].filter((width) => width <= asset.master.width);
			expect(asset.derivatives.map((item) => item.width)).toEqual(expectedWidths);
			for (const derivative of asset.derivatives) {
				expect(derivative.width).toBeLessThanOrEqual(asset.master.width);
				for (const path of [derivative.webp, derivative.avif]) {
					expect(path).toMatch(/^\/assets\/site-v1\//);
					const file = new URL(path.slice(1), publicRoot);
					expect(existsSync(file), `${path} must exist`).toBe(true);
					expect(statSync(file).size, `${path} must not be empty`).toBeGreaterThan(0);
				}
			}
		}
	});

	it("contains no external image host, stock credit or screenshot-like presentation", () => {
		const serialized = JSON.stringify(SITE_V1_ASSETS);
		expect(serialized).not.toMatch(/https?:\/\/|Unsplash|Pexels|Shutterstock|Getty|Photo:/i);
		for (const asset of Object.values(SITE_V1_ASSETS)) expect(asset.alt).not.toMatch(/dashboard|screenshot|interface/i);
	});
});
