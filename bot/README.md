# Goldie Bot - 안드로이드 봇 스크립트

DarkTornado KakaoTalkBot용 웹훅 서버 스크립트

## 요구사항

- 안드로이드 폰 (24시간 상시 가동)
- [KakaoTalkBot](https://darktornado.github.io/KakaoTalkBot/) 앱 설치
- 카카오톡 로그인 + 오픈채팅방 입장

## 설치

### 1. 봇 앱 설치

[MessengerBot](https://github.com/niceneety/MessengerBot) 또는 [KakaoTalkBot](https://github.com/niceneety/KakaoTalkBot) 설치

### 2. 스크립트 추가

`webhook-server.js` 내용을 봇 앱에 새 스크립트로 추가

### 3. 설정 변경

```javascript
const PORT = 8080;
const WEBHOOK_SECRET = "your-webhook-secret"; // 반드시 변경!
```

### 4. 권한 설정

- 알림 접근 권한 허용
- 배터리 최적화 예외 설정
- 자동 시작 허용

### 5. 컴파일 및 실행

봇 앱에서 스크립트 컴파일 → 봇 활성화

## 외부 접근 설정

### 옵션 A: ngrok (권장)

```bash
# Termux 설치 후
pkg install ngrok
ngrok http 8080
```

ngrok URL을 Vercel 환경변수 `WEBHOOK_URL`에 설정

### 옵션 B: 포트포워딩

1. 공유기에서 8080 포트 포워딩
2. 고정 IP 또는 DDNS 설정
3. `http://your-ip:8080`을 `WEBHOOK_URL`에 설정

## API

### GET /

헬스체크

```bash
curl http://your-bot:8080/
```

```json
{ "status": "healthy", "port": 8080 }
```

### POST /

메시지 전송

```bash
curl -X POST http://your-bot:8080/ \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: your-webhook-secret" \
  -d '{"roomName":"금시세알림방","message":"테스트 메시지"}'
```

```json
{ "success": true, "roomName": "금시세알림방", "messageLength": 10 }
```

## 트러블슈팅

### 메시지가 안 보내져요

1. 봇이 활성화되어 있는지 확인
2. 해당 채팅방에 알림이 온 적 있는지 확인 (한 번은 알림이 와야 전송 가능)
3. `bot.canReply(roomName)` 확인

### 서버가 안 켜져요

1. 다른 앱이 8080 포트를 사용 중인지 확인
2. 봇 앱 권한 확인
3. 로그 확인: `Log.i`, `Log.e` 출력

### ngrok URL이 계속 바뀌어요

무료 플랜은 재시작시 URL이 변경됩니다.

- ngrok 유료 플랜 사용 (고정 도메인)
- 또는 포트포워딩 + DDNS 사용
