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

  // 커서 스택 (ref → 항상 최신값, stale closure 없음)
  // cursorStack[N] = 페이지 N 을 요청할 때 보낼 lastSeedId
  //   cursorStack[0] = undefined  (첫 페이지는 커서 없이 요청)
  //   cursorStack[N] = 페이지 N-1 의 마지막 게시글 id
  const cursorStack = useRef([undefined]);

  // 정렬
  const [sortField, setSortField] = useState("date");
  const sortFieldRef = useRef("date");
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

  // 현재 페이지를 ref로 추적 (isRandomPage 판별용)
  const currentPageRef = useRef(0);

  const fetchPosts = async (targetPage) => {
    try {
      const sortType = getSortType(sortFieldRef.current);
      const lastSeedId = cursorStack.current[targetPage];

      // 바로 인접한 페이지(±1) 이동일 때만 false, 그 외(첫 로드·점프 등) 전부 true
      const pageDiff = Math.abs(targetPage - currentPageRef.current);
      const isRandomPage = pageDiff !== 1;

      const params = { page: targetPage, size: POSTS_PER_PAGE, sortType, randomPage: isRandomPage };
      if (lastSeedId != null) params.lastSeedId = lastSeedId;

      const res = await axios.get(`/api/boards/${boardId}/posts`, {
        params,
        withCredentials: true,
      });

      const postList =
        res.data.content ??
        res.data.postPreviewDtos ??
        res.data.postDtos ??
        [];
      const total =
        res.data.total ??
        res.data.totalElements ??
        postList.length;

      const list = Array.isArray(postList) ? postList : [];
      setPosts(list);
      setTotalPosts(total);

      // 현재 페이지 ref 업데이트
      currentPageRef.current = targetPage;

      // 다음 페이지 커서 저장 (아직 없을 때만 → 이미 방문한 페이지면 유지)
      if (list.length > 0 && cursorStack.current[targetPage + 1] == null) {
        cursorStack.current[targetPage + 1] = list[list.length - 1].id;
      }
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
      setPosts([]);
      setTotalPosts(0);
    }
  };

  const fetchSearch = async (query, pageNum) => {
    const q = (query ?? searchQuery).trim();
    if (!q) return;
    try {
      const res = await axios.get("/api/posts/search", {
        params: { query: q, page: pageNum, searchType },
        withCredentials: true,
      });
      const postList =
        res.data.content ??
        res.data.postPreviewDtos ??
        res.data.postDtos ??
        [];
      const total =
        res.data.total ??
        res.data.totalElements ??
        postList.length;
      setPosts(Array.isArray(postList) ? postList : []);
      setTotalPosts(total);
    } catch (err) {
      console.error("검색 실패:", err);
      setPosts([]);
      setTotalPosts(0);
    }
  };

  // boardId 변경 → 커서 스택·페이지 초기화
  useEffect(() => {
    cursorStack.current = [undefined];
    currentPageRef.current = 0;
    setPage(0);
  }, [boardId]);

  useEffect(() => {
    if (isSearchMode && searchQuery.trim()) {
      fetchSearch(searchQuery, page);
    } else {
      fetchPosts(page);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, page, sortField, isSearchMode, searchType]);

  const goToPage = (targetPage) => {
    setPage(targetPage);
  };

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
      fetchPosts(0);
    }
  };

  const handleSort = (field) => {
    sortFieldRef.current = field;
    setSortField(field);
    // 정렬 변경 시 커서 스택·현재 페이지 ref 초기화
    cursorStack.current = [undefined];
    currentPageRef.current = 0;
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
                  <td>{post.anonymous ? "익명" : (post.author ?? "-")}</td>
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
          {/* << : 10페이지 뒤로 */}
          <button
            type="button"
            className="page-btn"
            onClick={() => goToPage(Math.max(0, page - pageBlockSize))}
            disabled={page === 0}
            aria-label="10페이지 이전"
            title="10페이지 이전"
          >
            «
          </button>
          {/* < : 1페이지 뒤로 */}
          <button
            type="button"
            className="page-btn"
            onClick={() => goToPage(Math.max(0, page - 1))}
            disabled={page === 0}
            aria-label="이전 페이지"
            title="이전 페이지"
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
                onClick={() => goToPage(idx)}
              >
                {idx + 1}
              </button>
            );
          })}

          {/* > : 1페이지 앞으로 */}
          <button
            type="button"
            className="page-btn"
            onClick={() => goToPage(Math.min(safeTotalPages - 1, page + 1))}
            disabled={page >= safeTotalPages - 1}
            aria-label="다음 페이지"
            title="다음 페이지"
          >
            ›
          </button>
          {/* >> : 10페이지 앞으로 */}
          <button
            type="button"
            className="page-btn"
            onClick={() => goToPage(Math.min(safeTotalPages - 1, page + pageBlockSize))}
            disabled={page >= safeTotalPages - 1}
            aria-label="10페이지 다음"
            title="10페이지 다음"
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
