import React from "react";
import clsx from "clsx";
import "./Card.css";

interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** 카드 상단 제목 영역 (문자열이면 기본 타이틀 스타일 적용) */
  title?: React.ReactNode;
  /** 제목 오른쪽 끝에 붙는 액션 (더보기 링크 등) */
  headerAction?: React.ReactNode;
  /** padding 없는 카드 (테이블/리스트가 모서리까지 차야 할 때) */
  flush?: boolean;
}

export default function Card({
  title,
  headerAction,
  flush = false,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <section
      className={clsx("ui-card", flush && "ui-card--flush", className)}
      {...rest}
    >
      {(title || headerAction) && (
        <header className="ui-card__header">
          {typeof title === "string" ? (
            <h2 className="ui-card__title">{title}</h2>
          ) : (
            title
          )}
          {headerAction && (
            <div className="ui-card__action">{headerAction}</div>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
