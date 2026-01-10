import type { GoldPriceResponse, GoldNewsItem } from "@goldie/shared";

export interface ReportInput {
  price: GoldPriceResponse;
  news: GoldNewsItem[];
}

export interface ReportOutput {
  message: string;
  generatedBy: "llm" | "template";
  generatedAt: string;
}
