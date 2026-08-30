import { PRODUCT_FACTS } from "@/content/public-site/canonical/product-facts";
import { getAgentPath, getPublicPagePath, resolveNavigationTarget } from "@/site/route-selectors";
import type { NavigationTarget, PublicPageKey, SiteEdition } from "@/site/route-types";
import type { SiteShellCopy } from "./site-shell";

const footerTargets = [
	{ kind: "page", page: "human-agent" },
	{ kind: "machine", route: "agent-index" },
	{ kind: "page", page: "product", hash: "markets-languages" },
	{ kind: "page", page: "privacy" },
	{ kind: "page", page: "contact" },
] as const satisfies readonly NavigationTarget[];

function labelFor(copy: SiteShellCopy, target: NavigationTarget): string {
	if (target.kind === "machine") return copy.labels["agent-index"];
	if (target.hash === "markets-languages") return copy.labels["markets-languages"];
	return copy.labels[target.page];
}

export function SiteFooter({ edition, pageKey, copy }: { edition: SiteEdition; pageKey: PublicPageKey; copy: SiteShellCopy }) {
	return (
		<footer className="site-v1-footer">
			<div className="site-v1-footer__inner">
				<div className="site-v1-footer__identity">
					<a href={getPublicPagePath(edition, "home")} aria-label={copy.brandLabel}>
						Yonaris
					</a>
					<p>{PRODUCT_FACTS.category.value[edition]}</p>
				</div>
				<a
					className="site-v1-footer__reading-control"
					data-site-v1-reading-control="human-agent"
					href={getPublicPagePath(edition, "human-agent")}
					aria-current={pageKey === "human-agent" ? "page" : undefined}
				>
					<span>{copy.labels["human-agent"]}</span>
					<small>{copy.readingControlDescription}</small>
				</a>
				<nav className="site-v1-footer__navigation" aria-label={copy.footerNavigationLabel}>
					{footerTargets.slice(1).map((target) => {
						const hash = target.kind === "page" && "hash" in target ? target.hash : undefined;
						const key = target.kind === "machine" ? target.route : `${target.page}:${hash ?? ""}`;
						const href = target.kind === "machine" ? getAgentPath(edition, "home") : resolveNavigationTarget(edition, target);
						return (
							<a key={key} href={href} aria-current={target.kind === "page" && !hash && target.page === pageKey ? "page" : undefined}>
								{labelFor(copy, target)}
							</a>
						);
					})}
				</nav>
				<small className="site-v1-footer__copyright">© {new Date().getFullYear()} Yonaris</small>
			</div>
		</footer>
	);
}
