import { Resend } from "resend";
import type { MessageProvider, SendMessageRequest, SendMessageResult } from "./types";

export interface EmailProviderConfig {
  apiKey: string;
  from: string;
  to: string | string[];
}

export class EmailProvider implements MessageProvider {
  readonly type = "email" as const;
  private readonly client: Resend;
  private readonly from: string;
  private readonly to: string[];

  constructor(config: EmailProviderConfig) {
    this.client = new Resend(config.apiKey);
    this.from = config.from;
    this.to = Array.isArray(config.to) ? config.to : [config.to];
  }

  async send(request: SendMessageRequest): Promise<SendMessageResult> {
    try {
      const { data, error } = await this.client.emails.send({
        from: this.from,
        to: this.to,
        subject: request.subject ?? "금 시세 일일 리포트",
        text: request.message,
      });

      if (error) {
        return {
          success: false,
          provider: this.type,
          error: error.message,
        };
      }

      return {
        success: true,
        provider: this.type,
        messageId: data?.id,
      };
    } catch (error) {
      return {
        success: false,
        provider: this.type,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
