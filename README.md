# Goldie Bot

카카오톡 오픈채팅방에 매일 금 시세 리포트를 자동 전송하는 스케줄링 서버

## 시스템 흐름

```mermaid
sequenceDiagram
    participant Cron as Vercel Cron
    participant API as /api/cron/daily-report
    participant Gold as 금 시세 API
    participant News as 금 뉴스 API
    participant LLM as OpenAI (선택)
    participant Bot as Android Bot
    participant KakaoTalk as 카카오톡

    Cron->>API: GET (매일 06:50 KST)
    API->>API: CRON_SECRET 인증
    API->>API: 랜덤 지연 (0~10분)

    par 데이터 수집
        API->>Gold: 금 시세 조회
        Gold-->>API: 시세 데이터
        API->>News: 금 뉴스 조회
        News-->>API: 뉴스 데이터
    end

    alt USE_LLM=true
        API->>LLM: 리포트 생성 요청
        LLM-->>API: AI 생성 리포트
    else USE_LLM=false 또는 LLM 실패
        API->>API: 템플릿 기반 리포트 생성
    end

    API->>Bot: POST 웹훅 (roomName, message)
    Bot->>KakaoTalk: 메시지 전송
    KakaoTalk-->>Bot: 전송 완료
    Bot-->>API: 성공 응답
```

## 아키텍처

```mermaid
graph TB
    subgraph Vercel["Vercel (클라우드)"]
        Cron[Cron Trigger<br/>매일 06:50 KST]
        API[Next.js API Routes]

        subgraph Routes["API 엔드포인트"]
            Health["/api/health"]
            Report["/api/report"]
            DailyReport["/api/cron/daily-report"]
        end
    end

    subgraph External["외부 서비스"]
        GoldAPI[금 시세 API]
        NewsAPI[금 뉴스 API]
        OpenAI[OpenAI API]
    end

    subgraph Android["Android 기기"]
        Bot[DarkTornado<br/>KakaoTalkBot]
        HTTPServer[HTTP 서버]
    end

    KakaoTalk[카카오톡<br/>오픈채팅방]

    Cron --> DailyReport
    DailyReport --> GoldAPI
    DailyReport --> NewsAPI
    DailyReport -.->|선택| OpenAI
    DailyReport --> HTTPServer
    HTTPServer --> Bot
    Bot --> KakaoTalk
```

## 리포트 생성 전략

```mermaid
flowchart TD
    Start[리포트 생성 시작] --> CheckLLM{USE_LLM=true?}

    CheckLLM -->|Yes| CheckKey{OPENAI_API_KEY<br/>설정됨?}
    CheckLLM -->|No| Template[템플릿 생성기]

    CheckKey -->|Yes| LLM[LLM 생성기<br/>GPT-4o-mini]
    CheckKey -->|No| Template

    LLM --> LLMResult{성공?}
    LLMResult -->|Yes| Done[리포트 완성]
    LLMResult -->|No| Template

    Template --> Done
```

## 프로젝트 구조

```
goldie-bot/
├── apps/
│   └── scheduler/                 # Next.js 스케줄러 앱
│       ├── src/
│       │   ├── app/
│       │   │   └── api/
│       │   │       ├── cron/daily-report/   # Vercel Cron 엔드포인트
│       │   │       ├── health/              # 헬스체크
│       │   │       └── report/              # 수동 리포트 생성
│       │   └── lib/
│       │       ├── api/           # API 클라이언트
│       │       ├── config/        # 환경변수 설정
│       │       ├── report/        # 리포트 생성기
│       │       └── scheduler/     # 스케줄링 유틸리티
│       └── vercel.json            # Vercel Cron 설정
├── packages/
│   └── shared/                    # 공유 타입 및 유틸리티
└── turbo.json                     # Turborepo 설정
```

## 환경변수

```bash
# 사내 금 시세/뉴스 API
GOLD_API_BASE_URL=https://api.example.com
GOLD_API_KEY=your-api-key

# LLM 설정 (선택)
OPENAI_API_KEY=sk-xxx
USE_LLM=false                      # true: LLM 사용, false: 템플릿 사용

# 안드로이드 봇 웹훅
WEBHOOK_URL=http://your-android:8080/send
WEBHOOK_SECRET=webhook-secret

# 스케줄러 설정
TARGET_ROOM_NAME=금시세알림방
CRON_SECRET=cron-secret            # Vercel Cron 인증용
```

## API 엔드포인트

### `GET /api/health`
헬스체크

### `GET /api/report`
리포트 미리보기 (웹훅 전송 없음)

### `POST /api/report`
리포트 생성 및 웹훅 전송

```bash
curl -X POST http://localhost:3000/api/report \
  -H "Content-Type: application/json" \
  -d '{"sendToWebhook": true}'
```

### `GET /api/cron/daily-report`
Vercel Cron 전용 엔드포인트

- `CRON_SECRET` 헤더 인증 필요
- 프로덕션에서 0~10분 랜덤 지연 적용

## 리포트 생성 방식

### 1. 템플릿 기반 (기본값)
`USE_LLM=false`일 때 사용. 고정된 포맷으로 리포트 생성.

```
🥇 금 시세 일일 리포트

📅 2026-01-10

💰 현재가: 86,500원
📈 전일대비: +1,200원 (+1.41%)

📰 오늘의 금 관련 뉴스
1. 미 연준 금리 동결, 금값 상승세
   연준의 금리 동결 결정으로...

⏰ 발송 시각: 오전 07:23
```

### 2. LLM 기반 (선택)
`USE_LLM=true`이고 `OPENAI_API_KEY` 설정시 사용. GPT-4o-mini로 자연스러운 리포트 생성.

LLM 호출 실패시 자동으로 템플릿으로 폴백.

## Vercel 배포

### 1. 프로젝트 연결
```bash
vercel link
```

### 2. 환경변수 설정
Vercel 대시보드 → Settings → Environment Variables에서 설정

### 3. 배포
```bash
vercel --prod
```

### 4. Cron 확인
Vercel 대시보드 → Settings → Crons

**Cron 스케줄:** `50 21 * * *` (UTC) = 매일 06:50 KST

## 안드로이드 봇 설정

[DarkTornado KakaoTalkBot](https://github.com/darktornado/KakaoTalkBot) 사용

봇 스크립트에 HTTP 서버 추가 필요:

```javascript
// 봇 스크립트 예시
const server = new java.net.ServerSocket(8080);

while (true) {
  const client = server.accept();
  const reader = new java.io.BufferedReader(
    new java.io.InputStreamReader(client.getInputStream())
  );

  // POST 요청 파싱
  let body = "";
  // ... 요청 읽기

  const data = JSON.parse(body);
  Bot.send(data.roomName, data.message);

  client.close();
}
```

## 개발

### 설치
```bash
pnpm install
```

### 개발 서버
```bash
pnpm dev
```

### 빌드
```bash
pnpm build
```

### 린트 + 포맷
```bash
pnpm lint
```

### 타입 체크
```bash
pnpm typecheck
```

## 기술 스택

- **모노레포:** Turborepo + pnpm
- **프레임워크:** Next.js 16
- **언어:** TypeScript
- **LLM:** Vercel AI SDK + OpenAI
- **스케줄링:** Vercel Cron
- **린트:** ESLint + Prettier
