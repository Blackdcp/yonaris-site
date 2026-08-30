import { GLOBAL_EN_PRIVACY_PAGE } from "@/content/public-site/global-en/pages/privacy";
import { resolveNavigationTarget } from "@/site/route-selectors";
import { EnglishSiteShell } from "../english-site-shell";

const PRIVACY_SECTIONS = ["submitted", "delivered", "used", "retention"] as const;

export function PrivacyPage() {
	const copy = GLOBAL_EN_PRIVACY_PAGE;
	return (
		<EnglishSiteShell pageKey="privacy">
			<article className="site-v1-privacy" data-privacy-composition="editorial-document">
				<header className="site-v1-privacy__hero" data-privacy-first-viewport="true">
					<div className="site-v1-privacy__hero-copy">
						<p>Privacy</p>
						<h1>{copy.hero.headline}</h1>
						<p>{copy.hero.body}</p>
					</div>
					<ol className="site-v1-privacy__route" aria-label="Privacy information route">
						{PRIVACY_SECTIONS.map((key, index) => (
							<li key={key}>
								<span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
								<a href={`#privacy-${key}`}>{copy.sectionLabels[key]}</a>
							</li>
						))}
					</ol>
				</header>

				<div className="site-v1-privacy__document">
					<p className="site-v1-privacy__margin-note" aria-hidden="true">One short route / four boundaries</p>
					<div className="site-v1-privacy__sections">
						{PRIVACY_SECTIONS.map((key, index) => (
							<section
								id={`privacy-${key}`}
								key={key}
								className="site-v1-privacy__section"
								data-privacy-section={key}
							>
								<span className="site-v1-privacy__section-index" aria-hidden="true">
									{String(index + 1).padStart(2, "0")}
								</span>
								<div>
									<h2>{copy.sectionLabels[key]}</h2>
									<p>{copy[key]}</p>
								</div>
							</section>
						))}
						<footer className="site-v1-privacy__action">
							<p>Privacy requests follow the same reviewed contact route.</p>
							<a href={resolveNavigationTarget("global-en", copy.action.target)}>{copy.action.label}</a>
						</footer>
					</div>
				</div>
			</article>
		</EnglishSiteShell>
	);
}
