import React from "react";
import BoardPreviewFree from "./BoardPreview/BoardPreviewFree";
import BoardPreviewExam from "./BoardPreview/BoardPreviewExam";
import BoardPreviewScience from "./BoardPreview/BoardPreviewScience";
import BoardPreviewLiberal from "./BoardPreview/BoardPreviewLiberal";
import "../../../Default.css";
import "./BoardSection.css";
import BoardPreview from "./BoardPreview/BoardPreview";

function BoardSection() {
  return (
    <div id="board-over-view">
      <div className="board-container">
        <BoardPreview boardId="1" />
        <BoardPreview boardId="2" />
        <BoardPreview boardId="3" />
        <BoardPreview boardId="4" />
      </div>
    </div>
  );
}
export default BoardSection;