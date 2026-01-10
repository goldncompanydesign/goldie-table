import { NextRequest, NextResponse } from "next/server";
import type { GoldNewsItem } from "@goldie/shared";

const MOCK_NEWS: GoldNewsItem[] = [
  {
    title: "미 연준 금리 동결, 금값 상승세",
    summary: "연준의 금리 동결 결정으로 안전자산 선호 심리가 강화되며 금값이 상승했습니다.",
  },
  {
    title: "달러 약세 지속, 금 수요 증가",
    summary: "달러 인덱스가 하락하면서 상대적으로 금의 매력이 높아지고 있습니다.",
  },
  {
    title: "중동 지정학적 리스크 확대",
    summary: "중동 지역 긴장 고조로 안전자산인 금에 대한 투자 수요가 늘어나고 있습니다.",
  },
  {
    title: "중국 금 수입량 증가",
    summary: "중국의 금 수입량이 전월 대비 15% 증가하며 수요 확대를 견인하고 있습니다.",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") ?? "3", 10);

  // 랜덤하게 뉴스 선택
  const shuffled = [...MOCK_NEWS].sort(() => Math.random() - 0.5);
  const news = shuffled.slice(0, Math.min(limit, MOCK_NEWS.length));

  return NextResponse.json(news);
}
