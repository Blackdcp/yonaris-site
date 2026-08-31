import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import { ZH_CN_HOME_PAGE } from "@/content/public-site/zh-cn/pages/home";
import { ZH_CN_HUMAN_AGENT_PAGE } from "@/content/public-site/zh-cn/pages/human-agent";
import { getAgentPath, getPublicPagePath } from "@/site/route-selectors";
import { EvidenceLens } from "../../shared/human-agent/evidence-lens";
import { ChineseSiteShell } from "../chinese-site-shell";

export function ChineseHumanAgentPage() {
	const copy = ZH_CN_HUMAN_AGENT_PAGE;
	const fact = PRODUCT_FACTS.category;
	const agentHref = `${getAgentPath("zh-cn", "home")}#${fact.id}`;
	return <ChineseSiteShell pageKey="human-agent"><div className="site-v1-human-agent">
		<section className="site-v1-human-agent__first-viewport" data-human-agent-first-viewport="true">
			<header className="site-v1-human-agent__hero"><p>{copy.hero.eyebrow}</p><h1>{copy.hero.headline}</h1><p>{copy.hero.body}</p><p className="site-v1-human-agent__record-rule">{copy.sharedRecordRule}</p></header>
			<EvidenceLens copy={copy} edition="zh-cn" fact={fact} ringLabels={ZH_CN_HOME_PAGE.humanAgent.layers} agentHref={agentHref} />
		</section>
		<section className="site-v1-human-agent__boundary"><div><span>{copy.evidenceViewLabels[4]}</span><p>{copy.boundary}</p></div><nav aria-label="继续查看"><a href={agentHref}>{copy.actions[0].label}</a><a href={getPublicPagePath("zh-cn", "contact")}>{copy.actions[1].label}</a></nav></section>
	</div></ChineseSiteShell>;
}
