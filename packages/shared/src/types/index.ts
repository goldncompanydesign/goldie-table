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
