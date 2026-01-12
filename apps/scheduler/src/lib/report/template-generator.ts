import { formatKRW, formatChange } from "@goldie/shared";
import type { ReportInput } from "./types";

function getKoreanDateWithDay(): string {
  const now = new Date();
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const month = now.toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul", month: "numeric" }).replace("월", "");
  const day = now.toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul", day: "numeric" }).replace("일", "");
  const dayOfWeek = days[now.getDay()];
  return `${month}월 ${day}일 ${dayOfWeek}요일`;
}

function formatNumber(n: number): string {
  return new Intl.NumberFormat("ko-KR").format(n);
}

export function generateTemplateReport(input: ReportInput): string {
  const { buyPrice, sellPrice } = input.price;

  // buyPrice는 이미 부가세 포함 가격 → 부가세 제외 가격 계산
  const goldWithVat = buyPrice.goldTaelPrice;
  const goldWithoutVat = Math.round(buyPrice.goldTaelPrice / 1.1);

  const sections: string[] = [
    // 헤더
    `[${getKoreanDateWithDay()}] 실시간 시세 입니다.`,

    // 부가세 금 시세 (살 때 - 부가세 제외/포함)
    [
      "[부가세 금 시세]",
      `*${formatNumber(goldWithoutVat)}원 (부가세 포함 가격 : ${formatNumber(goldWithVat)})`,
    ].join("\n"),

    // 참고시세 (판매/매입)
    [
      "[참고시세]",
      `*판매 ${formatNumber(buyPrice.goldTaelPrice)}`,
      `*매입 ${formatNumber(sellPrice.goldTaelPrice)}`,
    ].join("\n"),

    // 은 시세
    `은99% 매입 ${formatNumber(sellPrice.silverTaelPrice)}`,

    // 연락처
    [
      "[연락처]",
      "*부가금 구매 : 010-7128-1578",
      "*고금 : 010-7128-1578",
    ].join("\n"),

    // 앱 다운로드
    [
      "",
      "📱 골디 파트너 앱 다운로드",
      "",
      "*안드로이드(삼성):",
      "https://bit.ly/4oKxpxj",
      "",
      "*아이폰:",
      "https://bit.ly/3Lm5TYI",
    ].join("\n"),

    // 매뉴얼
    [
      "",
      "📘 이용 매뉴얼",
      "https://bit.ly/4399FuA",
    ].join("\n"),
  ];

  return sections.join("\n\n");
}
