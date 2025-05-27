import React, { useState } from 'react';
import PostDetail from '../components/PostDetail';

function PostPage() {
    const [postId, setPostId] = useState('');

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h2>게시글 조회</h2>

        <input
            type="text"
            placeholder="Post ID"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
        />

        {postId && <PostDetail postId={postId} />}
    </div>
  );
}

export default PostPage;