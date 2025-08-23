import React from 'react';
import PostDetail from '../components/PostDetail';

function PostWithCommentsPage() {
  const postId = window.location.pathname.split('/').pop();

  return (
    <div style={{ padding: '20px' }}>
      <PostDetail postId={postId} />
    </div>
  );
}

export default PostWithCommentsPage;