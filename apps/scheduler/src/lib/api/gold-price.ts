import type { GoldPriceApiResponse, GoldPriceData, GoldPriceReport } from "@goldie/shared";

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

export class GoldApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl = "https://dev-internal-api.goldie.co.kr") {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new GoldPriceApiError(
        `API 호출 실패: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    return response.json();
  }

  /** 팔 때 시세 (매입가) */
  async getCurrentPrice(): Promise<GoldPriceData> {
    const result = await this.request<GoldPriceApiResponse>(
      "/v1/api/global/gold-current-price"
    );

    if (result.code !== 200) {
      throw new GoldPriceApiError(
        `금 시세 API 오류: ${result.message}`,
        result.code
      );
    }

    return result.data;
  }

  /** 살 때 시세 (판매가) */
  async getMarketPrice(): Promise<GoldPriceData> {
    const result = await this.request<GoldPriceApiResponse>(
      "/v1/api/global/gold-market-price"
    );

    if (result.code !== 200) {
      throw new GoldPriceApiError(
        `금 시세 API 오류: ${result.message}`,
        result.code
      );
    }

    return result.data;
  }

  /** 살 때 + 팔 때 시세 모두 조회 */
  async getAllPrices(): Promise<GoldPriceReport> {
    const [buyPrice, sellPrice] = await Promise.all([
      this.getMarketPrice(),
      this.getCurrentPrice(),
    ]);

    return { buyPrice, sellPrice };
  }
}

// 싱글톤 인스턴스
const goldApiClient = new GoldApiClient();

export async function fetchGoldPrice(): Promise<GoldPriceReport> {
  return goldApiClient.getAllPrices();
}
