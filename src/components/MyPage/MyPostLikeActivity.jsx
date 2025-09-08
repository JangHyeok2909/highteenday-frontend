import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyPageList.css";

function MyPostLikeActivity({ type }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [sortType, setSortType] = useState("RECENT");
  const [page, setPage] = useState(0);            // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수

  const typeMap = {
    posts: { title: "작성한 게시글", endpoint: "/api/mypage/posts" },
    scraps: { title: "스크랩한 글", endpoint: "/api/mypage/scraps" },
  };

  useEffect(() => {
    axios
      .get(typeMap[type].endpoint, {
        params: { page, sortType },   // ✅ 백엔드에서 페이징 지원
        withCredentials: true,
      })
      .then((res) => {
        setData(res.data.postDtos || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => console.error(`${typeMap[type].title} 불러오기 실패:`, err));
  }, [type, sortType, page]);

  return (
    <div id="mypage-list" className="list-page-container">
      <h2>{typeMap[type].title}</h2>

      <select
        value={sortType}
        onChange={(e) => setSortType(e.target.value)}
        className="sort-select"
      >
        <option value="RECENT">최신순</option>
        <option value="LIKE">좋아요순</option>
        <option value="VIEW">조회수순</option>
      </select>

      {data.length === 0 ? (
        <p>데이터가 없습니다.</p>
      ) : (
        <ul className="post-list">
          <li className="list-header">
            <span className="title">제목</span>
            <span className="author">작성자</span>
            <span className="date">작성일</span>
            <span className="views">조회수</span>
          </li>
          {data.map((item) => (
            <li
              key={item.id}
              className="post-item"
              onClick={() => navigate(`/board/post/${item.id}`)}
            >
              <span className="title">{item.title}</span>
              <span className="author">{item.author}</span>   {/* ✅ Swagger에 있음 */}
              <span className="date">{item.createdAt?.slice(0, 10)}</span>
              <span className="views">{item.viewCount ?? 0}</span>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ 페이지네이션 */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={i === page ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MyPostLikeActivity;
