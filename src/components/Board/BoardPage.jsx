import React, { useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const boardKey = parseInt(boardId, 10);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  // ✅ 정렬 필드 + 정렬 순서
  const [sortField, setSortField] = useState("date");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  // 검색
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("TITLE_CONTENT");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const pageBlockSize = 10;
  const safeTotalPages = Math.max(1, totalPages);
  const currentBlock = Math.floor(page / pageBlockSize);
  const startPage = currentBlock * pageBlockSize;
  const endPage = Math.min(startPage + pageBlockSize - 1, safeTotalPages - 1);

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

      const postList = res.data.postPreviewDtos ?? res.data.postDtos ?? [];
      const total = res.data.totalElements ?? postList.length;

      setPosts(Array.isArray(postList) ? postList : []);
      setTotalPosts(total);
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
      setPosts([]);
      setTotalPosts(0);
    }
  };

  const fetchSearch = async (query, pageNum = page) => {
    const q = (query ?? searchQuery).trim();
    if (!q) return;
    try {
      const res = await axios.get("/api/posts/search", {
        params: {
          query: q,
          page: pageNum,
          searchType,
        },
        withCredentials: true,
      });
      const postList = res.data.postPreviewDtos ?? res.data.postDtos ?? res.data.content ?? [];
      const total = res.data.totalElements ?? res.data.total ?? postList.length;
      setPosts(Array.isArray(postList) ? postList : []);
      setTotalPosts(total);
    } catch (err) {
      console.error("검색 실패:", err);
      setPosts([]);
      setTotalPosts(0);
    }
  };

  useEffect(() => {
    if (isSearchMode && searchQuery.trim()) {
      fetchSearch(searchQuery, page);
    } else {
      fetchPosts();
    }
  }, [boardId, page, sortField, isSearchMode, searchType]);

  const handleSearch = (e) => {
    e?.preventDefault();
    const form = e?.target;
    const q = (form?.querySelector('input[name="searchQuery"]')?.value ?? searchQuery ?? "").trim();
    setSearchQuery(q);
    setPage(0);
    setIsSearchMode(!!q);
    if (q) {
      fetchSearch(q, 0);
    } else {
      fetchPosts();
    }
  };

  const handleSort = (field) => {
    // 백엔드가 내림차순만 지원하므로, 정렬 조건만 바꿔서 다시 조회
    setSortField(field);
    setPage(0);
  };

  const sortLabel =
    sortField === "views"
      ? "조회수순"
      : sortField === "likes"
        ? "좋아요순"
        : "최신순";

  useEffect(() => {
    const onDocClick = (e) => {
      if (!sortRef.current) return;
      if (!sortRef.current.contains(e.target)) setSortOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSortOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);
  

  return (
    <div className="board-page default-root-value">
      <div className="header">
        <Header iMainPage={false} />
      </div>
  
      <div className="board-page-container">
        <h2>{boardNameMap[boardKey] || "게시판"}</h2>

        <div className="board-toolbar">
          <div className="board-toolbar-left">
            <div className="sort-dropdown" ref={sortRef}>
              <button
                type="button"
                className="sort-trigger"
                onClick={() => setSortOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
              >
                {sortLabel}
                <span className={`sort-caret ${sortOpen ? "open" : ""}`}>▾</span>
              </button>

              {sortOpen && (
                <div className="sort-menu" role="listbox" aria-label="정렬 선택">
                  <button
                    type="button"
                    className={`sort-item ${sortField === "date" ? "active" : ""}`}
                    onClick={() => {
                      handleSort("date");
                      setSortOpen(false);
                    }}
                    role="option"
                    aria-selected={sortField === "date"}
                  >
                    최신순
                  </button>
                  <button
                    type="button"
                    className={`sort-item ${sortField === "likes" ? "active" : ""}`}
                    onClick={() => {
                      handleSort("likes");
                      setSortOpen(false);
                    }}
                    role="option"
                    aria-selected={sortField === "likes"}
                  >
                    좋아요순
                  </button>
                  <button
                    type="button"
                    className={`sort-item ${sortField === "views" ? "active" : ""}`}
                    onClick={() => {
                      handleSort("views");
                      setSortOpen(false);
                    }}
                    role="option"
                    aria-selected={sortField === "views"}
                  >
                    조회수순
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="board-toolbar-right">
            <button
              type="button"
              className="write-btn"
              onClick={() => navigate("/post/write", { state: { boardId } })}
            >
              글쓰기
            </button>
          </div>
        </div>

  
        <table className="board-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>작성자</th>
              <th>날짜</th>
              <th>조회</th>
              <th>좋아요</th>
            </tr>
          </thead>
  
          <tbody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id}>
                  <td className="title-cell">
                    <Link
                      to={`/board/post/${post.id}`}
                      className="post-link"
                    >
                      {post.title}
                    </Link>
                    <span className="comment-count">
                      ({post.commentCount || 0})
                    </span>
                  </td>
                  <td>{post.author ?? "-"}</td>
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
                <td colSpan="5" className="no-posts">
                  게시글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
  

        {/* 페이지네이션 */}
        <div className="pagination">
          <button
            type="button"
            className="page-btn"
            onClick={() => setPage(0)}
            disabled={page === 0}
            aria-label="맨앞"
            title="맨앞"
          >
            «
          </button>
          <button
            type="button"
            className="page-btn"
            onClick={() => setPage(Math.max(0, startPage - pageBlockSize))}
            disabled={startPage === 0}
            aria-label="이전 10페이지"
            title="이전 10페이지"
          >
            ‹
          </button>

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
            const idx = startPage + i;
            return (
              <button
                key={idx}
                type="button"
                className={`page-btn ${page === idx ? "active" : ""}`}
                onClick={() => setPage(idx)}
              >
                {idx + 1}
              </button>
            );
          })}

          <button
            type="button"
            className="page-btn"
            onClick={() => setPage(Math.min(safeTotalPages - 1, startPage + pageBlockSize))}
            disabled={endPage >= safeTotalPages - 1}
            aria-label="다음 10페이지"
            title="다음 10페이지"
          >
            ›
          </button>
          <button
            type="button"
            className="page-btn"
            onClick={() => setPage(safeTotalPages - 1)}
            disabled={page >= safeTotalPages - 1}
            aria-label="맨뒤"
            title="맨뒤"
          >
            »
          </button>
        </div>

        {/* 게시글 검색 (하단) */}
        <form className="board-search-bottom" onSubmit={handleSearch}>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-type-select"
          >
            <option value="TITLE">제목</option>
            <option value="CONTENT">본문</option>
            <option value="TITLE_CONTENT">제목+본문</option>
          </select>
          <input
            name="searchQuery"
            type="text"
            placeholder="검색어를 입력하세요"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            검색
          </button>
        </form>
      </div>
    </div>
  );
}
