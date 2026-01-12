/** 금 시세 API 응답 타입 (dev-internal-api.goldie.co.kr) */
export interface GoldPriceApiResponse {
  code: number;
  message: string;
  data: GoldPriceData;
}

/** 금 시세 리포트 (살 때 + 팔 때) */
export interface GoldPriceReport {
  /** 살 때 시세 (판매가) */
  buyPrice: GoldPriceData;
  /** 팔 때 시세 (매입가) */
  sellPrice: GoldPriceData;
}

/** 금 시세 데이터 */
export interface GoldPriceData {
  // 순금 (24K)
  goldTaelPrice: number;
  goldGramPrice: number;
  goldTaelDailyChange: number;
  goldGramDailyChange: number;
  goldTaelDailyChangePercent: number;
  goldGramDailyChangePercent: number;

  // 18K
  gold18KTaelPrice: number;
  gold18KGramPrice: number;
  gold18KTaelDailyChange: number;
  gold18KGramDailyChange: number;
  gold18KTaelDailyChangePercent: number;
  gold18KGramDailyChangePercent: number;

  // 14K
  gold14KTaelPrice: number;
  gold14KGramPrice: number;
  gold14KTaelDailyChange: number;
  gold14KGramDailyChange: number;
  gold14KTaelDailyChangePercent: number;
  gold14KGramDailyChangePercent: number;

  // 백금
  whiteGoldTaelPrice: number;
  whiteGoldGramPrice: number;
  whiteGoldTaelDailyChange: number;
  whiteGoldGramDailyChange: number;
  whiteGoldTaelDailyChangePercent: number;
  whiteGoldGramDailyChangePercent: number;

  // 은
  silverTaelPrice: number;
  silverGramPrice: number;
  silverTaelDailyChange: number;
  silverGramDailyChange: number;
  silverTaelDailyChangePercent: number;
  silverGramDailyChangePercent: number;
}

/** 안드로이드 봇 전송 요청 타입 */
export interface SendMessageRequest {
  roomName: string;
  message: string;
}

/** 리포트 생성 결과 */
export interface ReportResult {
  message: string;
  generatedBy: "llm" | "template";
  generatedAt: string;
}

/** 웹훅 응답 */
export interface WebhookResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/** Cron 실행 결과 */
export interface CronExecutionResult {
  success: boolean;
  report?: ReportResult;
  webhook?: WebhookResponse;
  error?: string;
}
