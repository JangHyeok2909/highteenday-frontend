// 백엔드 API 응답에서 사용하는 공용 도메인 타입 모음.
// 각 컴포넌트의 실제 사용처(res.data 접근 필드)를 기준으로 정의됨.

export interface Board {
  id: number;
  boardName: string;
}

/** GET /api/posts/{postId} */
export interface Post {
  id: number;
  title: string;
  /** Toast UI 에디터가 생성한 HTML 문자열 */
  content: string;
  board: { boardName: string };
  author: string | null;
  authorId: number | null;
  owner: boolean;
  viewCount: number;
  createdAt: string;
  likeCount: number;
  dislikeCount: number;
  liked: boolean;
  disliked: boolean;
  scrapped: boolean;
}

/** 게시글 목록 아이템 (BoardPage, BoardPreview, 마이페이지 목록) */
export interface PostPreview {
  id: number;
  title: string;
  author: string | null;
  anonymous?: boolean;
  commentCount?: number;
  viewCount?: number;
  likeCount?: number;
  createdAt: string;
}

/** GET /api/posts/{postId}/comments — 평면 배열, 트리는 클라이언트에서 parentId로 구성 */
export interface Comment {
  id: number;
  postId: number;
  parentId: number | null;
  content: string;
  /** 첨부 이미지 URL */
  url: string | null;
  author: string | null;
  profileUrl: string | null;
  owner: boolean;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string;
  updated: boolean;
  likeCount: number;
  dislikeCount: number;
  liked: boolean;
  disliked: boolean;
  /** 클라이언트에서 트리 구성 시 추가됨 */
  replies?: Comment[];
}

export type NotificationCategory =
  | "POST_COMMENT"
  | "COMMENT_REPLY"
  | "FRIEND_REQUEST"
  | "FRIEND_ACCEPT"
  | "POST_TRENDING"
  | "POST_LIKE_THRESHOLD"
  | "FRIEND_BIRTHDAY";

/** GET /api/notifications 아이템 */
export interface AppNotification {
  id: number;
  category: NotificationCategory;
  senderNickname: string | null;
  senderProfileUrl: string | null;
  message: string;
  contentMessage: string | null;
  isRead: boolean;
  createdAt: string;
  /** 알림 클릭 시 이동 대상 엔티티(게시글 등) id */
  entityId?: number | null;
}

export interface NotificationListResponse {
  notifications: AppNotification[];
  totalPages: number;
}

export interface Friend {
  id: number;
  nickname: string;
  profileUrl: string | null;
  schoolName?: string | null;
}

/**
 * 목록 응답 envelope이 일관되지 않아(content / postPreviewDtos / postDtos)
 * 방어적으로 목록을 꺼내는 헬퍼.
 */
export function pickList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  const d = data as Record<string, unknown> | null | undefined;
  const list = d?.content ?? d?.postPreviewDtos ?? d?.postDtos;
  return Array.isArray(list) ? (list as T[]) : [];
}

/** 목록 응답의 전체 개수 필드도 total / totalElements로 갈림 */
export function pickTotal(data: unknown, fallback = 0): number {
  const d = data as Record<string, unknown> | null | undefined;
  const total = d?.total ?? d?.totalElements;
  return typeof total === "number" ? total : fallback;
}
