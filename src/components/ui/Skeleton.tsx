import React from "react";
import clsx from "clsx";
import "./Skeleton.css";

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  /** 원형 (아바타 자리) */
  circle?: boolean;
  className?: string;
}

export default function Skeleton({
  width = "100%",
  height = 16,
  circle = false,
  className,
}: SkeletonProps) {
  return (
    <span
      className={clsx("ui-skeleton", circle && "ui-skeleton--circle", className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
