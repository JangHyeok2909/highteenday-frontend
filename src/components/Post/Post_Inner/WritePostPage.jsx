import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import Header from '../../Header/MainHader/Header';
import PostEditor from './PostEditor';
import './WritePostPage.css';

function WritePostPage() {
  const { postId } = useParams();
  const isEditMode = !!postId;

  return (
    <div className="write-post-page default-root-value">
      <Helmet><title>{isEditMode ? '게시글 수정' : '게시글 작성'} | 하이틴데이</title></Helmet>
      <div className="header">
        <Header isMainPage={false} />
      </div>
      <div className="write-post-container">
        <h1 className="page-title">{isEditMode ? '게시글 수정' : '게시글 작성'}</h1>
        <PostEditor />
      </div>
    </div>
  );
}

export default WritePostPage;
