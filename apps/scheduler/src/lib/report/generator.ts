import { isLLMEnabled } from "../config/env";
import { generateLLMReport } from "./llm-generator";
import { generateTemplateReport } from "./template-generator";
import type { ReportInput, ReportOutput } from "./types";

export type { ReportInput, ReportOutput } from "./types";

export async function generateReport(input: ReportInput): Promise<ReportOutput> {
  const generatedAt = new Date().toISOString();

  // LLM 사용 설정이 되어있으면 LLM으로 시도
  if (isLLMEnabled()) {
    try {
      const message = await generateLLMReport(input);
      return { message, generatedBy: "llm", generatedAt };
    } catch (error) {
      console.warn("LLM 리포트 생성 실패, 템플릿으로 폴백:", error);
      // LLM 실패시 템플릿으로 폴백
    }
  }

  // 템플릿 기반 생성 (기본값)
  const message = generateTemplateReport(input);
  return { message, generatedBy: "template", generatedAt };
}
