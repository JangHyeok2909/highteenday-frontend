import React, { useState } from "react";
import clsx from "clsx";
import defaultProfileImage from "../../assets/default_profile_image.jpg";
import "./Avatar.css";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  /** 지름(px). 기본 36 */
  size?: number;
  className?: string;
}

/** 프로필 이미지. src가 없거나 로드 실패 시 기본 이미지로 폴백 */
export default function Avatar({
  src,
  alt = "프로필 이미지",
  size = 36,
  className,
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const url = !src || failed ? defaultProfileImage : src;

  return (
    <img
      className={clsx("ui-avatar", className)}
      src={url}
      alt={alt}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
