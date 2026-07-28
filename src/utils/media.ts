import axios from "axios";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/** 업로드 전 클라이언트 검증. 통과하면 null, 실패하면 에러 메시지 반환. */
export function validateImageFile(file: File): string | null {
  if (file.size > MAX_IMAGE_SIZE) return "파일 크기는 5MB 이하여야 합니다.";
  if (!file.type.startsWith("image/")) return "이미지 파일만 업로드 가능합니다.";
  return null;
}

/**
 * POST /api/media 로 이미지를 업로드하고 접근 URL을 반환한다.
 * 응답 위치가 일정하지 않아(location 헤더 / data.url / imageUrl / path / 문자열)
 * 순서대로 탐색한다. URL을 못 받으면 throw.
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post("/api/media", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });

  const data = response.data as
    | { url?: string; imageUrl?: string; path?: string }
    | string
    | null;

  const uploadedUrl =
    (response.headers as Record<string, string | undefined>).location ||
    (typeof data === "object" && data !== null
      ? data.url || data.imageUrl || data.path
      : undefined) ||
    (typeof data === "string" ? data : "");

  if (!uploadedUrl) throw new Error("이미지 URL을 받을 수 없습니다.");
  return uploadedUrl;
}
