import type { CSSProperties, ReactNode } from "react";
import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import { getSiteV1Asset } from "@/content/public-site/assets";
import { GLOBAL_EN_BUYER_QUESTION } from "@/content/public-site/global-en/buyer-question";
import { GLOBAL_EN_HOME_PAGE } from "@/content/public-site/global-en/pages/home";
import { GLOBAL_EN_HUMAN_AGENT_PAGE } from "@/content/public-site/global-en/pages/human-agent";
import { resolveNavigationTarget, getAgentPath, getPublicPagePath } from "@/site/route-selectors";
import type { NavigationTarget } from "@/site/route-types";
import { BuyerQuestionProvider } from "../../shared/buyer-question/buyer-question-provider";
import { RepresentativeDisclosure } from "../../shared/buyer-question/representative-disclosure";
import { HomeAnswerField } from "../../shared/home/home-answer-field";
import { ProductRecordPreview } from "../../shared/home/product-record-preview";
import { EvidenceLens } from "../../shared/human-agent/evidence-lens";
import { EnglishSiteShell } from "../english-site-shell";

const copy = GLOBAL_EN_HOME_PAGE;
const record = GLOBAL_EN_BUYER_QUESTION;
const heroAsset = getSiteV1Asset("hero-evidence-field");
const caseworkStateLabels = [
	copy.casework.stateLabels.initialAnswer,
	copy.casework.stateLabels.evidenceGap,
	copy.casework.stateLabels.reviewedAction,
	copy.casework.stateLabels.changed,
	copy.casework.stateLabels.unchanged,
	copy.casework.stateLabels.cannotAttribute,
] as const;

function ActionLink({ target, children, quiet = false }: { readonly target: NavigationTarget; readonly children: ReactNode; readonly quiet?: boolean }) {
	return <a className={quiet ? "site-v1-home-action site-v1-home-action--quiet" : "site-v1-home-action"} href={resolveNavigationTarget("global-en", target)}>{children}</a>;
}

function HeroPicture() {
	const avif = heroAsset.derivatives.map((item) => `${item.avif} ${item.width}w`).join(", ");
	const webp = heroAsset.derivatives.map((item) => `${item.webp} ${item.width}w`).join(", ");
	return (
		<picture
			className="site-v1-home-hero__picture"
			style={{
				"--hero-focal": `${heroAsset.focalPoint.x * 100}% ${heroAsset.focalPoint.y * 100}%`,
				"--hero-mobile-crop": heroAsset.mobileCrop,
			} as CSSProperties}
			aria-hidden="true"
		>
			<source type="image/avif" srcSet={avif} sizes="100vw" />
			<source type="image/webp" srcSet={webp} sizes="100vw" />
			<img src={heroAsset.master.src} alt={heroAsset.alt} width={heroAsset.master.width} height={heroAsset.master.height} fetchPriority="high" />
		</picture>
	);
}

function HomeEvidenceLens() {
	const fact = PRODUCT_FACTS.category;
	return (
		<section className="site-v1-home-human-agent" data-home-section="human-agent" data-human-agent-bridge="home" data-fact-id={fact.id}>
			<header>
				<span>{copy.humanAgent.layers.join(" / ")}</span>
				<h2>{copy.humanAgent.headline}</h2>
				<p>{copy.humanAgent.body}</p>
			</header>
			<EvidenceLens
				copy={GLOBAL_EN_HUMAN_AGENT_PAGE}
				edition="global-en"
				fact={fact}
				ringLabels={copy.humanAgent.layers}
				agentHref={`${getAgentPath("global-en", "home")}#${fact.id}`}
				presentation="signature"
			/>
			<div className="site-v1-home-actions">
				<a className="site-v1-home-action" href={getPublicPagePath("global-en", "human-agent")}>{copy.humanAgent.actions[0].label}</a>
				<a className="site-v1-home-action site-v1-home-action--quiet" href={`${getAgentPath("global-en", "home")}#${fact.id}`}>{copy.humanAgent.actions[1].label}</a>
			</div>
		</section>
	);
}

function CaseworkPreview() {
	const content = [
		record.channelAnswers[0]?.answer,
		record.gaps[0]?.description,
		record.proposedActions[0]?.description,
		record.review.changed[0]?.statement,
		record.review.unchanged[0]?.statement,
		record.review.attribution.boundary,
	];
	return (
		<section
			className="site-v1-casework-preview"
			data-home-section="casework"
			data-record-id={record.id}
			data-representative-record="casework-preview"
		>
			<header><span>{copy.casework.stateLabels.initialAnswer}</span><h2>{copy.casework.headline}</h2><p>{record.question}</p></header>
			<div className="site-v1-casework-preview__trace">
				{caseworkStateLabels.map((label, index) => <article key={label} data-casework-state={index}><span>{String(index + 1).padStart(2, "0")}</span><h3>{label}</h3><p>{content[index]}</p></article>)}
			</div>
			<RepresentativeDisclosure>{copy.casework.disclosure}</RepresentativeDisclosure>
		</section>
	);
}

export function HomePage() {
	return (
		<EnglishSiteShell>
			<BuyerQuestionProvider record={record}>
				<div className="site-v1-home">
					<section className="site-v1-home-hero" data-home-section="hero-answer">
						<HeroPicture />
						<div className="site-v1-home-hero__wash" aria-hidden="true" />
						<header className="site-v1-home-hero__copy">
							<p>{copy.hero.eyebrow}</p>
							<h1>{copy.hero.headline}</h1>
							<p>{copy.hero.body}</p>
							<div className="site-v1-home-actions">
								<ActionLink target={copy.hero.actions[0].target}>{copy.hero.actions[0].label}</ActionLink>
								<ActionLink target={copy.hero.actions[1].target} quiet>{copy.hero.actions[1].label}</ActionLink>
							</div>
						</header>
						<div className="site-v1-home-hero__field">
							<HomeAnswerField copy={copy.heroEvent} disclosure={copy.casework.disclosure} motionLabels={copy.siteV1.motionControls} />
						</div>
					</section>
					<div id="product-preview" className="site-v1-home-product-anchor" tabIndex={-1}>
						<ProductRecordPreview
							copy={copy.productPreview}
							disclosure={copy.casework.disclosure}
							recordLabels={copy.siteV1.productRecord}
							stateLabels={copy.casework.stateLabels}
						/>
					</div>
					<HomeEvidenceLens />
					<CaseworkPreview />
					<section className="site-v1-home-closing" data-home-section="closing">
						<div><h2>{copy.closing.headline}</h2><p>{copy.closing.body}</p></div>
						<ActionLink target={copy.closing.action.target}>{copy.closing.action.label}</ActionLink>
					</section>
				</div>
			</BuyerQuestionProvider>
		</EnglishSiteShell>
	);
}
