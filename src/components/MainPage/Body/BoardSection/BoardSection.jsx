import React, { useEffect, useState } from "react";
import "../../../Default.css";
import axios from "axios";
import   BoardPreview from "./BoardPreview/BoardPreview";
import "./BoardSection.css";

function BoardSection() {
  const [boards, setBoards] = useState([]);
  
  useEffect(() => {
   const fetchBoards = async () => {
      try {
        const res = await axios.get(`/api/boards`, {
          withCredentials: true,
        });
        setBoards(res.data);
      } catch (err) {
        setBoards([]);
      }
    };  

    fetchBoards();
  }, []);
  

  return (
    <div className="board-section">
      {boards.map((board, idx) => (
        <BoardPreview
          key={idx}
          boardId={board.boardId}
          boardName={board.boardName}
        />
      ))}
    </div>
  );
}

export default BoardSection;
