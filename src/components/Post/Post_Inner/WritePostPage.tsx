import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import PostEditor from "./PostEditor";
import "./WritePostPage.css";

function WritePostPage() {
  const { postId } = useParams();
  const isEditMode = !!postId;
  const pageTitle = isEditMode ? "게시글 수정" : "게시글 작성";

  return (
    <div className="write-post-page default-root-value">
      <Helmet>
        <title>{pageTitle} | 하이틴데이</title>
      </Helmet>
      <h1 className="write-post-page__title">{pageTitle}</h1>
      <PostEditor />
    </div>
  );
}

export default WritePostPage;
