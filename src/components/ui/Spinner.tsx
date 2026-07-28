import React from "react";
import clsx from "clsx";
import "./Spinner.css";

interface SpinnerProps {
  /** 지름(px) */
  size?: number;
  className?: string;
}

export default function Spinner({ size = 20, className }: SpinnerProps) {
  return (
    <span
      className={clsx("ui-spinner", className)}
      style={{ width: size, height: size }}
      role="status"
      aria-label="로딩 중"
    />
  );
}
