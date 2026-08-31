import type { CSSProperties, ReactNode } from "react";
import { getSiteV1Asset } from "@/content/public-site/assets";
import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import { ZH_CN_BUYER_QUESTION } from "@/content/public-site/zh-cn/buyer-question";
import { ZH_CN_HUMAN_AGENT_PAGE } from "@/content/public-site/zh-cn/pages/human-agent";
import { ZH_CN_PRODUCT_PAGE } from "@/content/public-site/zh-cn/pages/product";
import { getAgentPath, resolveNavigationTarget } from "@/site/route-selectors";
import type { NavigationTarget } from "@/site/route-types";
import { BuyerQuestionProvider } from "../../shared/buyer-question/buyer-question-provider";
import { ProductQuestionWorkspace } from "../../shared/product/product-question-workspace";
import { ChineseSiteShell } from "../chinese-site-shell";

const copy = ZH_CN_PRODUCT_PAGE;
const record = ZH_CN_BUYER_QUESTION;
const heroAsset = getSiteV1Asset("product-observation-room");
const categoryFact = PRODUCT_FACTS.category;

function ActionLink({ target, children, quiet = false }: { readonly target: NavigationTarget; readonly children: ReactNode; readonly quiet?: boolean }) {
	return <a className={quiet ? "site-v1-product-action site-v1-product-action--quiet" : "site-v1-product-action"} href={resolveNavigationTarget("zh-cn", target)}>{children}</a>;
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
			<img src={heroAsset.master.src} alt="深色观察空间中的光线与数据轨迹" width={heroAsset.master.width} height={heroAsset.master.height} fetchPriority="high" />
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
				<span>{copy.systemWork.sequence[0]}</span><i />
				<span>{copy.systemWork.sequence[3]}</span><i />
				<span>{copy.systemWork.sequence[5]}</span>
			</p>
		</section>
	);
}

function ProductTheatre() {
	return (
		<section id="product-theatre" className="site-v1-product-theatre" data-fact-id={categoryFact.id}>
			<header>
				<span>产品 · 同一条工作记录</span>
				<h2>{copy.systemWork.headline}</h2>
				<p>{copy.teamOutput.items[0]}</p>
			</header>
			<ProductQuestionWorkspace
				copy={copy}
				labels={{
					workingRecord: "同一条工作记录",
					inspectRecord: "查看结构化记录",
					machineFields: {
						record: "记录标识",
						answers: "渠道答案",
						reasons: "比较理由",
						evidence: "证据与来源",
						gaps: "证据缺口",
						actions: "审阅行动",
						review: "后续复核",
					},
				}}
				evidenceLens={{
					copy: ZH_CN_HUMAN_AGENT_PAGE,
					edition: "zh-cn",
					fact: categoryFact,
					ringLabels: [
						ZH_CN_HUMAN_AGENT_PAGE.humanViewLabels[0],
						ZH_CN_HUMAN_AGENT_PAGE.evidenceViewLabels[0],
						ZH_CN_HUMAN_AGENT_PAGE.agentViewLabels[0],
					],
					agentHref: `${getAgentPath("zh-cn", "home")}#${categoryFact.id}`,
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

export function ChinaProductPage() {
	return (
		<ChineseSiteShell pageKey="product">
			<BuyerQuestionProvider record={record}>
				<div className="site-v1-product site-v1-product--zh">
					<FirstViewport />
					<ProductTheatre />
					<Closing />
				</div>
			</BuyerQuestionProvider>
		</ChineseSiteShell>
	);
}
