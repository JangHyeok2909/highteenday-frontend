// 스크랩, 포스트, 작성글 컴포넌트 1개로 통일화 필요

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyPageList.css";

function MyCommentsPage() {
  const [comments, setComments] = useState([]);
  const [sortType, setSortType] = useState("RECENT");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/mypage/comments', {
        params: { page: 0, sortType },
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data.commentDtos;
        if (sortType === "RECENT") {
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortType === "LIKE") {
          
        }
        setComments(data);
      })

  }, [sortType]);

  return (
    <div id="mypage-list">
      <h2>🗨️ 내가 쓴 댓글</h2>
      <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
        <option value="RECENT">최신순</option>
        <option value="LIKE">좋아요순</option>
      </select>

      {comments.length === 0 ? (
        <p>🫥 댓글이 없습니다.</p>
      ) : (
        <ul className="post-list">
          <li className="list-header">
            <span className="title">내용</span>
            <span className="date">작성일</span>
            <span className="views">좋아요</span>
          </li>
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="post-item"
              onClick={() => navigate(`/board/post/${comment.postId}`)}
            >
              <span className="title">{comment.content}</span>

              <span className="date">{comment.createdAt.slice(0, 10)}</span>
              <span className="views">{comment.likeCount ?? "-"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyCommentsPage;
