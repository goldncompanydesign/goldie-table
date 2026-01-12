import { z } from "zod";

const envSchema = z.object({
  // 메시지 Provider 설정
  MESSAGE_PROVIDER: z.enum(["email", "kakaotalk"]).default("email"),

  // 이메일 Provider (Resend)
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  EMAIL_TO: z.string().optional(), // 콤마로 구분된 이메일 목록

  // 카카오톡 Provider (안드로이드 봇 웹훅)
  WEBHOOK_URL: z.string().url().optional(),
  WEBHOOK_SECRET: z.string().optional(),
  TARGET_ROOM_NAME: z.string().default("금시세알림방"),

  // LLM 설정 (Vercel AI SDK)
  OPENAI_API_KEY: z.string().optional(),
  USE_LLM: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),

  // 스케줄러 설정
  CRON_SECRET: z.string().optional(),

  // 환경
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Environment validation failed:", result.error.format());
    throw new Error(
      `Invalid environment variables: ${result.error.issues.map((i) => i.path.join(".")).join(", ")}`
    );
  }

  cachedEnv = result.data;
  return cachedEnv;
}

export function isLLMEnabled(): boolean {
  const env = getEnv();
  return env.USE_LLM && !!env.OPENAI_API_KEY;
}

export function isProduction(): boolean {
  return getEnv().NODE_ENV === "production";
}
