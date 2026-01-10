/** 금 시세 API 응답 타입 */
export interface GoldPriceResponse {
  date: string;
  price: number;
  change: number;
  changeRate: string;
}

/** 금 뉴스 API 응답 타입 */
export interface GoldNewsItem {
  title: string;
  summary: string;
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
