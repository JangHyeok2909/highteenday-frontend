import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BoardOverview.css";
import { Link } from "react-router-dom";

export default function BoardOverview() {
  const [boardsData, setBoardsData] = useState([]);
  const boardIds = [1, 2, 3, 4];

  useEffect(() => {
    const fetchPosts = async () => {
      const results = [];
      for (const id of boardIds) {
        try {
          const res = await axios.get(`/api/boards/${id}/posts`, {
            params: {
              page: 0,
              sortType: "RECENT",
            },
          });
          const boardName = res.data.boardName || `게시판 ${id}`;
          const posts = res.data.postDtos || [];
          results.push({ id, boardName, posts });
        } catch (error) {
          console.error(`게시판 ${id} 오류`, error);
          results.push({ id, boardName: `게시판 ${id}`, posts: [] });
        }
      }
      setBoardsData(results);
    };

    fetchPosts();
  }, []);

  return (
  <div className="board-container">
    {boardsData.map((board) => (
      <div className="board-block" key={board.id}>
        <div className="board-header">
          <h3 className="board-name">{board.boardName}</h3>
          <Link to={`/board/${board.id}`} className="view-all-btn">전체보기</Link>
        </div>

        <ul className="post-list">
          {board.posts.slice(0, 4).map((post) => (
            <li key={post.id} className="post-item">
              <Link to={`/board/${board.id}/${post.id}`} className="post-link">
                <span className="post-title">{post.title}</span>
                <span className="post-time">{formatDate(post.createdAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
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

