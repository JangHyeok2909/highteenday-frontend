import React from "react";
import "../../../Default.css";
import {
  BoardPreviewFree,
  BoardPreviewExam,
  BoardPreviewScience,
  BoardPreviewLiberal,
} from "./BoardPreview/BoardPreview";
import "./BoardSection.css";

function BoardSection() {
  return (
    <div className="board-section">
      <BoardPreviewFree />
      <BoardPreviewExam />
      <BoardPreviewScience />
      <BoardPreviewLiberal />
    </div>
  );
}

export default BoardSection;
