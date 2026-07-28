import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, EmptyState, Pagination } from "../../ui";
import "../MyPageList.css";

interface MyComment {
  id: number;
  postId: number;
  content: string;
  author: string | null;
  createdAt: string;
  likeCount: number | null;
}

const ITEMS_PER_PAGE = 10;

function MyCommentsPage() {
  const [comments, setComments] = useState<MyComment[]>([]);
  const [sortType, setSortType] = useState("RECENT");
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/mypage/comments", {
        params: { page: 0, sortType },
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data?.commentDtos ?? [];
        const arr: MyComment[] = Array.isArray(data) ? data : [];
        if (sortType === "RECENT") {
          arr.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (sortType === "LIKE") {
          arr.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        }
        setComments(arr);
        setPage(0);
      })
      .catch(() => {
        setComments([]);
        setPage(0);
      });
  }, [sortType]);

  // 클라이언트 사이드 페이지네이션
  const totalPages = Math.max(1, Math.ceil(comments.length / ITEMS_PER_PAGE));
  const currentComments = comments.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="mypage-list default-root-value">
      <Helmet>
        <title>내 댓글 | 하이틴데이</title>
      </Helmet>

      <div className="mypage-list__head">
        <h1 className="mypage-list__title">작성한 댓글</h1>
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="mypage-list__sort"
        >
          <option value="RECENT">최신순</option>
          <option value="LIKE">좋아요순</option>
        </select>
      </div>

      <Card flush>
        {comments.length === 0 ? (
          <EmptyState message="댓글이 없습니다." />
        ) : (
          <ul className="mypage-list__rows">
            {currentComments.map((comment) => (
              <li key={comment.id}>
                <button
                  type="button"
                  className="mypage-list__row"
                  onClick={() => navigate(`/board/post/${comment.postId}`)}
                >
                  <span className="mypage-list__row-main">
                    <span className="mypage-list__row-title">
                      {comment.content}
                    </span>
                    <span className="mypage-list__row-meta">
                      <span>{comment.author || "-"}</span>
                      <span aria-hidden="true">·</span>
                      <span>{comment.createdAt.slice(0, 10)}</span>
                    </span>
                  </span>
                  <span className="mypage-list__row-stat">
                    좋아요 {comment.likeCount ?? 0}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

export default MyCommentsPage;
