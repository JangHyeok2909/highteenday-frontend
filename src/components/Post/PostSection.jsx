import React from "react";
import PostDetail from "./Post_Inner/PostDetail.jsx";
import CommentSection from "../CommentRelated/CommentSection.jsx";
import Header from "../Header/MainHader/Header";

function PostSection() {
  return (
    <div id="post-section" className="default-root-value">
      <div className="header">
        <Header isMainPage={false} />
      </div>
      <div className="post-container">
        <PostDetail />
      </div>
    </div>
  );
}
export default PostSection;
