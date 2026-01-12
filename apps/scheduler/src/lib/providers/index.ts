import { getEnv } from "../config/env";
import { EmailProvider } from "./email";
import { KakaoTalkProvider } from "./kakaotalk";
import type { MessageProvider, ProviderType } from "./types";

export type { MessageProvider, SendMessageRequest, SendMessageResult, ProviderType } from "./types";
export { EmailProvider } from "./email";
export { KakaoTalkProvider } from "./kakaotalk";

let cachedProvider: MessageProvider | null = null;

export function getMessageProvider(): MessageProvider {
  if (cachedProvider) return cachedProvider;

  const env = getEnv();

  switch (env.MESSAGE_PROVIDER) {
    case "email":
      if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.EMAIL_TO) {
        throw new Error(
          "이메일 Provider 설정 누락: RESEND_API_KEY, EMAIL_FROM, EMAIL_TO 필요"
        );
      }
      cachedProvider = new EmailProvider({
        apiKey: env.RESEND_API_KEY,
        from: env.EMAIL_FROM,
        to: env.EMAIL_TO.split(",").map((e) => e.trim()),
      });
      break;

    case "kakaotalk":
      if (!env.WEBHOOK_URL) {
        throw new Error("카카오톡 Provider 설정 누락: WEBHOOK_URL 필요");
      }
      cachedProvider = new KakaoTalkProvider({
        webhookUrl: env.WEBHOOK_URL,
        webhookSecret: env.WEBHOOK_SECRET,
        roomName: env.TARGET_ROOM_NAME,
      });
      break;

    default:
      throw new Error(`알 수 없는 Provider: ${env.MESSAGE_PROVIDER}`);
  }

  return cachedProvider;
}

/** Provider 캐시 초기화 (테스트용) */
export function resetProviderCache(): void {
  cachedProvider = null;
}
