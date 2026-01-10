import { NextResponse } from "next/server";
import type { GoldPriceResponse } from "@goldie/shared";

export async function GET() {
  // 오늘 날짜
  const today = new Date().toISOString().split("T")[0];

  // 랜덤 시세 생성 (테스트용)
  const basePrice = 85000 + Math.floor(Math.random() * 5000);
  const change = Math.floor(Math.random() * 2000) - 1000; // -1000 ~ +1000
  const changeRate = ((change / basePrice) * 100).toFixed(2);

  const response: GoldPriceResponse = {
    date: today,
    price: basePrice,
    change: change,
    changeRate: `${change >= 0 ? "+" : ""}${changeRate}%`,
  };

  return NextResponse.json(response);
}
