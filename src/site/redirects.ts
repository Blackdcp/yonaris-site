type PublicRedirect = {
	readonly from: `/${string}`;
	readonly to: `/${string}`;
	readonly statusCode: 308;
	readonly resolve: (query: string) => string;
};

export function appendQueryBeforeFragment(destination: `/${string}`, query: string): string {
	const [path, fragment] = destination.split("#", 2);
	return `${path}${query}${fragment ? `#${fragment}` : ""}`;
}

function redirect(from: `/${string}`, to: `/${string}`): PublicRedirect {
	return { from, to, statusCode: 308, resolve: (query) => appendQueryBeforeFragment(to, query) };
}

export const PUBLIC_REDIRECTS = [
	redirect("/platform", "/product"),
	redirect("/approach", "/product#how-it-works"),
	redirect("/results", "/casework"),
	redirect("/geo", "/product#markets-languages"),
	redirect("/diagnostic", "/contact"),
	redirect("/features", "/product"),
	redirect("/methodology", "/product#how-it-works"),
	redirect("/vision", "/company"),
	redirect("/pricing", "/contact"),
	redirect("/off-site-aeo", "/product#markets-languages"),
	redirect("/zh/platform", "/zh/product"),
	redirect("/zh/approach", "/zh/product#how-it-works"),
	redirect("/zh/results", "/zh/casework"),
	redirect("/zh/geo", "/zh/product#markets-languages"),
	redirect("/zh/diagnostic", "/zh/contact"),
	redirect("/zh/features", "/zh/product"),
	redirect("/zh/methodology", "/zh/product#how-it-works"),
	redirect("/zh/vision", "/zh/company"),
	redirect("/zh/pricing", "/zh/contact"),
	redirect("/zh/off-site-aeo", "/zh/product#markets-languages"),
	redirect("/agent/platform", "/agent/product"),
	redirect("/agent/approach", "/agent/product#how-it-works"),
	redirect("/agent/results", "/agent/casework"),
	redirect("/agent/geo", "/agent/product#markets-languages"),
	redirect("/agent/diagnostic", "/agent/contact"),
	redirect("/zh/agent/platform", "/zh/agent/product"),
	redirect("/zh/agent/approach", "/zh/agent/product#how-it-works"),
	redirect("/zh/agent/results", "/zh/agent/casework"),
	redirect("/zh/agent/geo", "/zh/agent/product#markets-languages"),
	redirect("/zh/agent/diagnostic", "/zh/agent/contact"),
	redirect("/llms.mdx/agent/approach", "/llms.mdx/agent/product#how-it-works"),
	redirect("/llms.mdx/agent/results", "/llms.mdx/agent/casework"),
	redirect("/llms.mdx/agent/geo", "/llms.mdx/agent/product#markets-languages"),
	redirect("/llms.mdx/agent/diagnostic", "/llms.mdx/agent/contact"),
	redirect("/llms.mdx/zh-agent/approach", "/llms.mdx/zh-agent/product#how-it-works"),
	redirect("/llms.mdx/zh-agent/results", "/llms.mdx/zh-agent/casework"),
	redirect("/llms.mdx/zh-agent/geo", "/llms.mdx/zh-agent/product#markets-languages"),
	redirect("/llms.mdx/zh-agent/diagnostic", "/llms.mdx/zh-agent/contact"),
] as const satisfies readonly PublicRedirect[];
