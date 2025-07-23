import React, { useEffect, useState } from "react";
import axios from "axios";
import BoardSection from "../components/BoardSection";
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
          console.error(`게시판 ${id} API 오류`, error);
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
        <Link to={`/board/${board.id}`} key={board.id} className="board-box">
          <BoardSection
            boardName={board.boardName}
            posts={board.posts}
            isBoardPage={false}
          />
        </Link>
      ))}
    </div>
  );
}
