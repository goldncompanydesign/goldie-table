import { NextRequest, NextResponse } from "next/server";
import { getEnv, isProduction } from "@/lib/config/env";
import { fetchGoldPrice } from "@/lib/api/gold-price";
import { fetchGoldNews } from "@/lib/api/gold-news";
import { sendWebhookMessage } from "@/lib/api/webhook";
import { generateReport } from "@/lib/report/generator";
import { getDailyReportDelay, delay, formatDelay } from "@/lib/scheduler/random-delay";

// Vercel Cron 설정
export const runtime = "nodejs";
export const maxDuration = 300; // 5분 (랜덤 지연 포함)

export async function GET(request: NextRequest) {
  const env = getEnv();

  // Cron 인증 검증 (Vercel Cron의 경우 CRON_SECRET 사용)
  const authHeader = request.headers.get("authorization");
  if (env.CRON_SECRET && authHeader !== `Bearer ${env.CRON_SECRET}`) {
    console.warn("Cron 인증 실패");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 랜덤 지연 적용 (프로덕션에서만)
    if (isProduction()) {
      const delayMs = getDailyReportDelay();
      console.log(`랜덤 지연 적용: ${formatDelay(delayMs)}`);
      await delay(delayMs);
    }

    // 데이터 수집 (병렬 처리)
    const [price, news] = await Promise.all([fetchGoldPrice(), fetchGoldNews(3)]);

    console.log("금 시세 데이터 수집 완료:", { date: price.date, price: price.price });
    console.log("금 뉴스 데이터 수집 완료:", { count: news.length });

    // 리포트 생성
    const report = await generateReport({ price, news });
    console.log("리포트 생성 완료:", { generatedBy: report.generatedBy });

    // 웹훅 전송
    const webhookResult = await sendWebhookMessage({
      roomName: env.TARGET_ROOM_NAME,
      message: report.message,
    });

    console.log("웹훅 전송 완료:", webhookResult);

    return NextResponse.json({
      success: true,
      report: {
        generatedBy: report.generatedBy,
        generatedAt: report.generatedAt,
        messageLength: report.message.length,
      },
      webhook: webhookResult,
    });
  } catch (error) {
    console.error("일일 리포트 생성/전송 실패:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
