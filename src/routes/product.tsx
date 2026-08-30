import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/experience/global/pages/product-page";
import { GLOBAL_EN_PRODUCT_PAGE } from "@/content/public-site/global-en/pages/product";
import { buildPageHead } from "@/editions/page-head";

export const Route = createFileRoute("/product")({
	head: () => buildPageHead("global-en", "product", undefined, GLOBAL_EN_PRODUCT_PAGE.metadata),
	component: ProductPage,
});
