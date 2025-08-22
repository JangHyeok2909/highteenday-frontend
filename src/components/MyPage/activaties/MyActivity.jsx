// 스크랩, 포스트, 작성글 컴포넌트 1개로 통일화 필요
// 1개로 줄이는거 test 파일

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyPageList.css";

function MyActivity({myActivityType}) { // myActivityType = [ scraps, comments, posts ]
  const [data, setdata] = useState([]);
  const [sortType, setSortType] = useState("RECENT");
  const navigate = useNavigate();
  const type = {
    scraps: "스크랩",
    comments: "댓글",
    posts: "게시글"
  }

  useEffect(() => {
    axios.get(`/api/mypage/${myActivityType}`, {
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
          // 좋아요 정렬 없으면 생략
        }
        setdata(data);
      })

  }, [sortType]);

  return (
    <div id="my-activity">
      {/*  밑에 모든 내용 수정 예정  */}
      <div className="list-page-container">
        <h2>🗨️ 내가 쓴 {type[myActivityType]}</h2>
        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="RECENT">최신순</option>
          <option value="LIKE">좋아요순</option>
          <option value="VIEW">조회수순</option>
        </select>

        {data.length === 0 ? (
          <p>🫥 {type[myActivityType]}이 없습니다.</p>
        ) : (
          <ul className="post-list">
            <li className="list-header">
              <span className="title">내용</span>
              <span className="author">작성자</span>
              <span className="date">작성일</span>
              <span className="views">조회수</span>
            </li>
            {data.map((comment) => (
              <li
                key={comment.id}
                className="post-item"
                onClick={() => navigate(`/post/${comment.postId}`)}
              >
                <span className="title">{comment.content}</span>
                <span className="author">{comment.author || "-"}</span>
                <span className="date">{comment.createdAt.slice(0, 10)}</span>
                <span className="views">{comment.viewCount || "-"}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MyActivity;
