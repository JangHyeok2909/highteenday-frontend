import React from "react";
import { Inbox } from "lucide-react";
import clsx from "clsx";
import "./EmptyState.css";

interface EmptyStateProps {
  /** lucide 아이콘 등 임의 아이콘 요소. 기본 Inbox */
  icon?: React.ReactNode;
  message: React.ReactNode;
  /** 버튼 등 하단 액션 */
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={clsx("ui-empty", className)}>
      <div className="ui-empty__icon">{icon ?? <Inbox size={36} />}</div>
      <p className="ui-empty__message">{message}</p>
      {action && <div className="ui-empty__action">{action}</div>}
    </div>
  );
}
