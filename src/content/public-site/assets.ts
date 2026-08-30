import type { PublicPageKey } from "@/site/route-types";

export type SiteV1AssetId = "hero-evidence-field" | "product-observation-room" | "company-light-corridor";

export interface SiteV1AssetDerivative {
	readonly width: 640 | 1024 | 1600;
	readonly webp: `/assets/site-v1/${string}.webp`;
	readonly avif: `/assets/site-v1/${string}.avif`;
}

export interface SiteV1Asset {
	readonly id: SiteV1AssetId;
	readonly master: {
		readonly src: `/assets/site-v1/${string}.png`;
		readonly width: number;
		readonly height: number;
	};
	readonly derivatives: readonly SiteV1AssetDerivative[];
	readonly mobileCrop: "center left" | "center" | "center right";
	readonly focalPoint: Readonly<{ x: number; y: number }>;
	readonly presentation: "decorative" | "informative";
	readonly alt: string;
	readonly owner: PublicPageKey;
	readonly provenance: {
		readonly generator: "OpenAI built-in image generation";
		readonly generatedAt: `${number}-${number}-${number}`;
		readonly prompt: string;
	};
}

const paths = (id: SiteV1AssetId): readonly SiteV1AssetDerivative[] =>
	([640, 1024, 1600] as const).map((width) => ({
		width,
		webp: `/assets/site-v1/${id}-${width}.webp`,
		avif: `/assets/site-v1/${id}-${width}.avif`,
	}));

const heroPrompt = `Use case: stylized-concept. Asset type: Site 1.0 landing-page hero master for Yonaris. Create an original cinematic abstract evidence field inside a fictional enterprise interior: a deep navy architectural volume with an open, quiet left half for copy and, on the right, layered optical-glass planes, suspended translucent evidence fragments, fine connective hairlines, and aperture-like depth. Wide 16:9 framing, right-weighted optical cluster, controlled warm directional light, restrained orange trace accents, cool blue-grey reflections, subtle grain. Entirely original composition; no words or text; no letters or numbers; no logos or brand marks; no watermark; no people or identifiable people; no screens; no fake UI; no dashboard screenshot; no stock-photo aesthetic; no competitor composition; no external trademarks.`;

const productPrompt = `Use case: stylized-concept. Asset type: Site 1.0 Product page observation-environment master for Yonaris. Create an original immersive enterprise observation room where layered evidence relationships can be examined without a literal application interface: a deep navy, room-scale interior with a central observation table, staggered optical-glass evidence surfaces at different depths, and fine physical trace lines connecting abstract sources, gaps, and review points. Wide 16:9 immersive, slightly elevated framing; warm directional light through an upper aperture; sparse orange trace glow; cool blue-grey reflections; smoked glass, dark stone, brushed metal, and subtle grain. Entirely original composition; no words or text; no letters or numbers; no logos or brand marks; no watermark; no people or identifiable people; no screens; no fake UI; no dashboard screenshot; no stock-photo aesthetic; no competitor composition; no external trademarks.`;

const companyPrompt = `Use case: stylized-concept. Asset type: Site 1.0 Company page architectural master for Yonaris. Create an original cinematic light corridor expressing continuity, durable evidence, and global capability across changing market conditions: a long deep-navy passage with repeating offset portals, slim optical-glass partitions, and a continuous warm trace of light traveling through the full depth. Wide 16:9 framing with slightly off-center one-point perspective, visible near and far thresholds, warm distant light, blue-grey reflected light, dark stone, smoked glass, brushed metal, and subtle grain. Entirely original composition; no words or text; no letters or numbers; no logos or brand marks; no watermark; no people or identifiable people; no screens; no fake UI; no dashboard screenshot; no stock-photo aesthetic; no competitor composition; no external trademarks.`;

export const SITE_V1_ASSETS = {
	"hero-evidence-field": {
		id: "hero-evidence-field",
		master: { src: "/assets/site-v1/hero-evidence-field.png", width: 1672, height: 941 },
		derivatives: paths("hero-evidence-field"),
		mobileCrop: "center right",
		focalPoint: { x: 0.76, y: 0.48 },
		presentation: "decorative",
		alt: "",
		owner: "home",
		provenance: { generator: "OpenAI built-in image generation", generatedAt: "2026-08-31", prompt: heroPrompt },
	},
	"product-observation-room": {
		id: "product-observation-room",
		master: { src: "/assets/site-v1/product-observation-room.png", width: 1672, height: 941 },
		derivatives: paths("product-observation-room"),
		mobileCrop: "center",
		focalPoint: { x: 0.5, y: 0.47 },
		presentation: "informative",
		alt: "A cinematic observation room of layered optical evidence surfaces connected by warm trace lines.",
		owner: "product",
		provenance: { generator: "OpenAI built-in image generation", generatedAt: "2026-08-31", prompt: productPrompt },
	},
	"company-light-corridor": {
		id: "company-light-corridor",
		master: { src: "/assets/site-v1/company-light-corridor.png", width: 1672, height: 941 },
		derivatives: paths("company-light-corridor"),
		mobileCrop: "center",
		focalPoint: { x: 0.58, y: 0.5 },
		presentation: "informative",
		alt: "A deep navy architectural corridor joined by one continuous warm line of light.",
		owner: "company",
		provenance: { generator: "OpenAI built-in image generation", generatedAt: "2026-08-31", prompt: companyPrompt },
	},
} as const satisfies Readonly<Record<SiteV1AssetId, SiteV1Asset>>;

export function getSiteV1Asset(id: SiteV1AssetId): SiteV1Asset {
	return SITE_V1_ASSETS[id];
}
