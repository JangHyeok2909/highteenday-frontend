import React from "react";
import clsx from "clsx";
import "./Badge.css";

type BadgeTone = "primary" | "neutral" | "danger";

interface BadgeProps {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}

/** 게시판 라벨, 익명 태그, 읽지 않음 카운트 등 작은 라벨 */
export default function Badge({
  tone = "neutral",
  className,
  children,
}: BadgeProps) {
  return (
    <span className={clsx("ui-badge", `ui-badge--${tone}`, className)}>
      {children}
    </span>
  );
}
