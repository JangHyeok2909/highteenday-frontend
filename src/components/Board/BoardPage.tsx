import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { PenSquare, ChevronDown, Search } from "lucide-react";
import { PostPreview, pickList, pickTotal } from "../../types/models";
import { BOARD_NAME_MAP } from "../../constants/boards";
import { formatBoardPreviewDate } from "../../utils/dateFormat";
import { Button, Card, EmptyState, Pagination } from "../ui";
import "./BoardPage.css";

const POSTS_PER_PAGE = 10;

type SortField = "date" | "views" | "likes";
type SearchType = "TITLE" | "CONTENT" | "TITLE_CONTENT";

const SORT_LABELS: Record<SortField, string> = {
  date: "최신순",
  likes: "좋아요순",
  views: "조회수순",
};

const getSortType = (field: SortField): string => {
  if (field === "views") return "VIEW";
  if (field === "likes") return "LIKE";
  return "RECENT";
};

export default function BoardPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const boardKey = parseInt(boardId ?? "", 10);
  const boardName = BOARD_NAME_MAP[boardKey] || "게시판";

  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [page, setPage] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);

  // 커서 스택 (ref → 항상 최신값, stale closure 없음)
  // cursorStack[N] = 페이지 N 을 요청할 때 보낼 lastSeedId
  //   cursorStack[0] = undefined  (첫 페이지는 커서 없이 요청)
  //   cursorStack[N] = 페이지 N-1 의 마지막 게시글 id
  const cursorStack = useRef<(number | undefined)[]>([undefined]);

  // 정렬
  const [sortField, setSortField] = useState<SortField>("date");
  const sortFieldRef = useRef<SortField>("date");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // 검색
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("TITLE_CONTENT");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const safeTotalPages = Math.max(1, totalPages);

  // 현재 페이지를 ref로 추적 (isRandomPage 판별용)
  const currentPageRef = useRef(0);

  const fetchPosts = async (targetPage: number) => {
    try {
      const sortType = getSortType(sortFieldRef.current);
      const lastSeedId = cursorStack.current[targetPage];

      // 바로 인접한 페이지(±1) 이동일 때만 false, 그 외(첫 로드·점프 등) 전부 true
      const pageDiff = Math.abs(targetPage - currentPageRef.current);
      const isRandomPage = pageDiff !== 1;

      const params: Record<string, unknown> = {
        page: targetPage,
        size: POSTS_PER_PAGE,
        sortType,
        randomPage: isRandomPage,
      };
      if (lastSeedId != null) params.lastSeedId = lastSeedId;

      const res = await axios.get(`/api/boards/${boardId}/posts`, {
        params,
        withCredentials: true,
      });

      const list = pickList<PostPreview>(res.data);
      setPosts(list);
      setTotalPosts(pickTotal(res.data, list.length));

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

  const fetchSearch = async (query: string | null, pageNum: number) => {
    const q = (query ?? searchQuery).trim();
    if (!q) return;
    try {
      const res = await axios.get("/api/posts/search", {
        params: { query: q, page: pageNum, searchType },
        withCredentials: true,
      });
      const list = pickList<PostPreview>(res.data);
      setPosts(list);
      setTotalPosts(pickTotal(res.data, list.length));
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

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = searchQuery.trim();
    setPage(0);
    setIsSearchMode(!!q);
    if (q) {
      fetchSearch(q, 0);
    } else {
      fetchPosts(0);
    }
  };

  const handleSort = (field: SortField) => {
    sortFieldRef.current = field;
    setSortField(field);
    // 정렬 변경 시 커서 스택·현재 페이지 ref 초기화
    cursorStack.current = [undefined];
    currentPageRef.current = 0;
    setPage(0);
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!sortRef.current) return;
      if (!sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
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
      <Helmet>
        <title>{boardName} | 하이틴데이</title>
      </Helmet>

      <div className="board-page__head">
        <h1 className="board-page__title">{boardName}</h1>
        <div className="board-page__toolbar">
          <div className="board-sort" ref={sortRef}>
            <button
              type="button"
              className="board-sort__trigger"
              onClick={() => setSortOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
            >
              {SORT_LABELS[sortField]}
              <ChevronDown
                size={14}
                className={`board-sort__caret ${sortOpen ? "board-sort__caret--open" : ""}`}
              />
            </button>

            {sortOpen && (
              <div className="board-sort__menu" role="listbox" aria-label="정렬 선택">
                {(Object.keys(SORT_LABELS) as SortField[]).map((field) => (
                  <button
                    key={field}
                    type="button"
                    className={`board-sort__item ${
                      sortField === field ? "board-sort__item--active" : ""
                    }`}
                    onClick={() => {
                      handleSort(field);
                      setSortOpen(false);
                    }}
                    role="option"
                    aria-selected={sortField === field}
                  >
                    {SORT_LABELS[field]}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={() => navigate("/post/write", { state: { boardId } })}
          >
            <PenSquare size={15} /> 글쓰기
          </Button>
        </div>
      </div>

      <Card flush className="board-page__list-card">
        {posts.length > 0 ? (
          <ul className="board-list">
            {posts.map((post) => (
              <li key={post.id}>
                <Link to={`/board/post/${post.id}`} className="board-list__row">
                  <div className="board-list__main">
                    <span className="board-list__title">
                      {post.title}
                      {(post.commentCount ?? 0) > 0 && (
                        <span className="board-list__comments">
                          [{post.commentCount}]
                        </span>
                      )}
                    </span>
                    <div className="board-list__meta">
                      <span>{post.anonymous ? "익명" : post.author ?? "-"}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatBoardPreviewDate(post.createdAt)}</span>
                    </div>
                  </div>
                  <div className="board-list__stats">
                    <span>조회 {post.viewCount ?? 0}</span>
                    <span>좋아요 {post.likeCount ?? 0}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message="게시글이 없습니다." />
        )}
      </Card>

      <Pagination page={page} totalPages={safeTotalPages} onChange={setPage} />

      <form className="board-search" onSubmit={handleSearch}>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as SearchType)}
          className="board-search__type"
        >
          <option value="TITLE">제목</option>
          <option value="CONTENT">본문</option>
          <option value="TITLE_CONTENT">제목+본문</option>
        </select>
        <input
          name="searchQuery"
          type="text"
          placeholder="검색어를 입력하세요"
          className="board-search__input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="submit" size="md">
          <Search size={15} /> 검색
        </Button>
      </form>
    </div>
  );
}
