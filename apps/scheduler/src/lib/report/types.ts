import type { GoldPriceReport } from "@goldie/shared";

export interface ReportInput {
  price: GoldPriceReport;
}

export interface ReportOutput {
  message: string;
  generatedBy: "llm" | "template";
  generatedAt: string;
}
