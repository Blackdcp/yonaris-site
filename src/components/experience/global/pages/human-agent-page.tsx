import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import { GLOBAL_EN_HOME_PAGE } from "@/content/public-site/global-en/pages/home";
import { GLOBAL_EN_HUMAN_AGENT_PAGE } from "@/content/public-site/global-en/pages/human-agent";
import { getAgentPath, getPublicPagePath } from "@/site/route-selectors";
import { EvidenceLens } from "../../shared/human-agent/evidence-lens";
import { EnglishSiteShell } from "../english-site-shell";

const copy = GLOBAL_EN_HUMAN_AGENT_PAGE;
const fact = PRODUCT_FACTS.category;
const agentHref = `${getAgentPath("global-en", "home")}#${fact.id}`;

export function HumanAgentPage() {
	return (
		<EnglishSiteShell pageKey="human-agent">
			<div className="site-v1-human-agent">
				<section className="site-v1-human-agent__first-viewport" data-human-agent-first-viewport="true">
					<header className="site-v1-human-agent__hero">
						<p>{copy.hero.eyebrow}</p>
						<h1>{copy.hero.headline}</h1>
						<p>{copy.hero.body}</p>
						<p className="site-v1-human-agent__record-rule">{copy.sharedRecordRule}</p>
					</header>
					<EvidenceLens
						copy={copy}
						edition="global-en"
						fact={fact}
						ringLabels={GLOBAL_EN_HOME_PAGE.humanAgent.layers}
						agentHref={agentHref}
					/>
				</section>
				<section className="site-v1-human-agent__boundary">
					<div><span>{copy.evidenceViewLabels[4]}</span><p>{copy.boundary}</p></div>
					<nav data-human-agent-actions="true" aria-label={copy.hero.eyebrow}>
						<a href={agentHref}>{copy.actions[0].label}</a>
						<a href={getPublicPagePath("global-en", "contact")}>{copy.actions[1].label}</a>
					</nav>
				</section>
			</div>
		</EnglishSiteShell>
	);
}
