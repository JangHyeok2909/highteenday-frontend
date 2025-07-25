import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyPageList.css";

function MyCommentsPage() {
  const [comments, setComments] = useState([]);
  const [sortType, setSortType] = useState("RECENT");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/mypage/comments", {
      params: { page: 1  },//sortType
      withCredentials: true,
    }).then(res => setComments(res.data.commentDtos));
  }, [sortType]);

  return (
    <div className="list-page-container">
      <h2>💬 내가 쓴 댓글</h2>
      <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
        <option value="RECENT">최신순</option>
        <option value="LIKE">좋아요순</option>
        <option value="VIEW">조회수순</option>
      </select>

      {comments.length === 0 ? (
        <p>📭 댓글이 없습니다.</p>
      ) : (
        <ul className="list">
          {comments.map((comment, idx) => (
            <li key={comment.id} onClick={() => navigate(`/post/${comment.postId}`)}>
              <span className="title">{comment.content}</span>
              <span className="date">{comment.createdAt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyCommentsPage;
