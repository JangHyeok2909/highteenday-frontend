import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyPageList.css";

function MyCommentsPage() {
  const [comments, setComments] = useState([]);
  const [sortType, setSortType] = useState("RECENT");
  const navigate = useNavigate();

  useEffect(() => {
     // 실제 서버 요청이 안되므로 더미 데이터로 대체
    //const mockComments = [
    //  {
    //    id: 1,
    //    postId: 101,
    //    content: "테스트 댓글입니다.",
    //    author: "망고",
    //    createdAt: "2025-07-28T15:32:00",
    //    viewCount: 123,
    //  },
    //  {
    //    id: 2,
    //    postId: 102,
    //    content: "두 번째 댓글도 테스트용!",
    //    author: "망고2",
    //    createdAt: "2025-07-27T10:15:00",
    //    viewCount: 55,
    //  },
    //];
    //setComments(mockComments);
    axios.get('/api/mypage/comments', {
      params: { page: 0, sortType },
      withCredentials: true,
    }).then(res => setComments(res.data.commentDtos));
  }, [sortType]);

  return (
    <div className="list-page-container">
      <h2>🗨️ 내가 쓴 댓글</h2>
      <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
        <option value="RECENT">최신순</option>
        <option value="LIKE">좋아요순</option>
        <option value="VIEW">조회수순</option>
      </select>

      {comments.length === 0 ? (
        <p>🫥 댓글이 없습니다.</p>
      ) : (
        <ul className="post-list">
          <li className="list-header">
            <span className="title">내용</span>
            <span className="author">작성자</span>
            <span className="date">작성일</span>
            <span className="views">조회수</span>
          </li>
          {comments.map((comment) => (
            <li key={comment.id} className="post-item" onClick={() => navigate(`/post/${comment.postId}`)}>
              <span className="title">{comment.content}</span>
              <span className="author">{comment.author || "-"}</span>
              <span className="date">{comment.createdAt.slice(0, 10)}</span>
              <span className="views">{comment.viewCount || "-"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyCommentsPage;
