import { NextRequest, NextResponse } from "next/server";
import { fetchGoldPrice } from "@/lib/api/gold-price";
import { fetchGoldNews } from "@/lib/api/gold-news";
import { sendWebhookMessage } from "@/lib/api/webhook";
import { generateReport } from "@/lib/report/generator";
import { getEnv } from "@/lib/config/env";

export const runtime = "nodejs";

// 리포트 미리보기 (웹훅 전송 없이)
export async function GET() {
  try {
    const [price, news] = await Promise.all([fetchGoldPrice(), fetchGoldNews(3)]);

    const report = await generateReport({ price, news });

    return NextResponse.json({
      success: true,
      data: {
        price,
        news,
      },
      report,
    });
  } catch (error) {
    console.error("리포트 생성 실패:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// 리포트 생성 + 웹훅 전송 (선택)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { sendToWebhook = false } = body as { sendToWebhook?: boolean };

    const [price, news] = await Promise.all([fetchGoldPrice(), fetchGoldNews(3)]);

    const report = await generateReport({ price, news });

    let webhookResult = null;
    if (sendToWebhook) {
      const env = getEnv();
      webhookResult = await sendWebhookMessage({
        roomName: env.TARGET_ROOM_NAME,
        message: report.message,
      });
    }

    return NextResponse.json({
      success: true,
      report,
      webhook: webhookResult,
    });
  } catch (error) {
    console.error("리포트 생성/전송 실패:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
