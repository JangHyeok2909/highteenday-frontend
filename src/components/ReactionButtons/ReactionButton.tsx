import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import styles from "./ReactionButtons.module.css";

interface ReactionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  tone?: "like" | "dislike";
  count?: number;
  iconSize?: number;
}

export default function ReactionButton({
  active = false,
  tone = "like",
  count,
  iconSize = 14,
  className = "",
  ...props
}: ReactionButtonProps) {
  const toneClass = tone === "like" ? styles.btnLike : styles.btnDislike;
  const activeClass = active ? styles.btnActive : "";
  const Icon = tone === "like" ? ThumbsUp : ThumbsDown;

  return (
    <button
      type="button"
      className={`${styles.btn} ${toneClass} ${activeClass} ${className}`.trim()}
      {...props}
    >
      <Icon size={iconSize} />
      {typeof count === "number" && count > 0 && (
        <span className={styles.count}>{count}</span>
      )}
    </button>
  );
}
