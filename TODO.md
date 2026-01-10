# TODO - 운영까지 남은 작업

## 1. 사내 API 연동

### 1.1 금 시세 API 확인
- [ ] API 엔드포인트 확인: `GET /gold/price`
- [ ] 응답 형식 확인
  ```json
  {
    "date": "2026-01-10",
    "price": 86500,
    "change": 1200,
    "changeRate": "+1.41%"
  }
  ```
- [ ] 인증 방식 확인 (API Key, Bearer Token 등)

### 1.2 금 뉴스 API 확인
- [ ] API 엔드포인트 확인: `GET /gold/news?limit=3`
- [ ] 응답 형식 확인
  ```json
  [
    { "title": "...", "summary": "..." }
  ]
  ```

### 1.3 환경변수 설정
- [ ] `.env.local` 생성 (로컬 개발용)
  ```bash
  GOLD_API_BASE_URL=https://your-api.example.com
  GOLD_API_KEY=your-api-key
  ```

---

## 2. 안드로이드 봇 구축

### 2.1 하드웨어 준비
- [ ] 전용 안드로이드 폰 준비 (24시간 상시 가동)
- [ ] 충전기 연결
- [ ] 안정적인 Wi-Fi 연결

### 2.2 KakaoTalkBot 설치
- [ ] [MessengerBot](https://github.com/niceneety/MessengerBot) 또는 [DarkTornado KakaoTalkBot](https://github.com/darktornado/KakaoTalkBot) 설치
- [ ] 알림 접근 권한 허용
- [ ] 배터리 최적화 예외 설정

### 2.3 카카오톡 설정
- [ ] 봇용 카카오 계정 로그인
- [ ] 오픈채팅방 입장 (방장 권한)
- [ ] 알림 활성화

### 2.4 HTTP 서버 스크립트 작성
- [ ] 봇에 아래 스크립트 추가:

```javascript
// HTTP 서버 - 웹훅 수신용
const PORT = 8080;
const WEBHOOK_SECRET = "your-webhook-secret";

function onStartCompile() {
  // 서버 시작
  const server = new java.net.ServerSocket(PORT);
  Log.i("HTTP 서버 시작: " + PORT);

  new java.lang.Thread({
    run: function() {
      while (true) {
        try {
          const client = server.accept();
          handleRequest(client);
        } catch (e) {
          Log.e("서버 에러: " + e);
        }
      }
    }
  }).start();
}

function handleRequest(client) {
  try {
    const reader = new java.io.BufferedReader(
      new java.io.InputStreamReader(client.getInputStream())
    );
    const writer = new java.io.PrintWriter(client.getOutputStream(), true);

    // 헤더 읽기
    let line;
    let contentLength = 0;
    let webhookSecret = "";

    while ((line = reader.readLine()) !== null && line.length() > 0) {
      if (line.startsWith("Content-Length:")) {
        contentLength = parseInt(line.split(":")[1].trim());
      }
      if (line.startsWith("X-Webhook-Secret:")) {
        webhookSecret = line.split(":")[1].trim();
      }
    }

    // 인증 확인
    if (webhookSecret !== WEBHOOK_SECRET) {
      writer.println("HTTP/1.1 401 Unauthorized");
      writer.println("");
      client.close();
      return;
    }

    // 바디 읽기
    const body = new Array(contentLength);
    for (let i = 0; i < contentLength; i++) {
      body[i] = String.fromCharCode(reader.read());
    }
    const json = JSON.parse(body.join(""));

    // 메시지 전송 (API 2 방식)
    const bot = BotManager.getCurrentBot();
    const success = bot.send(json.roomName, json.message);

    // 응답
    writer.println("HTTP/1.1 200 OK");
    writer.println("Content-Type: application/json");
    writer.println("");
    writer.println(JSON.stringify({ success: success }));

    client.close();
    Log.i("메시지 전송: " + json.roomName);
  } catch (e) {
    Log.e("요청 처리 에러: " + e);
  }
}
```

### 2.5 외부 접근 설정
- [ ] **옵션 A: 포트포워딩**
  - 공유기에서 8080 포트 포워딩
  - 고정 IP 또는 DDNS 설정

- [ ] **옵션 B: ngrok (권장)**
  ```bash
  # 안드로이드에 Termux 설치 후
  pkg install ngrok
  ngrok http 8080
  ```
  - ngrok URL을 `WEBHOOK_URL`로 사용

### 2.6 테스트
- [ ] 봇 스크립트 컴파일 및 실행
- [ ] curl로 테스트:
  ```bash
  curl -X POST http://your-bot:8080 \
    -H "Content-Type: application/json" \
    -H "X-Webhook-Secret: your-webhook-secret" \
    -d '{"roomName":"테스트방","message":"테스트 메시지"}'
  ```
- [ ] 카카오톡 메시지 수신 확인

---

## 3. Vercel 배포

### 3.1 Vercel 프로젝트 연결
```bash
pnpm deploy:alpha  # 처음 실행시 프로젝트 연결 진행
```

### 3.2 환경변수 설정 (Vercel 대시보드)
- [ ] `GOLD_API_BASE_URL` - 사내 금 시세 API URL
- [ ] `GOLD_API_KEY` - API 인증 키
- [ ] `WEBHOOK_URL` - 안드로이드 봇 URL (ngrok 또는 고정 IP)
- [ ] `WEBHOOK_SECRET` - 웹훅 인증 시크릿
- [ ] `TARGET_ROOM_NAME` - 카카오톡 채팅방 이름
- [ ] `CRON_SECRET` - Cron 인증용 시크릿
- [ ] `USE_LLM` - LLM 사용 여부 (true/false)
- [ ] `OPENAI_API_KEY` - OpenAI API 키 (LLM 사용시)

### 3.3 Alpha 배포 (테스트)
```bash
pnpm deploy:alpha
```
- [ ] 배포 URL 확인
- [ ] `/api/health` 정상 응답 확인

### 3.4 Production 배포
```bash
pnpm deploy:prod
```
- [ ] Cron 등록 확인 (Vercel 대시보드 → Settings → Crons)

---

## 4. E2E 테스트

### 4.1 개별 테스트
- [ ] 금 시세 API 호출 테스트
  ```bash
  curl https://your-app.vercel.app/api/report
  ```
- [ ] 웹훅 전송 테스트
  ```bash
  curl -X POST https://your-app.vercel.app/api/report \
    -H "Content-Type: application/json" \
    -d '{"sendToWebhook": true}'
  ```
- [ ] 카카오톡 메시지 수신 확인

### 4.2 Cron 테스트
- [ ] 수동 Cron 트리거
  ```bash
  curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
    https://your-app.vercel.app/api/cron/daily-report
  ```
- [ ] 다음날 06:50 ~ 07:00 사이 자동 실행 확인

---

## 5. 운영 체크리스트

### 5.1 모니터링
- [ ] Vercel 로그 확인 방법 숙지
- [ ] 에러 알림 설정 (선택)

### 5.2 안드로이드 봇 안정성
- [ ] 봇 앱 자동 시작 설정
- [ ] 배터리 최적화 예외 확인
- [ ] Wi-Fi 연결 자동 복구 확인

### 5.3 백업 계획
- [ ] 봇 스크립트 백업
- [ ] 환경변수 백업 (안전한 곳에 저장)

---

## 완료 조건

- [ ] 매일 06:50 ~ 07:00 사이 카카오톡 오픈채팅방에 금 시세 리포트 자동 수신
- [ ] 리포트에 금 시세, 전일대비, 뉴스 요약 포함
- [ ] 1주일간 안정적 운영 확인
