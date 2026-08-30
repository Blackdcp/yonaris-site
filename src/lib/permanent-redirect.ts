export function permanentRedirectResponse(request: Request, destinationPath: `/${string}`): Response {
	const query = new URL(request.url).search;
	const [pathname, fragment] = destinationPath.split("#", 2);
	return new Response(null, {
		status: 308,
		headers: { Location: `${pathname}${query}${fragment ? `#${fragment}` : ""}` },
	});
}
