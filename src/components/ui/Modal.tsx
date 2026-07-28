import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import clsx from "clsx";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 상단 타이틀. 없으면 헤더 없이 본문만 */
  title?: React.ReactNode;
  /** max-width(px). 기본 480 */
  width?: number;
  /** 닫기(X) 버튼 숨김 */
  hideCloseButton?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  width = 480,
  hideCloseButton = false,
  className,
  children,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, handleKeyDown]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="ui-modal__overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className={clsx("ui-modal", className)}
            style={{ maxWidth: width }}
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {(title || !hideCloseButton) && (
              <header className="ui-modal__header">
                {typeof title === "string" ? (
                  <h2 className="ui-modal__title">{title}</h2>
                ) : (
                  <div>{title}</div>
                )}
                {!hideCloseButton && (
                  <button
                    type="button"
                    className="ui-modal__close"
                    onClick={onClose}
                    aria-label="닫기"
                  >
                    <X size={20} />
                  </button>
                )}
              </header>
            )}
            <div className="ui-modal__body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
