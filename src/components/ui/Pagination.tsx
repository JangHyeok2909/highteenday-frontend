import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import clsx from "clsx";
import "./Pagination.css";

interface PaginationProps {
  /** 0-based 현재 페이지 */
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  /** 한 번에 보여줄 페이지 번호 개수 */
  windowSize?: number;
  className?: string;
}

/** 번호형 페이지네이션 (0-based page 인덱스) */
export default function Pagination({
  page,
  totalPages,
  onChange,
  windowSize = 5,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const windowStart = Math.floor(page / windowSize) * windowSize;
  const windowEnd = Math.min(windowStart + windowSize, totalPages);
  const pages: number[] = [];
  for (let p = windowStart; p < windowEnd; p++) pages.push(p);

  const go = (p: number) => {
    if (p < 0 || p >= totalPages || p === page) return;
    onChange(p);
  };

  return (
    <nav className={clsx("ui-pagination", className)} aria-label="페이지 이동">
      <button
        type="button"
        className="ui-pagination__nav"
        onClick={() => go(0)}
        disabled={page === 0}
        aria-label="첫 페이지"
      >
        <ChevronsLeft size={16} />
      </button>
      <button
        type="button"
        className="ui-pagination__nav"
        onClick={() => go(page - 1)}
        disabled={page === 0}
        aria-label="이전 페이지"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={clsx(
            "ui-pagination__page",
            p === page && "ui-pagination__page--active"
          )}
          onClick={() => go(p)}
          aria-current={p === page ? "page" : undefined}
        >
          {p + 1}
        </button>
      ))}

      <button
        type="button"
        className="ui-pagination__nav"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages - 1}
        aria-label="다음 페이지"
      >
        <ChevronRight size={16} />
      </button>
      <button
        type="button"
        className="ui-pagination__nav"
        onClick={() => go(totalPages - 1)}
        disabled={page >= totalPages - 1}
        aria-label="마지막 페이지"
      >
        <ChevronsRight size={16} />
      </button>
    </nav>
  );
}
