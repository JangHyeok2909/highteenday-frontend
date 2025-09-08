import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "../Header/MainHader/Header";
import "./BoardPage.css";

const POSTS_PER_PAGE = 10;

// 게시판 이름 매핑
const boardNameMap = {
  1: "자유게시판",
  2: "수능게시판",
  3: "이과게시판",
  4: "문과게시판",
};

// sortType 변환 함수
const getSortType = (field) => {
  if (field === "date") return "RECENT";
  if (field === "views") return "VIEW";
  if (field === "likes") return "LIKE";
  return "RECENT";
};

export default function BoardPage() {
  const { boardId } = useParams();
  const boardKey = parseInt(boardId, 10);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  // ✅ 정렬 필드 + 정렬 순서
  const [sortField, setSortField] = useState("date"); // 기본 정렬: 최신순
  const [sortOrder, setSortOrder] = useState("DESC"); // ASC / DESC

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  const fetchPosts = async () => {
    try {
      const sortType = getSortType(sortField);

      const res = await axios.get(`/api/boards/${boardId}/posts`, {
        params: {
          page,
          size: POSTS_PER_PAGE,
          sortType,
        },
        withCredentials: true,
      });

      console.log("서버 응답:", res.data);

      const postList = res.data.postDtos || [];
      const total = res.data.totalElements || postList.length;

      setPosts(Array.isArray(postList) ? postList : []);
      setTotalPosts(total);
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
      setPosts([]);
      setTotalPosts(0);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [boardId, page, sortField, sortOrder]); // ✅ 정렬순서도 의존성에 추가

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder("desc"); // 무조건 내림차순
  };
  

  return (
    <div className="board-page default-root-value">
      <div className="header">
        <Header iMainPage={false} />
      </div>
  
      <div className="board-page-container">
        <h2>{boardNameMap[boardKey] || "게시판"}</h2>

        <div className="board-search">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="search-input"
          />
          <button className="search-btn">검색</button>
        </div>

  
        <table className="board-table">
          <thead>
            <tr>
              <th>제목</th>
  
              {/* 날짜 */}
              <th className="th-col">
                <span>날짜</span>
                <button
                  className="arrow-btn"
                  onClick={() => handleSort("date", "desc")}  
                >
                  ▼
                </button>
              </th>
  
              {/* 조회 */}
              <th className="th-col">
                <span>조회</span>
                <button
                  className="arrow-btn"
                  onClick={() => handleSort("views", "desc")}  
                >
                  ▼
                </button>
              </th>
  
              {/* 좋아요 */}
              <th className="th-col">
                <span>좋아요</span>
                <button
                  className="arrow-btn"
                  onClick={() => handleSort("likes", "desc")}  
                >
                  ▼
                </button>
              </th>
            </tr>
          </thead>
  
          <tbody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id}>
                  <td className="title-cell">
                    <Link
                      to={`/boards/${boardId}/posts/${post.id}`}
                      className="post-link"
                    >
                      {post.title}
                    </Link>
                    <span className="comment-count">
                      ({post.commentCount || 0})
                    </span>
                  </td>
                  <td>
                    {new Date(post.createdAt).toLocaleString("ko-KR", {
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td>{post.viewCount}</td>
                  <td>{post.likeCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-posts">
                  게시글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
  

        {/* 페이지네이션 */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              className={`page-btn ${page === idx ? "active" : ""}`}
              onClick={() => setPage(idx)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
