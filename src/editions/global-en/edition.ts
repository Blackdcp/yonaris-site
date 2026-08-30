import { HUMAN_PAGE_TO_PUBLIC_PAGE, type HumanPageKey } from "@/content/experience/types";
import { buildPageHead } from "../page-head";
import { GLOBAL_EN_HOME_PAGE } from "@/content/public-site/global-en/pages/home";

/** @deprecated Legacy route adapter. Public pages use buildPageHead directly. */
export type GlobalEnglishPageKey = HumanPageKey;

export function globalEnglishPageHead(key: GlobalEnglishPageKey) {
	return buildPageHead("global-en", HUMAN_PAGE_TO_PUBLIC_PAGE[key], key, key === "home" ? GLOBAL_EN_HOME_PAGE.metadata : undefined);
}
