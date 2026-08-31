"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import type { CompanyPageCopy, CompanyPrincipleKey, CompanySiteV1Copy } from "@/content/public-site/contracts/pages/company";
import type { SiteV1Asset } from "@/content/public-site/assets";
import { useMotionPreference } from "../motion/use-motion-preference";

const APERTURE_GEOMETRY = [
	{ clipPath: "polygon(4% 8%, 92% 8%, 96% 92%, 10% 96%)", lightLeft: "13%", lightWidth: "18%", lightTransform: "skewX(-8deg)" },
	{ clipPath: "polygon(12% 4%, 88% 11%, 94% 88%, 6% 94%)", lightLeft: "28%", lightWidth: "11%", lightTransform: "skewX(5deg)" },
	{ clipPath: "polygon(2% 15%, 96% 3%, 88% 96%, 15% 88%)", lightLeft: "47%", lightWidth: "22%", lightTransform: "skewX(-4deg)" },
	{ clipPath: "polygon(15% 7%, 84% 3%, 97% 82%, 8% 97%)", lightLeft: "66%", lightWidth: "9%", lightTransform: "skewX(9deg)" },
	{ clipPath: "polygon(7% 3%, 96% 14%, 82% 94%, 3% 83%)", lightLeft: "79%", lightWidth: "16%", lightTransform: "skewX(-11deg)" },
] as const;

type PublicFactAttachment = {
	readonly id: string;
	readonly value: string;
	readonly source: string;
	readonly scope: string;
	readonly reviewed: string;
	readonly boundary: string;
};

function pictureSources(asset: SiteV1Asset) {
	return {
		avif: asset.derivatives.map((item) => `${item.avif} ${item.width}w`).join(", "),
		webp: asset.derivatives.map((item) => `${item.webp} ${item.width}w`).join(", "),
	};
}

function percentage(value: number) {
	return `${Math.round(value * 10000) / 100}%`;
}

function publicFactAttachments(edition: "global-en" | "zh-cn"): Readonly<Record<CompanyPrincipleKey, PublicFactAttachment>> {
	const category = PRODUCT_FACTS.category;
	const capability = PRODUCT_FACTS.capability;
	return {
		why: {
			id: category.id,
			value: category.value[edition],
			source: category.source.label[edition],
			scope: category.scope[edition],
			reviewed: category.lastReviewed,
			boundary: category.boundary[edition],
		},
		audience: {
			id: capability.id,
			value: capability.value[edition],
			source: capability.source.label[edition],
			scope: capability.scope[edition],
			reviewed: capability.lastReviewed,
			boundary: capability.boundary[edition],
		},
		markets: {
			id: category.id,
			value: category.value[edition],
			source: category.source.label[edition],
			scope: category.scope[edition],
			reviewed: category.lastReviewed,
			boundary: category.boundary[edition],
		},
		"human-judgement": {
			id: capability.id,
			value: capability.value[edition],
			source: capability.source.label[edition],
			scope: capability.scope[edition],
			reviewed: capability.lastReviewed,
			boundary: capability.boundary[edition],
		},
		"non-promises": {
			id: category.id,
			value: category.value[edition],
			source: category.source.label[edition],
			scope: category.scope[edition],
			reviewed: category.lastReviewed,
			boundary: category.boundary[edition],
		},
	};
}

function principleBodies(copy: CompanyPageCopy): Readonly<Record<CompanyPrincipleKey, string>> {
	return {
		why: copy.why,
		audience: copy.audience,
		markets: copy.markets,
		"human-judgement": copy.humanJudgement,
		"non-promises": copy.nonPromises,
	};
}

function destination(index: number, key: string) {
	if (key === "Home") return 0;
	if (key === "End") return APERTURE_GEOMETRY.length - 1;
	if (key === "ArrowRight" || key === "ArrowDown") return (index + 1) % APERTURE_GEOMETRY.length;
	if (key === "ArrowLeft" || key === "ArrowUp") return (index - 1 + APERTURE_GEOMETRY.length) % APERTURE_GEOMETRY.length;
	return undefined;
}

export function CompanyAperture({ copy, labels, asset, edition = "global-en", imageAlt = asset.alt }: {
	readonly copy: CompanyPageCopy;
	readonly labels: CompanySiteV1Copy;
	readonly asset: SiteV1Asset;
	readonly edition?: "global-en" | "zh-cn";
	readonly imageAlt?: string;
}) {
	const [activeIndex, setActiveIndex] = useState(0);
	const [enhanced, setEnhanced] = useState(false);
	const controls = useRef<Array<HTMLButtonElement | null>>([]);
	const motionPreference = useMotionPreference();
	const sources = pictureSources(asset);
	const bodies = principleBodies(copy);
	const attachments = publicFactAttachments(edition);
	const geometry = APERTURE_GEOMETRY[activeIndex] ?? APERTURE_GEOMETRY[0];

	useEffect(() => setEnhanced(true), []);

	function select(index: number, moveFocus = false) {
		setActiveIndex(index);
		if (moveFocus) controls.current[index]?.focus();
	}

	function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			select(index);
			return;
		}
		const next = destination(index, event.key);
		if (next === undefined) return;
		event.preventDefault();
		select(next, true);
	}

	return (
		<section
			className="site-v1-company-aperture"
			data-company-aperture="true"
			data-active-principle={labels.aperture.principles[activeIndex]?.id}
			data-motion-preference={motionPreference}
			data-enhanced={enhanced ? "true" : undefined}
			aria-label={labels.aperture.ariaLabel}
		>
			<div
				className="site-v1-company-aperture__mask"
				data-company-aperture-mask="true"
				style={{
					clipPath: geometry.clipPath,
					"--company-focal": `${percentage(asset.focalPoint.x)} ${percentage(asset.focalPoint.y)}`,
					"--company-mobile-crop": asset.mobileCrop,
				} as CSSProperties}
			>
				<picture>
					<source type="image/avif" srcSet={sources.avif} sizes="100vw" />
					<source type="image/webp" srcSet={sources.webp} sizes="100vw" />
					<img src={asset.master.src} alt={imageAlt} width={asset.master.width} height={asset.master.height} fetchPriority="high" />
				</picture>
			</div>
			<div className="site-v1-company-aperture__wash" aria-hidden="true" />
			<div
				className="site-v1-company-aperture__light"
				data-company-aperture-light="true"
				style={{ left: geometry.lightLeft, width: geometry.lightWidth, transform: geometry.lightTransform }}
				aria-hidden="true"
			/>

			<header className="site-v1-company-aperture__hero">
				<p>{copy.hero.eyebrow}</p>
				<h1>{copy.hero.headline}</h1>
				<p>{copy.hero.body}</p>
			</header>

			<div className="site-v1-company-aperture__controls-wrap">
				<p>{labels.aperture.instruction}</p>
				<div className="site-v1-company-aperture__controls" data-company-principle-controls="true" role="group" aria-label={labels.aperture.ariaLabel}>
					{labels.aperture.principles.map((principle, index) => (
						<button
							key={principle.id}
							ref={(node) => { controls.current[index] = node; }}
							type="button"
							data-company-select-principle={index}
							aria-controls={`company-principle-${principle.id}`}
							aria-pressed={activeIndex === index}
							onClick={() => select(index)}
							onPointerUp={(event) => { if (event.pointerType !== "touch") select(index); }}
							onTouchEnd={() => select(index)}
							onKeyDown={(event) => onKeyDown(event, index)}
						>
							<span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
							{principle.label}
						</button>
					))}
				</div>
			</div>

			<div className="site-v1-company-aperture__principles" aria-live="polite">
				{labels.aperture.principles.map((principle, index) => {
					const attachment = attachments[principle.id];
					return (
						<article
							key={principle.id}
							id={`company-principle-${principle.id}`}
							className="site-v1-company-principle"
							data-company-principle={index}
							data-company-module={principle.id}
							hidden={enhanced && activeIndex !== index}
						>
							<header><h2>{principle.label}</h2></header>
							<div data-company-attached-evidence="true">
								<span>{labels.aperture.evidenceLabel}</span>
								<p data-company-principle-condition="true">{bodies[principle.id]}</p>
								<strong>{attachment.value}</strong>
								<code>{attachment.id}</code>
								<small>{attachment.source} · {attachment.scope} · {attachment.reviewed}</small>
							</div>
							<p data-company-attached-boundary="true"><span>{labels.aperture.boundaryLabel}</span>{attachment.boundary}</p>
						</article>
					);
				})}
			</div>
		</section>
	);
}
