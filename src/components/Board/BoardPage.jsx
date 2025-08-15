import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./BoardPage.css";
import Header from "../Header/Header";

const POSTS_PER_PAGE = 10;

export default function BoardPage() {
  const { boardId } = useParams();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [boardName, setBoardName] = useState(""); // ← 서버에서 받은 게시판 이름
  const [sortType, setSortType] = useState("RECENT");

  axios.get(`/api/boards/${boardId}/posts`, {
    params: { page, sortType },
  });


  useEffect(() => {
    setPage(0); // board 바뀌면 1페이지로
    setIsInitialLoad(false);
  }, [boardId]);

  useEffect(() => {
    if (isInitialLoad) return;

    const fetchPosts = async () => {
      try {
        const res = await axios.get(`/api/boards/${boardId}/posts`, {
         params: {
          page,
          size: 10, // ✅ 이거 추가!!
          sortType: "RECENT",
        },
          withCredentials: true,
        });

        const { postDtos, boardName } = res.data;
        setPosts(Array.isArray(postDtos) ? postDtos : []);
        setBoardName(boardName || `${boardId} 게시판`);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        setPosts([]);
        setBoardName(`${boardId} 게시판`);
      }
    };

    fetchPosts();
  }, [page, boardId, isInitialLoad]);

  return (
    <div id="board-page" className="default-root-value">   
      <div className="header">
        <Header isMainPage={false} />
      </div>
      <div className="board-page-container">
        <h2>{boardName}</h2>

        <ul className="post-list">
          {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
              <li key={post.id} className="post-item">
                <Link to={`/board/${boardId}/post/${post.id}`}>
                  <span className="post-title">{post.title}</span>
                  <span className="post-time">
                    {new Date(post.createdAt).toLocaleString("ko-KR", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                </Link>
              </li>
            ))
          ) : (
            <li className="post-item">게시글이 없습니다.</li>
          )}
        </ul>

        <div className="pagination">
          <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>
            이전
          </button>
          <span>{page + 1} 페이지</span>
          <button onClick={() => setPage((p) => p + 1)}>다음</button>
        </div>
      </div>
    </div>
  );
}
