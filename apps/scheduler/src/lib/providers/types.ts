/** 메시지 전송 요청 */
export interface SendMessageRequest {
  /** 메시지 내용 */
  message: string;
  /** 제목 (이메일용, 카카오톡은 무시) */
  subject?: string;
}

/** 메시지 전송 결과 */
export interface SendMessageResult {
  success: boolean;
  provider: ProviderType;
  messageId?: string;
  error?: string;
}

/** Provider 타입 */
export type ProviderType = "email" | "kakaotalk";

/** Provider 인터페이스 */
export interface MessageProvider {
  readonly type: ProviderType;
  send(request: SendMessageRequest): Promise<SendMessageResult>;
}
