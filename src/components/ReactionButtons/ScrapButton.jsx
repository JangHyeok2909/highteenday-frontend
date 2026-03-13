import React from "react";
import { Bookmark } from "lucide-react";
import styles from "./ReactionButtons.module.css";

export default function ScrapButton({
  active = false,
  onClick,
  iconSize = 14,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`${styles.btn} ${styles.btnScrap} ${active ? styles.btnScrapActive : ""} ${className}`.trim()}
      onClick={onClick}
      aria-label={active ? "스크랩 취소" : "스크랩"}
      title={active ? "스크랩 취소" : "스크랩"}
      {...props}
    >
      <Bookmark size={iconSize} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
