"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { BuyerQuestionRecord } from "@/content/public-site/contracts/buyer-question";

const BuyerQuestionContext = createContext<BuyerQuestionRecord | null>(null);

export function BuyerQuestionProvider({ record, children }: { readonly record: BuyerQuestionRecord; readonly children: ReactNode }) {
	return <BuyerQuestionContext.Provider value={record}>{children}</BuyerQuestionContext.Provider>;
}

export function useBuyerQuestionRecord(): BuyerQuestionRecord {
	const record = useContext(BuyerQuestionContext);
	if (!record) throw new Error("Buyer-question components must be rendered inside BuyerQuestionProvider");
	return record;
}
