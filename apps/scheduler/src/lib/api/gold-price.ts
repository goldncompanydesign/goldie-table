import type { GoldPriceResponse } from "@goldie/shared";
import { getEnv } from "../config/env";

export class GoldPriceApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public cause?: unknown
  ) {
    super(message);
    this.name = "GoldPriceApiError";
  }
}

export async function fetchGoldPrice(): Promise<GoldPriceResponse> {
  const env = getEnv();

  const response = await fetch(`${env.GOLD_API_BASE_URL}/gold/price`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(env.GOLD_API_KEY && { Authorization: `Bearer ${env.GOLD_API_KEY}` }),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new GoldPriceApiError(
      `금 시세 API 호출 실패: ${response.status} ${response.statusText}`,
      response.status
    );
  }

  const data = await response.json();
  return data as GoldPriceResponse;
}
