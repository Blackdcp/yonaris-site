import { renderToStaticMarkup } from "react-dom/server";
import type { ReactNode } from "react";
import type { ContactFormResult } from "@/lib/contact-schema";
import type { ContactNativeRenderContext, ContactServerUiCopy } from "@/lib/contact-delivery.server";
import { GLOBAL_EN_CONTACT_FORM_UI, GLOBAL_EN_CONTACT_PAGE } from "@/content/public-site/global-en/pages/contact";
import { ZH_CN_CONTACT_FORM_UI, ZH_CN_CONTACT_PAGE } from "@/content/public-site/zh-cn/pages/contact";
import { ChineseContactPage } from "../../china-v1/pages/contact-page";
import { ContactPage } from "./contact-page";

const nativeStyles = `
:root{color-scheme:dark;font-family:system-ui,sans-serif;background:#07131f;color:#f4efe5}
*{box-sizing:border-box}body{margin:0}.site-v1-skip-link{position:fixed;top:.75rem;left:.75rem;z-index:100;padding:.7rem 1rem;background:#f4efe5;color:#07131f;transform:translateY(-150%)}.site-v1-skip-link:focus,.site-v1-skip-link:focus-visible{transform:translateY(0)}.site-v1-header,.site-v1-footer{padding:1rem 4vw;border-block:1px solid #a9bac838}.site-v1-header__inner,.site-v1-footer__inner,.site-v1-header__primary,.site-v1-header__utilities,.site-v1-footer__navigation{display:flex;flex-wrap:wrap;align-items:center;gap:1rem}.site-v1-header__inner{justify-content:space-between}.site-v1-header__mobile-panel{display:none}.site-v1-header a,.site-v1-footer a{color:inherit}.site-v1-contact-page{min-height:70vh}.site-v1-contact-page__first-viewport{display:grid;grid-template-columns:minmax(0,.85fr) minmax(20rem,1.15fr);gap:clamp(2rem,7vw,7rem);padding:clamp(2rem,8vw,7rem) 4vw;max-width:90rem;margin:auto}.site-v1-contact-page__hero h1{font-size:clamp(2.8rem,7vw,6.5rem);line-height:.96}.site-v1-contact-aperture{padding:clamp(1rem,3vw,2rem);border:1px solid #a9bac85c;background:#0b1b2a}.site-v1-contact-form fieldset{border:0;padding:0}.site-v1-contact-field{display:grid;gap:.35rem;margin:1rem 0}.site-v1-contact-field input,.site-v1-contact-field textarea{width:100%;padding:.8rem;border:1px solid #a9bac875;background:#07131f;color:#f4efe5;font:inherit}.site-v1-contact-form__focus-fields{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.site-v1-contact-form__honeypot{position:absolute;left:-10000px}.site-v1-contact-form__submit{padding:.8rem 1.2rem;border:0;background:#e86428;color:#fff;font:inherit}.site-v1-contact-field__error,.site-v1-contact-form__message{color:#ffb49a}.site-v1-contact-page__boundary{padding:2rem 4vw;border-top:1px solid #a9bac838}.site-v1-footer__inner{justify-content:space-between}.site-v1-footer__reading-control{display:none}@media(max-width:700px){.site-v1-contact-page__first-viewport{grid-template-columns:1fr;padding:2rem 1rem}.site-v1-contact-form__focus-fields{grid-template-columns:1fr}.site-v1-contact-form__high-intent summary{display:flex;align-items:center;min-height:44px}.site-v1-header__primary,.site-v1-header__utilities{display:none}.site-v1-footer{padding:1rem}.site-v1-footer__inner{display:grid}.site-v1-contact-page__hero h1{font-size:3rem}}
`;

export interface ContactNativeDocumentEdition {
	readonly htmlLang: string;
	readonly title: string;
	readonly canonicalUrl: string;
	readonly renderPage: (input: {
		readonly result: ContactFormResult;
		readonly submissionId: string;
		readonly context: ContactNativeRenderContext;
	}) => ReactNode;
}

export function createContactNativeDocumentRenderer(
	resolveEdition: (context: ContactNativeRenderContext) => ContactNativeDocumentEdition,
): (result: ContactFormResult, submissionId: string, context: ContactNativeRenderContext) => string {
	return (result, submissionId, context) => {
		const edition = resolveEdition(context);
		const markup = renderToStaticMarkup(edition.renderPage({ result, submissionId, context }));
		return `<!doctype html><html lang="${edition.htmlLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${edition.title}</title><link rel="canonical" href="${edition.canonicalUrl}"><style>${nativeStyles}</style></head><body>${markup}</body></html>`;
	};
}

export function resolveContactServerUiCopy(context: ContactNativeRenderContext): ContactServerUiCopy {
	return context.locale === "zh-CN" ? ZH_CN_CONTACT_FORM_UI : GLOBAL_EN_CONTACT_FORM_UI;
}

export function resolveContactNativeDocumentEdition(context: ContactNativeRenderContext): ContactNativeDocumentEdition {
	if (context.locale === "zh-CN") {
		return {
			htmlLang: "zh-CN",
			title: ZH_CN_CONTACT_PAGE.metadata.title,
			canonicalUrl: "https://yonaris.com/zh/contact",
			renderPage: ({ result, submissionId, context: renderContext }) => (
				<ChineseContactPage
					requestType={renderContext.requestType}
					initialResult={result}
					initialSubmissionId={submissionId}
				/>
			),
		};
	}
	return {
		htmlLang: "en",
		title: GLOBAL_EN_CONTACT_PAGE.metadata.title,
		canonicalUrl: "https://yonaris.com/contact",
		renderPage: ({ result, submissionId, context: renderContext }) => (
			<ContactPage
				requestType={renderContext.requestType}
				initialResult={result}
				initialSubmissionId={submissionId}
			/>
		),
	};
}

export const renderContactNativeDocument = createContactNativeDocumentRenderer(resolveContactNativeDocumentEdition);
