import type { SendMessageRequest } from "@goldie/shared";
import { getEnv } from "../config/env";

export class WebhookError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public cause?: unknown
  ) {
    super(message);
    this.name = "WebhookError";
  }
}

export interface WebhookResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface SendOptions {
  retries?: number;
  retryDelay?: number;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendWebhookMessage(
  request: SendMessageRequest,
  options?: SendOptions
): Promise<WebhookResponse> {
  const env = getEnv();
  const { retries = 3, retryDelay = 1000 } = options ?? {};

  let lastError: Error | undefined;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(env.WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(env.WEBHOOK_SECRET && {
            "X-Webhook-Secret": env.WEBHOOK_SECRET,
          }),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new WebhookError(
          `웹훅 호출 실패: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      // 봇에서 JSON을 반환하지 않을 수도 있으므로 안전하게 처리
      const text = await response.text();
      try {
        return JSON.parse(text) as WebhookResponse;
      } catch {
        // JSON이 아닌 경우 success로 간주
        return { success: true };
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`웹훅 전송 실패 (시도 ${attempt + 1}/${retries}):`, lastError.message);

      if (attempt < retries - 1) {
        await delay(retryDelay);
      }
    }
  }

  throw new WebhookError(
    `웹훅 호출 실패 (${retries}회 재시도 후): ${lastError?.message}`,
    undefined,
    lastError
  );
}
