# @goldie/shared

Goldie Bot 공유 타입 및 유틸리티 패키지

## 설치

워크스페이스 내에서 자동 링크됨:

```json
{
  "dependencies": {
    "@goldie/shared": "workspace:*"
  }
}
```

## 타입

### `GoldPriceResponse`

금 시세 API 응답 타입

```typescript
interface GoldPriceResponse {
  date: string;      // "2026-01-10"
  price: number;     // 86500
  change: number;    // 1200
  changeRate: string; // "+1.41%"
}
```

### `GoldNewsItem`

금 뉴스 API 응답 타입

```typescript
interface GoldNewsItem {
  title: string;   // "미 연준 금리 동결, 금값 상승세"
  summary: string; // "연준의 금리 동결 결정으로..."
}
```

### `SendMessageRequest`

안드로이드 봇 웹훅 요청 타입

```typescript
interface SendMessageRequest {
  roomName: string; // "금시세알림방"
  message: string;  // "🥇 금 시세 일일 리포트..."
}
```

### `ReportResult`

리포트 생성 결과

```typescript
interface ReportResult {
  message: string;
  generatedBy: "llm" | "template";
  generatedAt: string;
}
```

### `WebhookResponse`

웹훅 응답

```typescript
interface WebhookResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}
```

### `CronExecutionResult`

Cron 실행 결과

```typescript
interface CronExecutionResult {
  success: boolean;
  report?: ReportResult;
  webhook?: WebhookResponse;
  error?: string;
}
```

## 유틸리티

### `formatKRW(value: number): string`

숫자를 한국어 통화 형식으로 포맷

```typescript
formatKRW(86500); // "86,500원"
```

### `formatChange(change: number): string`

변동값을 부호 포함하여 포맷

```typescript
formatChange(1200);  // "+1,200원"
formatChange(-500);  // "-500원"
```

## 사용 예시

```typescript
import { formatKRW, formatChange } from "@goldie/shared";
import type { GoldPriceResponse } from "@goldie/shared";

const price: GoldPriceResponse = {
  date: "2026-01-10",
  price: 86500,
  change: 1200,
  changeRate: "+1.41%",
};

console.log(`현재가: ${formatKRW(price.price)}`);
// 현재가: 86,500원

console.log(`전일대비: ${formatChange(price.change)}`);
// 전일대비: +1,200원
```

## 스크립트

```bash
pnpm build      # tsup으로 빌드 (CJS + ESM + DTS)
pnpm dev        # watch 모드
pnpm lint       # ESLint
pnpm typecheck  # TypeScript 타입 체크
```

## 출력

```
dist/
├── index.js        # CommonJS
├── index.mjs       # ES Module
├── index.d.ts      # TypeScript 선언
├── types/
│   ├── index.js
│   ├── index.mjs
│   └── index.d.ts
```
