import React from 'react';
import PostDetail from '../components/PostDetail';
import CommentSection from '../components/CommentRelated/CommentSection';

function PostWithCommentsPage() {
  const postId = window.location.pathname.split('/').pop();

  return (
    <div style={{ padding: '20px' }}>
      <PostDetail postId={postId} />
      <hr />
      <CommentSection postId={postId} />
    </div>
  );
}

export default PostWithCommentsPage;
