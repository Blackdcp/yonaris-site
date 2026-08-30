import type { CSSProperties, ReactNode } from "react";
import { getSiteV1Asset } from "@/content/public-site/assets";
import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import { GLOBAL_EN_BUYER_QUESTION } from "@/content/public-site/global-en/buyer-question";
import { GLOBAL_EN_PRODUCT_PAGE } from "@/content/public-site/global-en/pages/product";
import { resolveNavigationTarget } from "@/site/route-selectors";
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
			<div className="site-v1-product-hero__primer" aria-label={copy.hero.headline}>
				<article><span>01</span><h2>{copy.input.headline}</h2><p>{record.question}</p></article>
				<article><span>02</span><h2>{copy.systemWork.sequence[0]}</h2><p>{copy.systemWork.sequence[3]}</p></article>
				<article><span>03</span><h2>{copy.teamOutput.headline}</h2><p>{copy.teamOutput.items[2]}</p></article>
				<article><span>04</span><h2>{copy.systemWork.sequence[5]}</h2><p>{record.review.unchanged[0]?.statement}</p></article>
			</div>
		</section>
	);
}

function HowItWorks() {
	return (
		<section id="how-it-works" className="site-v1-product-method" data-record-id={record.id}>
			<header><span>{copy.input.labels[1]}</span><h2>{copy.systemWork.headline}</h2><p>{record.question}</p></header>
			<ol>{copy.systemWork.sequence.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol>
			<div className="site-v1-product-method__inputs">
				{copy.input.labels.map((label, index) => <span key={label}>{String(index + 1).padStart(2, "0")} · {label}</span>)}
			</div>
		</section>
	);
}

function MarketsLanguages() {
	const alternatives = [...new Set(record.comparisonReasons.map((reason) => reason.subject))];
	return (
		<section id="markets-languages" className="site-v1-product-markets" data-record-id={record.id}>
			<header><span>{record.id}</span><h2>{copy.markets.headline}</h2><p>{copy.markets.body}</p></header>
			<dl>
				<div><dt>{copy.input.labels[0]}</dt><dd>{record.market}<br />{record.audience}</dd></div>
				<div><dt>{copy.input.labels[4]}</dt><dd>{record.language}</dd></div>
				<div><dt>{copy.input.labels[2]}</dt><dd>{categoryFact.value["global-en"]}<br />{categoryFact.scope["global-en"]}</dd></div>
				<div><dt>{copy.input.labels[5]}</dt><dd>{alternatives.join(" · ")}</dd></div>
				<div><dt>{copy.input.labels[3]}</dt><dd>{record.observationConditions.channels.join(" · ")}<br />{record.evidence.slice(0, 3).map((item) => item.sourceLabel).join(" · ")}</dd></div>
			</dl>
			<p>{record.observationConditions.boundary}</p>
		</section>
	);
}

function HumanAgentBridge() {
	return (
		<section className="site-v1-product-human-agent" data-product-human-agent data-fact-id={categoryFact.id}>
			<div><span>{categoryFact.id}</span><h2>{copy.humanAgent.headline}</h2><p>{copy.humanAgent.body}</p></div>
			<article>
				<strong>{categoryFact.value["global-en"]}</strong>
				<p>{categoryFact.source.label["global-en"]}</p>
				<code>{categoryFact.id} · {categoryFact.lastReviewed}</code>
				<small>{categoryFact.boundary["global-en"]}</small>
			</article>
			<ActionLink target={copy.humanAgent.action.target}>{copy.humanAgent.action.label}</ActionLink>
		</section>
	);
}

export function ProductPage() {
	return (
		<EnglishSiteShell pageKey="product">
			<BuyerQuestionProvider record={record}>
				<div className="site-v1-product">
					<FirstViewport />
					<HowItWorks />
					<section id="product-theatre" className="site-v1-product-theatre">
						<header><span>{record.id}</span><h2>{copy.teamOutput.headline}</h2><p>{copy.teamOutput.items.join(" · ")}</p></header>
						<ProductQuestionWorkspace copy={copy} />
					</section>
					<MarketsLanguages />
					<HumanAgentBridge />
					<section className="site-v1-product-closing" data-product-closing>
						<h2>{copy.closing.headline}</h2>
						<div className="site-v1-product-actions">
							<ActionLink target={copy.closing.actions[0].target}>{copy.closing.actions[0].label}</ActionLink>
							<ActionLink target={copy.closing.actions[1].target} quiet>{copy.closing.actions[1].label}</ActionLink>
						</div>
					</section>
				</div>
			</BuyerQuestionProvider>
		</EnglishSiteShell>
	);
}
