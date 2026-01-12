import { NextRequest, NextResponse } from "next/server";
import { fetchGoldPrice } from "@/lib/api/gold-price";
import { getMessageProvider } from "@/lib/providers";
import { generateReport } from "@/lib/report/generator";

export const runtime = "nodejs";

// 리포트 미리보기 (전송 없이)
export async function GET() {
  try {
    const price = await fetchGoldPrice();
    const report = await generateReport({ price });

    return NextResponse.json({
      success: true,
      data: { price },
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

// 리포트 생성 + 메시지 전송 (선택)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { send = false } = body as { send?: boolean };

    const price = await fetchGoldPrice();
    const report = await generateReport({ price });

    let deliveryResult = null;
    if (send) {
      const provider = getMessageProvider();
      deliveryResult = await provider.send({
        message: report.message,
        subject: `금 시세 리포트 - ${new Date().toLocaleDateString("ko-KR")}`,
      });
    }

    return NextResponse.json({
      success: true,
      report,
      delivery: deliveryResult,
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
