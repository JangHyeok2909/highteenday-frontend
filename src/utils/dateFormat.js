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