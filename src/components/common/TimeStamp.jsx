import React from "react";

/**
 * TimeStamp
 * - 화면 표기: YYYY-M-D H:mm  (분만 2자리 패딩)
 * - title(툴팁): 원본 값(문자열이면 원본, Date면 ISO)
 * - value: Date | string | number(초/밀리초 둘 다 허용)
 */

function toDate(value) {
  if (value == null) return null;
  if (value instanceof Date) return value;

  if (typeof value === "number") {
    const ms = value > 1e12 ? value : value * 1000; // 초 or 밀리초 허용
    return new Date(ms);
  }

  if (typeof value === "string") {
    const t = value.trim();
    if (!t) return null;
    if (/^\d+$/.test(t)) {
      const n = Number(t);
      const ms = n > 1e12 ? n : n * 1000;
      return new Date(ms);
    }
    // 'YYYY-MM-DD HH:mm:ss' 같은 형식도 파싱되도록 보정
    const isoish = t.includes(" ") && !t.includes("T") ? t.replace(" ", "T") : t;
    return new Date(isoish);
  }

  return null;
}

export default function TimeStamp({ value, className = "", showTitle = true }) {
  const d = toDate(value);
  if (!d || isNaN(d.getTime())) return null;

  const yyyy = d.getFullYear();
  const m = d.getMonth() + 1;
  const dd = d.getDate();
  const h = d.getHours();
  const mm = String(d.getMinutes()).padStart(2, "0");

  const display = `${yyyy}-${m}-${dd} ${h}:${mm}`;
  const tip = showTitle ? (typeof value === "string" ? value : d.toISOString()) : undefined;

  return (
    <time className={className} dateTime={d.toISOString()} title={tip}>
      {display}
    </time>
  );
}
