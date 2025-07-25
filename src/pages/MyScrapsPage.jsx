import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyPageList.css";

function MyScrapsPage() {
  const [scraps, setScraps] = useState([]);
  const [sortType, setSortType] = useState("RECENT");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/mypage/scraps", {
      params: { page: 1  },//sortType
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
        <p>📭 스크랩한 게시글이 없습니다.</p>
      ) : (
        <ul className="list">
          {scraps.map((scrap, idx) => (
            <li key={scrap.id} onClick={() => navigate(`/post/${scrap.id}`)}>
              <span className="title">{scrap.title}</span>
              <span className="date">{scrap.createdAt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyScrapsPage;

