/**
 * Format ISO date string to "MM.DD HH:MM" (ko-KR).
 * Example: "03.13 09:41"
 */
export function formatBoardPreviewDate(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");

  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());

  return `${month}.${day} ${hour}:${minute}`;
}

/**
 * Format ISO date string to Korean relative time.
 * "방금 전", "N분 전", "N시간 전", "N일 전", then falls back to formatBoardPreviewDate.
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  const now = Date.now();
  const diff = Math.floor((now - date.getTime()) / 1000);

  if (diff < 60) return "방금 전";
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;

  return formatBoardPreviewDate(isoString);
}