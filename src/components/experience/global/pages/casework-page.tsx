import { GLOBAL_EN_BUYER_QUESTION } from "@/content/public-site/global-en/buyer-question";
import { GLOBAL_EN_CASEWORK_PAGE } from "@/content/public-site/global-en/pages/casework";
import { resolveNavigationTarget } from "@/site/route-selectors";
import { BuyerQuestionProvider } from "../../shared/buyer-question/buyer-question-provider";
import { RepresentativeDisclosure } from "../../shared/buyer-question/representative-disclosure";
import { CaseworkWalkthrough } from "../../shared/casework/casework-walkthrough";
import { EnglishSiteShell } from "../english-site-shell";

const copy = GLOBAL_EN_CASEWORK_PAGE;
const record = GLOBAL_EN_BUYER_QUESTION;

function FirstViewport() {
	return (
		<section className="site-v1-casework-hero" data-casework-first-viewport data-record-id={record.id} data-representative-record="casework-hero">
			<div className="site-v1-casework-hero__field" aria-hidden="true"><i /><i /><i /><i /></div>
			<header className="site-v1-casework-hero__copy"><p>{copy.hero.eyebrow}</p><h1>{copy.hero.headline}</h1><p>{copy.hero.body}</p></header>
			<div className="site-v1-casework-hero__situation"><span>{copy.walkthrough[0].heading}</span><p>{copy.walkthrough[0].body}</p></div>
			<blockquote><span>{copy.timeline.questionLabel}</span><p>{record.question}</p><code>{record.id}</code></blockquote>
			<RepresentativeDisclosure>{copy.hero.disclosure}</RepresentativeDisclosure>
		</section>
	);
}

export function CaseworkPage() {
	return (
		<EnglishSiteShell pageKey="casework">
			<BuyerQuestionProvider record={record}>
				<div className="site-v1-casework">
					<FirstViewport />
					<CaseworkWalkthrough copy={copy} />
					<section className="site-v1-casework-closing" data-casework-closing>
						<div><h2>{copy.closing.headline}</h2><p>{copy.closing.body}</p></div>
						<a href={resolveNavigationTarget("global-en", copy.closing.action.target)}>{copy.closing.action.label}</a>
					</section>
				</div>
			</BuyerQuestionProvider>
		</EnglishSiteShell>
	);
}
