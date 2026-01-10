/**
 * Goldie Bot - 웹훅 서버 스크립트
 *
 * DarkTornado KakaoTalkBot API 2 기반
 * https://darktornado.github.io/KakaoTalkBot/
 *
 * 사용법:
 * 1. 이 스크립트를 봇 앱에 추가
 * 2. WEBHOOK_SECRET 값 변경
 * 3. 컴파일 후 실행
 */

// ============================================
// 설정
// ============================================

const PORT = 8080;
const WEBHOOK_SECRET = "your-webhook-secret"; // 반드시 변경하세요!

// ============================================
// 서버 시작
// ============================================

function onStartCompile() {
  try {
    const server = new java.net.ServerSocket(PORT);
    Log.i("[Goldie] HTTP 서버 시작: 포트 " + PORT);

    new java.lang.Thread({
      run: function () {
        while (true) {
          try {
            const client = server.accept();
            handleRequest(client);
          } catch (e) {
            Log.e("[Goldie] 서버 에러: " + e);
          }
        }
      },
    }).start();
  } catch (e) {
    Log.e("[Goldie] 서버 시작 실패: " + e);
  }
}

// ============================================
// 요청 처리
// ============================================

function handleRequest(client) {
  try {
    const reader = new java.io.BufferedReader(
      new java.io.InputStreamReader(client.getInputStream())
    );
    const writer = new java.io.PrintWriter(client.getOutputStream(), true);

    // 헤더 파싱
    let line;
    let contentLength = 0;
    let webhookSecret = "";
    let method = "";

    // 첫 줄에서 메서드 추출
    const firstLine = reader.readLine();
    if (firstLine) {
      method = firstLine.split(" ")[0];
    }

    // 나머지 헤더 읽기
    while ((line = reader.readLine()) !== null && line.length() > 0) {
      if (line.toLowerCase().startsWith("content-length:")) {
        contentLength = parseInt(line.split(":")[1].trim());
      }
      if (line.toLowerCase().startsWith("x-webhook-secret:")) {
        webhookSecret = line.split(":")[1].trim();
      }
    }

    // GET 요청 - 헬스체크
    if (method === "GET") {
      writer.println("HTTP/1.1 200 OK");
      writer.println("Content-Type: application/json");
      writer.println("");
      writer.println(JSON.stringify({ status: "healthy", port: PORT }));
      client.close();
      return;
    }

    // POST 요청이 아니면 거부
    if (method !== "POST") {
      writer.println("HTTP/1.1 405 Method Not Allowed");
      writer.println("");
      client.close();
      return;
    }

    // 인증 확인
    if (webhookSecret !== WEBHOOK_SECRET) {
      Log.w("[Goldie] 인증 실패: " + webhookSecret);
      writer.println("HTTP/1.1 401 Unauthorized");
      writer.println("Content-Type: application/json");
      writer.println("");
      writer.println(JSON.stringify({ success: false, error: "Unauthorized" }));
      client.close();
      return;
    }

    // 바디 읽기
    const bodyChars = [];
    for (let i = 0; i < contentLength; i++) {
      bodyChars.push(String.fromCharCode(reader.read()));
    }
    const bodyStr = bodyChars.join("");

    // JSON 파싱
    let json;
    try {
      json = JSON.parse(bodyStr);
    } catch (e) {
      Log.e("[Goldie] JSON 파싱 실패: " + e);
      writer.println("HTTP/1.1 400 Bad Request");
      writer.println("Content-Type: application/json");
      writer.println("");
      writer.println(JSON.stringify({ success: false, error: "Invalid JSON" }));
      client.close();
      return;
    }

    // 필수 필드 확인
    if (!json.roomName || !json.message) {
      writer.println("HTTP/1.1 400 Bad Request");
      writer.println("Content-Type: application/json");
      writer.println("");
      writer.println(
        JSON.stringify({
          success: false,
          error: "Missing roomName or message",
        })
      );
      client.close();
      return;
    }

    // 메시지 전송 (API 2 방식)
    const bot = BotManager.getCurrentBot();
    const success = bot.send(json.roomName, json.message);

    Log.i(
      "[Goldie] 메시지 전송: " +
        json.roomName +
        " (성공: " +
        success +
        ")"
    );

    // 응답
    writer.println("HTTP/1.1 200 OK");
    writer.println("Content-Type: application/json");
    writer.println("");
    writer.println(
      JSON.stringify({
        success: success,
        roomName: json.roomName,
        messageLength: json.message.length,
      })
    );

    client.close();
  } catch (e) {
    Log.e("[Goldie] 요청 처리 에러: " + e);
    try {
      client.close();
    } catch (ignored) {}
  }
}

// ============================================
// 봇 응답 (선택사항)
// ============================================

function response(room, msg, sender, isGroupChat, replier) {
  // 필요시 채팅 명령어 처리 추가
  // 예: if (msg === "/금") { replier.reply("금 시세 조회 중..."); }
}
