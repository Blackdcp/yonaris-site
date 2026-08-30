import { existsSync, readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { SITE_V1_ASSETS } from "./assets";

const publicRoot = new URL("../../../public/", import.meta.url);

type RasterFormat = "png" | "webp" | "avif";

interface RasterInspection {
	readonly format: RasterFormat;
	readonly width: number;
	readonly height: number;
}

function inspectRaster(file: URL): RasterInspection {
	const bytes = readFileSync(file);
	if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
		return { format: "png", width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
	}
	if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") {
		const chunk = bytes.toString("ascii", 12, 16);
		if (chunk === "VP8 ") {
			return { format: "webp", width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff };
		}
		if (chunk === "VP8L") {
			const packed = bytes.readUInt32LE(21);
			return { format: "webp", width: (packed & 0x3fff) + 1, height: ((packed >> 14) & 0x3fff) + 1 };
		}
		if (chunk === "VP8X") {
			return {
				format: "webp",
				width: bytes.readUIntLE(24, 3) + 1,
				height: bytes.readUIntLE(27, 3) + 1,
			};
		}
		throw new Error(`Unsupported WebP chunk ${chunk} in ${file.pathname}`);
	}
	if (bytes.toString("ascii", 4, 8) === "ftyp" && bytes.subarray(8, 32).toString("ascii").includes("avif")) {
		const ispe = bytes.indexOf(Buffer.from("ispe"));
		if (ispe < 0 || ispe + 16 > bytes.length) throw new Error(`AVIF spatial extent missing in ${file.pathname}`);
		return { format: "avif", width: bytes.readUInt32BE(ispe + 8), height: bytes.readUInt32BE(ispe + 12) };
	}
	throw new Error(`Unrecognized raster signature in ${file.pathname}`);
}

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
			const master = inspectRaster(new URL(asset.master.src.slice(1), publicRoot));
			expect(master).toEqual({ format: "png", width: asset.master.width, height: asset.master.height });
			const expectedWidths = [640, 1024, 1600].filter((width) => width <= asset.master.width);
			expect(asset.derivatives.map((item) => item.width)).toEqual(expectedWidths);
			for (const derivative of asset.derivatives) {
				expect(derivative.width).toBeLessThanOrEqual(master.width);
				for (const [path, format] of [[derivative.webp, "webp"], [derivative.avif, "avif"]] as const) {
					expect(path).toMatch(/^\/assets\/site-v1\//);
					const file = new URL(path.slice(1), publicRoot);
					expect(existsSync(file), `${path} must exist`).toBe(true);
					expect(statSync(file).size, `${path} must not be empty`).toBeGreaterThan(0);
					const inspected = inspectRaster(file);
					expect(inspected.format, `${path} signature must match its extension`).toBe(format);
					expect(inspected.width, `${path} pixels must match the declared width`).toBe(derivative.width);
					expect(inspected.height, `${path} height must preserve the master aspect ratio`).toBe(
						Math.round(master.height * derivative.width / master.width),
					);
					expect(Math.abs(inspected.width / inspected.height - master.width / master.height)).toBeLessThan(0.002);
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
