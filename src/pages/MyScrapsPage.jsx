import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyPageList.css";

function MyScrapsPage() {
  const [scraps, setScraps] = useState([]);
  const [sortType, setSortType] = useState("RECENT");
  const navigate = useNavigate();

  useEffect(() => {
     // 서버 대신 더미 데이터
    //const mockScraps = [
    //  {
    //    id: 1,
    //    title: "스크랩한 글 제목1",
    //    author: "작가A",
    //    createdAt: "2025-07-26T11:22:33",
    //    viewCount: 200,
    //  },
    //  {
    //    id: 2,
    //    title: "스크랩한 글 제목2",
    //    author: "작가B",
    //    createdAt: "2025-07-25T09:15:00",
    //    viewCount: 150,
    //  },
    //];
    //setScraps(mockScraps);

    axios.get('/api/mypage/scraps', {
      params: { page: 0, sortType },
      withCredentials: true,
    }).then(res => setScraps(res.data.postDtos));
  }, [sortType]);

  return (
    <div className="list-page-container">
      <h2>📌 스크랩한 게시글</h2>
      <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
        <option value="RECENT">최신순</option>
        <option value="LIKE">좋아요순</option>
        <option value="VIEW">조회수순</option>
      </select>

      {scraps.length === 0 ? (
        <p>🫥 스크랩한 게시글이 없습니다.</p>
      ) : (
        <ul className="post-list">
          <li className="list-header">
            <span className="title">제목</span>
            <span className="author">작성자</span>
            <span className="date">작성일</span>
            <span className="views">조회수</span>
          </li>
          {scraps.map((scrap) => (
            <li key={scrap.id} className="post-item" onClick={() => navigate(`/post/${scrap.id}`)}>
              <span className="title">{scrap.title}</span>
              <span className="author">{scrap.author || "-"}</span>
              <span className="date">{scrap.createdAt.slice(0, 10)}</span>
              <span className="views">{scrap.viewCount || "-"}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyScrapsPage;
