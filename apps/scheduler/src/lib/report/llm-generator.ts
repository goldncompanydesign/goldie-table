import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { formatKRW, formatChange } from "@goldie/shared";
import type { ReportInput } from "./types";
import { generateTemplateReport } from "./template-generator";

// LLM은 현재 사용하지 않음 - 템플릿 사용
export async function generateLLMReport(input: ReportInput): Promise<string> {
  // 고정 포맷 사용으로 템플릿 생성기로 대체
  return generateTemplateReport(input);
}
