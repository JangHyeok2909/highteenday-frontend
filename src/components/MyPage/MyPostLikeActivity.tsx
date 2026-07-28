import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PostPreview } from "../../types/models";
import { Card, EmptyState, Pagination } from "../ui";
import "./MyPageList.css";

interface MyPostLikeActivityProps {
  type: "posts" | "scraps";
}

const TYPE_MAP = {
  posts: { title: "작성한 게시글", endpoint: "/api/mypage/posts" },
  scraps: { title: "스크랩한 글", endpoint: "/api/mypage/scraps" },
} as const;

function MyPostLikeActivity({ type }: MyPostLikeActivityProps) {
  const navigate = useNavigate();
  const [data, setData] = useState<PostPreview[]>([]);
  const [sortType, setSortType] = useState("RECENT");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios
      .get(TYPE_MAP[type].endpoint, {
        params: { page, sortType },
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.postPreviewDtos ?? res.data.postDtos ?? []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) =>
        console.error(`${TYPE_MAP[type].title} 불러오기 실패:`, err)
      );
  }, [type, sortType, page]);

  return (
    <div className="mypage-list default-root-value">
      <Helmet>
        <title>{TYPE_MAP[type].title} | 하이틴데이</title>
      </Helmet>

      <div className="mypage-list__head">
        <h1 className="mypage-list__title">{TYPE_MAP[type].title}</h1>
        <select
          value={sortType}
          onChange={(e) => {
            setSortType(e.target.value);
            setPage(0);
          }}
          className="mypage-list__sort"
        >
          <option value="RECENT">최신순</option>
          <option value="LIKE">좋아요순</option>
          <option value="VIEW">조회수순</option>
        </select>
      </div>

      <Card flush>
        {data.length === 0 ? (
          <EmptyState message="데이터가 없습니다." />
        ) : (
          <ul className="mypage-list__rows">
            {data.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="mypage-list__row"
                  onClick={() => navigate(`/board/post/${item.id}`)}
                >
                  <span className="mypage-list__row-main">
                    <span className="mypage-list__row-title">{item.title}</span>
                    <span className="mypage-list__row-meta">
                      <span>{item.author ?? "-"}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.createdAt?.slice(0, 10)}</span>
                    </span>
                  </span>
                  <span className="mypage-list__row-stat">
                    조회 {item.viewCount ?? 0}
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

export default MyPostLikeActivity;
