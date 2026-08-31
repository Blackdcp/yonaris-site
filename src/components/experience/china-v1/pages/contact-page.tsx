import { ZH_CN_CONTACT_FORM_UI, ZH_CN_CONTACT_PAGE } from "@/content/public-site/zh-cn/pages/contact";
import type { ContactFormResult, ContactRequestType } from "@/lib/contact-schema";
import { getPublicPagePath } from "@/site/route-selectors";
import { LowFrictionLeadForm } from "../../shared/contact/low-friction-lead-form";
import { ChineseSiteShell } from "../chinese-site-shell";

export interface ChineseContactPageProps { readonly requestType?: ContactRequestType; readonly initialResult?: ContactFormResult; readonly initialSubmissionId?: string }

export function ChineseContactPage({ requestType = "conversation", initialResult, initialSubmissionId }: ChineseContactPageProps = {}) {
	const copy = ZH_CN_CONTACT_PAGE;
	return <ChineseSiteShell pageKey="contact"><div className="site-v1-contact-page">
		<section className="site-v1-contact-page__first-viewport" data-contact-first-viewport="true">
			<header className="site-v1-contact-page__hero"><p>先聊聊</p><h1>{copy.hero.headline}</h1><p>{copy.hero.body}</p></header>
			<LowFrictionLeadForm copy={copy} uiCopy={ZH_CN_CONTACT_FORM_UI} locale="zh-CN" privacyHref={getPublicPagePath("zh-cn", "privacy")} requestType={requestType} initialResult={initialResult} initialSubmissionId={initialSubmissionId} />
		</section>
		<aside className="site-v1-contact-page__boundary"><p>{copy.boundary}</p></aside>
	</div></ChineseSiteShell>;
}
