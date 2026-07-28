import React from "react";
import BoardPreview from "./BoardPreview/BoardPreview";
import { BOARD_NAME_MAP } from "../../../../constants/boards";
import "./BoardSection.css";

function BoardSection() {
  return (
    <div className="board-section">
      {Object.entries(BOARD_NAME_MAP).map(([boardId, boardName]) => (
        <BoardPreview
          key={boardId}
          boardId={Number(boardId)}
          boardName={boardName}
        />
      ))}
    </div>
  );
}

export default BoardSection;
