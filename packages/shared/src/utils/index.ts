/** 숫자를 한국어 통화 형식으로 포맷 */
export function formatKRW(value: number): string {
  return new Intl.NumberFormat("ko-KR").format(value) + "원";
}

/** 변동률 부호 포함 포맷 */
export function formatChange(change: number): string {
  const sign = change > 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat("ko-KR").format(change)}원`;
}
