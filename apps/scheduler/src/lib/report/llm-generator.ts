import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { formatKRW, formatChange } from "@goldie/shared";
import type { ReportInput } from "./types";

const SYSTEM_PROMPT = `당신은 금 시세 리포트를 작성하는 금융 전문가입니다.
주어진 금 시세와 뉴스 정보를 바탕으로 간결하고 유익한 일일 리포트를 작성하세요.

작성 지침:
- 이모지를 적절히 활용하여 가독성을 높이세요 (🥇 💰 📈 📉 📰 등)
- 시세 변동의 의미를 간단히 설명하세요
- 뉴스는 핵심만 요약하세요
- 전체 길이는 500자 이내로 유지하세요
- 투자 권유나 확정적 표현은 피하세요
- 한국어로 작성하세요
- 마지막에 발송 시각은 포함하지 마세요 (시스템이 자동 추가)`;

function buildUserPrompt(input: ReportInput): string {
  const { price, news } = input;

  const newsText =
    news.length > 0
      ? news.map((n, i) => `${i + 1}. ${n.title}: ${n.summary}`).join("\n")
      : "오늘은 특별한 금 관련 뉴스가 없습니다.";

  return `오늘의 금 시세 정보:
- 날짜: ${price.date}
- 현재가: ${formatKRW(price.price)}
- 전일대비: ${formatChange(price.change)} (${price.changeRate})

오늘의 금 관련 뉴스:
${newsText}

위 정보를 바탕으로 금 시세 일일 리포트를 작성해주세요.`;
}

function getKoreanTime(): string {
  return new Date().toLocaleTimeString("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function generateLLMReport(input: ReportInput): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: SYSTEM_PROMPT,
    prompt: buildUserPrompt(input),
    maxTokens: 800,
    temperature: 0.7,
  });

  // 발송 시각 추가
  return `${text.trim()}\n\n⏰ 발송 시각: ${getKoreanTime()}`;
}
