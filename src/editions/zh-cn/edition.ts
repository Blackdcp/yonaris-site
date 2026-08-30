import { HUMAN_PAGE_TO_PUBLIC_PAGE, type HumanPageKey } from "@/content/experience/types";
import { buildPageHead } from "../page-head";

/** @deprecated Legacy route adapter. Public pages use buildPageHead directly. */
export type ZhPageKey = HumanPageKey;

export function zhPageHead(key: ZhPageKey) {
	return buildPageHead("zh-cn", HUMAN_PAGE_TO_PUBLIC_PAGE[key], key);
}
