import React from "react";
import "../../../Default.css";
import BoardPreview from "./BoardPreview/BoardPreview";
import "./BoardSection.css";

const BOARDS = [
  { boardId: 1, boardName: "자유게시판" },
  { boardId: 2, boardName: "수능게시판" },
  { boardId: 3, boardName: "이과게시판" },
  { boardId: 4, boardName: "문과게시판" },
];

function BoardSection() {
  return (
    <div className="board-section">
      {BOARDS.map((board) => (
        <BoardPreview
          key={board.boardId}
          boardId={board.boardId}
          boardName={board.boardName}
        />
      ))}
    </div>
  );
}

export default BoardSection;
