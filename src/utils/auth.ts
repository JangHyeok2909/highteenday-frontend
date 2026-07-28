/**
 * 로그인한 사용자 id는 백엔드 userInfo 응답(User)에 없어서
 * localStorage 'loginUserId'로 별도 관리된다. 접근을 이 헬퍼로 표준화한다.
 */
export function getLoginUserId(): number | null {
  const raw = localStorage.getItem("loginUserId");
  if (raw == null) return null;
  const id = parseInt(raw, 10);
  return Number.isNaN(id) ? null : id;
}
