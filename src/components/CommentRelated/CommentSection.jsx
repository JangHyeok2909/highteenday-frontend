import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Comment from './Comment';
import CreateComment from './CreateComment';

function CommentSection({ postId }) {
  const [comments, setComments]   = useState([]);
  const [replyTo, setReplyTo]     = useState(null);
  const [error, setError]         = useState(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/posts/${postId}/comments`);
      setComments(data);
    } catch {
      setError('댓글을 불러오는 데 실패했습니다.');
    }
  };

  const roots = comments.filter(c => !c.parentId);
  const byParent = {};
  comments.forEach(c => {
    if (c.parentId) (byParent[c.parentId] = byParent[c.parentId] || []).push(c);
  });

  return (
    <div style={{ marginTop: 30 }}>
      <h3>댓글</h3>

      {roots.map(root => (
        <Comment
          key={root.id}
          comment={root}
          replies={byParent[root.id] || []}
          onReply={setReplyTo}
        />
      ))}

      <CreateComment
        postId={postId}
        parentId={replyTo}
        onSuccess={() => { setReplyTo(null); fetchComments(); }}
        onCancel={() => setReplyTo(null)}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CommentSection;
