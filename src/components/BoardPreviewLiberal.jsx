import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./BoardOverview.css";

export default function BoardPreviewLiberal() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("/api/boards/4/posts", {
        params: { page: 0, sortType: "RECENT" },
        withCredentials: true,
      })
      .then((res) => {
        console.log("문과게시판 응답:", res.data);
        setPosts(res.data.postDtos || []);
      })
      .catch((err) => {
        console.error("문과게시판 불러오기 실패:", err);
        setPosts([]);
      });
  }, []);

  return (
    <div className="board-block">
      <div className="board-header">
        <h3 className="board-name">문과게시판</h3>
        <Link to="/board/4" className="view-all-btn">전체보기</Link>
      </div>
      <ul className="post-list">
        {posts.length > 0 ? (
          posts.slice(0, 4).map((post) => (
            <li key={post.id} className="post-item">
              <Link to={`/board/4/post/${post.id}`} className="post-link">
                <span className="post-title">{post.title}</span>
                <span className="post-time">{formatDate(post.createdAt)}</span>
              </Link>
            </li>
          ))
        ) : (
          <li className="post-item">게시글이 없습니다.</li>
        )}
      </ul>
    </div>
  );
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
