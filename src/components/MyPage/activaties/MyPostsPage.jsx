import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyPageList.css";

function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [sortType, setSortType] = useState("RECENT");
  const [currentPage, setCurrentPage] = useState(1); // ✅ 현재 페이지 상태 추가
  const itemsPerPage = 10; // ✅ 한 페이지당 10개
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/mypage/posts", {
        params: { page: 0, sortType },
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data.postDtos;
        if (sortType === "RECENT") {
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortType === "VIEW") {
          data.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        } else if (sortType === "LIKE") {
          // 좋아요 정렬 (추후 필요 시 구현)
        }
        setPosts(data);
        setCurrentPage(1); // ✅ 정렬 변경 시 첫 페이지로 초기화
      });
  }, [sortType]);

  // ✅ 페이지네이션 계산
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div id="mypage-list">
      <h2>내가 쓴 게시글</h2>
      <select
        value={sortType}
        onChange={(e) => setSortType(e.target.value)}
        className="sort-select"
      >
        <option value="RECENT">최신순</option>
        <option value="LIKE">좋아요순</option>
        <option value="VIEW">조회순</option>
      </select>

      {posts.length === 0 ? (
        <p>✏️ 게시글이 없습니다.</p>
      ) : (
        <>
          <ul className="post-List">
            <li className="list-header">
              <span className="title">제목</span>
              <span className="author">작성자</span>
              <span className="date">작성일</span>
              <span className="views">조회수</span>
            </li>
            {currentPosts.map((post) => (
              <li
                key={post.id}
                className="post-item"
                onClick={() => navigate(`/board/post/${post.id}`)}
              >
                <span className="title">{post.title}</span>
                <span className="author">{post.author}</span>
                <span className="date">{post.createdAt.slice(0, 10)}</span>
                <span className="views">{post.viewCount ?? "-"}</span>
              </li>
            ))}
          </ul>

          {/* ✅ 페이지네이션 */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              &laquo;
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MyPostsPage;
