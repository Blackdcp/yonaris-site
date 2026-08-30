import type { AnchorHTMLAttributes, ReactNode } from "react";
import { getLocaleSwitchPath } from "@/site/route-selectors";
import type { PublicPageKey, SiteEdition } from "@/site/route-types";

export interface EditionLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "hrefLang" | "lang"> {
	readonly edition: SiteEdition;
	readonly pageKey: PublicPageKey;
	readonly children: ReactNode;
}

export function EditionLink({ edition, pageKey, children, ...props }: EditionLinkProps) {
	const targetEdition = edition === "global-en" ? "zh-cn" : "global-en";
	const targetLanguage = targetEdition === "zh-cn" ? "zh-CN" : "en";
	return (
		<a href={getLocaleSwitchPath(edition, pageKey)} hrefLang={targetLanguage} lang={targetLanguage} {...props}>
			{children}
		</a>
	);
}
