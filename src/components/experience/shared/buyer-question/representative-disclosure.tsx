import { useBuyerQuestionRecord } from "./buyer-question-provider";

export function RepresentativeDisclosure({ children }: { readonly children: string }) {
	const record = useBuyerQuestionRecord();
	return (
		<aside
			className="site-v1-representative-disclosure"
			data-disclosure-source={record.disclosure.sourceId}
			aria-label={record.disclosure.sourceLabel}
		>
			<p>{children}</p>
		</aside>
	);
}
