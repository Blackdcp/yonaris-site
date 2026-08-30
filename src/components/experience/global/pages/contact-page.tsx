import { GLOBAL_EN_CONTACT_FORM_UI, GLOBAL_EN_CONTACT_PAGE } from "@/content/public-site/global-en/pages/contact";
import type { ContactFormResult, ContactRequestType } from "@/lib/contact-schema";
import { LowFrictionLeadForm } from "../../shared/contact/low-friction-lead-form";
import { EnglishSiteShell } from "../english-site-shell";

export interface ContactPageProps {
	readonly requestType?: ContactRequestType;
	readonly initialResult?: ContactFormResult;
	readonly initialSubmissionId?: string;
}

export function ContactPage({ requestType = "conversation", initialResult, initialSubmissionId }: ContactPageProps = {}) {
	const copy = GLOBAL_EN_CONTACT_PAGE;
	return (
		<EnglishSiteShell pageKey="contact">
			<div className="site-v1-contact-page">
				<section className="site-v1-contact-page__first-viewport" data-contact-first-viewport="true">
					<header className="site-v1-contact-page__hero">
						<p>Talk to Yonaris</p>
						<h1>{copy.hero.headline}</h1>
						<p>{copy.hero.body}</p>
					</header>
					<LowFrictionLeadForm
						copy={copy}
						uiCopy={GLOBAL_EN_CONTACT_FORM_UI}
						locale="en"
						privacyHref="/privacy"
						requestType={requestType}
						initialResult={initialResult}
						initialSubmissionId={initialSubmissionId}
					/>
				</section>
				<aside className="site-v1-contact-page__boundary" data-contact-boundary="true">
					<p>{copy.boundary}</p>
				</aside>
			</div>
		</EnglishSiteShell>
	);
}
