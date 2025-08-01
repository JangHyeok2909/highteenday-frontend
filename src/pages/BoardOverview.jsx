// src/pages/BoardOverview.jsx
import React from "react";
import BoardPreviewFree from "../components/BoardPreviewFree";
import BoardPreviewExam from "../components/BoardPreviewExam";
import BoardPreviewScience from "../components/BoardPreviewScience";
import BoardPreviewLiberal from "../components/BoardPreviewLiberal";

import "./BoardOverview.css";

export default function BoardOverview() {
  return (
    <div className="board-container">
      <BoardPreviewFree />
      <BoardPreviewExam />
      <BoardPreviewScience />
      <BoardPreviewLiberal />
    </div>
  );
}
