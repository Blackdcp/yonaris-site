import type { CSSProperties, ReactNode } from "react";
import { getSiteV1Asset } from "@/content/public-site/assets";
import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import { GLOBAL_EN_BUYER_QUESTION } from "@/content/public-site/global-en/buyer-question";
import { GLOBAL_EN_HUMAN_AGENT_PAGE } from "@/content/public-site/global-en/pages/human-agent";
import { GLOBAL_EN_PRODUCT_PAGE } from "@/content/public-site/global-en/pages/product";
import { getAgentPath, resolveNavigationTarget } from "@/site/route-selectors";
import type { NavigationTarget } from "@/site/route-types";
import { BuyerQuestionProvider } from "../../shared/buyer-question/buyer-question-provider";
import { ProductQuestionWorkspace } from "../../shared/product/product-question-workspace";
import { EnglishSiteShell } from "../english-site-shell";

const copy = GLOBAL_EN_PRODUCT_PAGE;
const record = GLOBAL_EN_BUYER_QUESTION;
const heroAsset = getSiteV1Asset("product-observation-room");
const categoryFact = PRODUCT_FACTS.category;

function ActionLink({ target, children, quiet = false }: { readonly target: NavigationTarget; readonly children: ReactNode; readonly quiet?: boolean }) {
	return <a className={quiet ? "site-v1-product-action site-v1-product-action--quiet" : "site-v1-product-action"} href={resolveNavigationTarget("global-en", target)}>{children}</a>;
}

function ProductPicture() {
	const avif = heroAsset.derivatives.map((item) => `${item.avif} ${item.width}w`).join(", ");
	const webp = heroAsset.derivatives.map((item) => `${item.webp} ${item.width}w`).join(", ");
	return (
		<picture
			className="site-v1-product-hero__picture"
			style={{ "--product-focal": `${heroAsset.focalPoint.x * 100}% ${heroAsset.focalPoint.y * 100}%`, "--product-mobile-crop": heroAsset.mobileCrop } as CSSProperties}
		>
			<source type="image/avif" srcSet={avif} sizes="100vw" />
			<source type="image/webp" srcSet={webp} sizes="100vw" />
			<img src={heroAsset.master.src} alt={heroAsset.alt} width={heroAsset.master.width} height={heroAsset.master.height} fetchPriority="high" />
		</picture>
	);
}

function FirstViewport() {
	return (
		<section className="site-v1-product-hero" data-product-first-viewport>
			<ProductPicture />
			<div className="site-v1-product-hero__wash" aria-hidden="true" />
			<header className="site-v1-product-hero__copy">
				<p>{copy.hero.eyebrow}</p>
				<h1>{copy.hero.headline}</h1>
				<p>{copy.hero.body}</p>
				<div className="site-v1-product-actions">
					<ActionLink target={copy.hero.actions[0].target}>{copy.hero.actions[0].label}</ActionLink>
					<ActionLink target={copy.hero.actions[1].target} quiet>{copy.hero.actions[1].label}</ActionLink>
				</div>
			</header>
			<p className="site-v1-product-hero__signal" aria-hidden="true">
				<span>{copy.systemWork.sequence[0]}</span>
				<i />
				<span>{copy.systemWork.sequence[3]}</span>
				<i />
				<span>{copy.systemWork.sequence[5]}</span>
			</p>
		</section>
	);
}

function ProductTheatre() {
	return (
		<section id="product-theatre" className="site-v1-product-theatre" data-fact-id={categoryFact.id}>
			<header>
				<span>{copy.hero.eyebrow} / working record</span>
				<h2>{copy.systemWork.headline}</h2>
				<p>{copy.teamOutput.items[0]}</p>
			</header>
			<ProductQuestionWorkspace
				copy={copy}
				labels={{
					workingRecord: "Working record",
					inspectRecord: "Inspect record",
					machineFields: {
						record: "Record",
						answers: "Answers",
						reasons: "Reasons",
						evidence: "Evidence",
						gaps: "Gaps",
						actions: "Actions",
						review: "Review",
					},
				}}
				evidenceLens={{
					copy: GLOBAL_EN_HUMAN_AGENT_PAGE,
					edition: "global-en",
					fact: categoryFact,
					ringLabels: [
						GLOBAL_EN_HUMAN_AGENT_PAGE.humanViewLabels[0],
						GLOBAL_EN_HUMAN_AGENT_PAGE.evidenceViewLabels[0],
						GLOBAL_EN_HUMAN_AGENT_PAGE.agentViewLabels[0],
					],
					agentHref: `${getAgentPath("global-en", "home")}#${categoryFact.id}`,
				}}
			/>
		</section>
	);
}

function Closing() {
	return (
		<section className="site-v1-product-closing" data-product-closing>
			<h2>{copy.closing.headline}</h2>
			<div className="site-v1-product-actions">
				<ActionLink target={copy.closing.actions[0].target}>{copy.closing.actions[0].label}</ActionLink>
				<ActionLink target={copy.closing.actions[1].target} quiet>{copy.closing.actions[1].label}</ActionLink>
			</div>
		</section>
	);
}

export function ProductPage() {
	return (
		<EnglishSiteShell pageKey="product">
			<BuyerQuestionProvider record={record}>
				<div className="site-v1-product">
					<FirstViewport />
					<ProductTheatre />
					<Closing />
				</div>
			</BuyerQuestionProvider>
		</EnglishSiteShell>
	);
}
