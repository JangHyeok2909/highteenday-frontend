import React, { useEffect, useState } from "react";
import axios from "axios";
import BoardSection from "../components/BoardSection";
import "./BoardOverview.css";
import { Link } from "react-router-dom";


export default function BoardOverview() {
  const [postsByBoard, setPostsByBoard] = useState({});

  // board 리스트
  const boardIds = [
    { id: 1, name: "자유게시판" },
    { id: 2, name: "비밀게시판" },
    { id: 3, name: "졸업생게시판" },
    { id: 4, name: "새내기게시판" },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      const results = {};
      for (const board of boardIds) {
        try {
          const res = await axios.get(
            `/api/boards/${board.id}/posts`,
            {
              params: {
                page: 0,
                sortType: "RECENT",
              },
            }
          );
          results[board.name] = res.data.postDtos || [];
        } catch (error) {
          console.error(`${board.name} API 오류`, error);
          results[board.name] = [];
        }
      }
      setPostsByBoard(results);
    };

    fetchPosts();
  }, []);

  return (
  <div className="board-container">
      {boardIds.map((board) => (
        <Link to={`/board/${board.id}`} key={board.id} className="board-box">
          <BoardSection boardName={board.name}
            posts={postsByBoard[board.name]}
            isBoardPage={false} // 게시글 안 보이게
          />

        </Link>
      ))}
    </div>
);

    
  
}
