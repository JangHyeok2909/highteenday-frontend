import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyPageList.css";

function MyCommentsPage() {
  const [comments, setComments] = useState([]);
  const [sortType, setSortType] = useState("RECENT");
  const [currentPage, setCurrentPage] = useState(1); // ✅ 현재 페이지 상태
  const itemsPerPage = 10; // ✅ 한 페이지에 10개씩
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/mypage/comments", {
        params: { page: 0, sortType },
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data.commentDtos;
        if (sortType === "RECENT") {
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortType === "LIKE") {
          data.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        }
        setComments(data);
        setCurrentPage(1); // ✅ 정렬 바꾸면 첫 페이지로 초기화
      });
  }, [sortType]);

  // ✅ 페이지네이션 계산
  const totalPages = Math.ceil(comments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentComments = comments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div id="mypage-list">
      <h2>💬 내가 쓴 댓글</h2>
      <select
        value={sortType}
        onChange={(e) => setSortType(e.target.value)}
        className="sort-select"
      >
        <option value="RECENT">최신순</option>
        <option value="LIKE">좋아요순</option>
      </select>

      {comments.length === 0 ? (
        <p>📭 댓글이 없습니다.</p>
      ) : (
        <>
          <ul className="post-list">
            <li className="list-header">
              <span className="title">내용</span>
              <span className="author">작성자</span>
              <span className="date">작성일</span>
              <span className="views">좋아요</span>
            </li>
            {currentComments.map((comment) => (
              <li
                key={comment.id}
                className="post-item"
                onClick={() => navigate(`/board/post/${comment.postId}`)}
              >
                <span className="title">{comment.content}</span>
                <span className="author">{comment.author || "-"}</span>
                <span className="date">{comment.createdAt.slice(0, 10)}</span>
                <span className="views">{comment.likeCount ?? "-"}</span>
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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

export default MyCommentsPage;
