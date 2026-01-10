import type { GoldNewsItem } from "@goldie/shared";
import { formatKRW, formatChange } from "@goldie/shared";
import type { ReportInput } from "./types";

function getTrendEmoji(change: number): string {
  if (change > 0) return "📈";
  if (change < 0) return "📉";
  return "➖";
}

function formatNewsSection(news: GoldNewsItem[]): string {
  if (news.length === 0) return "";

  const newsItems = news
    .map((item, index) => `${index + 1}. ${item.title}\n   ${item.summary}`)
    .join("\n\n");

  return `📰 오늘의 금 관련 뉴스\n${newsItems}`;
}

function getKoreanTime(): string {
  return new Date().toLocaleTimeString("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateTemplateReport(input: ReportInput): string {
  const { price, news } = input;
  const trend = getTrendEmoji(price.change);

  const sections: string[] = [
    // 헤더
    "🥇 금 시세 일일 리포트",

    // 날짜
    `📅 ${price.date}`,

    // 시세 정보
    [
      `💰 현재가: ${formatKRW(price.price)}`,
      `${trend} 전일대비: ${formatChange(price.change)} (${price.changeRate})`,
    ].join("\n"),
  ];

  // 뉴스 섹션 (있을 경우만)
  const newsSection = formatNewsSection(news);
  if (newsSection) {
    sections.push(newsSection);
  }

  // 발송 시각
  sections.push(`⏰ 발송 시각: ${getKoreanTime()}`);

  return sections.join("\n\n");
}
