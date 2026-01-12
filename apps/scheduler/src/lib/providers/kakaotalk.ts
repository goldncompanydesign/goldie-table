import type { MessageProvider, SendMessageRequest, SendMessageResult } from "./types";

export interface KakaoTalkProviderConfig {
  webhookUrl: string;
  webhookSecret?: string;
  roomName: string;
}

export class KakaoTalkProvider implements MessageProvider {
  readonly type = "kakaotalk" as const;
  private readonly webhookUrl: string;
  private readonly webhookSecret?: string;
  private readonly roomName: string;

  constructor(config: KakaoTalkProviderConfig) {
    this.webhookUrl = config.webhookUrl;
    this.webhookSecret = config.webhookSecret;
    this.roomName = config.roomName;
  }

  async send(request: SendMessageRequest): Promise<SendMessageResult> {
    const maxRetries = 3;
    const retryDelay = 1000;

    let lastError: string | undefined;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(this.webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(this.webhookSecret && {
              "X-Webhook-Secret": this.webhookSecret,
            }),
          },
          body: JSON.stringify({
            roomName: this.roomName,
            message: request.message,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        return {
          success: true,
          provider: this.type,
        };
      } catch (error) {
        lastError = error instanceof Error ? error.message : "Unknown error";
        console.warn(
          `카카오톡 전송 실패 (시도 ${attempt + 1}/${maxRetries}):`,
          lastError
        );

        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    return {
      success: false,
      provider: this.type,
      error: `${maxRetries}회 재시도 후 실패: ${lastError}`,
    };
  }
}
