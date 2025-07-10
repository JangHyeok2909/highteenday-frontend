import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [replyTo, setReplyTo] = useState(null); // 대댓글 대상 댓글 ID
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('loginUserId'); // 로그인 사용자 ID

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`https://highteenday.duckdns.org/api/posts/${postId}/comments`);
      setComments(res.data);
    } catch (err) {
      setError('댓글을 불러오는 데 실패했습니다.');
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const parsedUserId = parseInt(localStorage.getItem('loginUserId'));
  if (!parsedUserId || !newComment.trim()) {
    setError('로그인 정보 또는 댓글 내용이 잘못되었습니다.');
    return;
  }

  try {
    await axios.post(`/api/posts/${postId}/comments`, {
      userId: parsedUserId,
      parentId: replyTo || 0,
      content: newComment.trim(),
      anonymous: anonymous
    });

    await fetchComments();
    setNewComment('');
    setReplyTo(null);
    setError(null);
  } catch (err) {
    console.error(err);
    setError('댓글 작성에 실패했습니다.');
  }
};


  const handleReply = (commentId) => {
    setReplyTo(commentId);
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>댓글</h3>

      {comments.map((comment) => (
        <div key={comment.id} style={{ borderBottom: '1px solid #ddd', marginBottom: '10px', paddingLeft: comment.parentId ? '20px' : '0' }}>
          <p><strong>{comment.anonymous ? '익명' : comment.author}</strong></p>
          <p>{comment.content}</p>
          <p style={{ fontSize: '12px', color: '#888' }}>
            {new Date(new Date(comment.createdAt).getTime() + 9 * 60 * 60 * 1000).toLocaleString('ko-KR', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })}
          </p>
          <button onClick={() => handleReply(comment.id)} style={{ fontSize: '12px' }}>답글</button>
        </div>
      ))}

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        {replyTo && (
          <p style={{ color: 'gray' }}>
            ➥ <strong>{replyTo}</strong>번 댓글에 답글 작성 중...
            <button type="button" onClick={() => setReplyTo(null)} style={{ marginLeft: '10px', fontSize: '12px' }}>취소</button>
          </p>
        )}

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="4"
          placeholder="댓글을 입력하세요"
          style={{ width: '100%', padding: '8px' }}
        />
        <div style={{ margin: '8px 0' }}>
          <label>
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            /> 익명으로 작성
          </label>
        </div>
        <button type="submit">댓글 등록</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CommentSection;