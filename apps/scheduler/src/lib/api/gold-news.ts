import type { GoldNewsItem } from "@goldie/shared";
import { getEnv } from "../config/env";

export class GoldNewsApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public cause?: unknown
  ) {
    super(message);
    this.name = "GoldNewsApiError";
  }
}

export async function fetchGoldNews(limit = 3): Promise<GoldNewsItem[]> {
  const env = getEnv();

  const url = new URL(`${env.GOLD_API_BASE_URL}/gold/news`);
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(env.GOLD_API_KEY && { Authorization: `Bearer ${env.GOLD_API_KEY}` }),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new GoldNewsApiError(
      `금 뉴스 API 호출 실패: ${response.status} ${response.statusText}`,
      response.status
    );
  }

  const data = await response.json();
  return data as GoldNewsItem[];
}
