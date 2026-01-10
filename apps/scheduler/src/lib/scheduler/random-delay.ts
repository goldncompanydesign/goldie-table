/**
 * 지정된 범위 내에서 랜덤한 밀리초를 반환
 * @param minMinutes 최소 분
 * @param maxMinutes 최대 분
 */
export function getRandomDelayMs(minMinutes: number, maxMinutes: number): number {
  const minMs = minMinutes * 60 * 1000;
  const maxMs = maxMinutes * 60 * 1000;
  return Math.floor(Math.random() * (maxMs - minMs)) + minMs;
}

/**
 * 일일 리포트 발송 랜덤 지연 (0~10분)
 * 봇 탐지 회피를 위한 최소한의 랜덤성 부여
 */
export function getDailyReportDelay(): number {
  return getRandomDelayMs(0, 10); // 0분 ~ 10분
}

/**
 * Promise 기반 지연
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 지연 시간을 사람이 읽기 쉬운 형태로 변환
 */
export function formatDelay(ms: number): string {
  const minutes = Math.floor(ms / 1000 / 60);
  const seconds = Math.floor((ms / 1000) % 60);
  return `${minutes}분 ${seconds}초`;
}
