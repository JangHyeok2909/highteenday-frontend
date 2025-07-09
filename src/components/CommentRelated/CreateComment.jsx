import React, { useState } from 'react';
import axios from 'axios';

function CreateComment({ postId, parentId, onSuccess, onCancel }) {
  const [content, setContent]   = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [error, setError]       = useState(null);

  const userId = localStorage.getItem('loginUserId');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uid = parseInt(userId, 10);

    if (!uid || !content.trim()) {
      setError('로그인 정보 또는 댓글 내용이 잘못되었습니다.');
      return;
    }

    try {
      await axios.post(`/api/posts/${postId}/comments`, {
        userId: uid,
        parentId: parentId || 0,
        content: content.trim(),
        anonymous
      });
      setContent('');
      setError(null);
      onSuccess();
    } catch {
      setError('댓글 작성에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      {parentId && (
        <p style={{ color: 'gray' }}>
          ➥ <strong>{parentId}</strong>번 댓글에 답글 작성 중...
          <button
            type="button"
            onClick={onCancel}
            style={{ marginLeft: 10, fontSize: 12 }}
          >
            취소
          </button>
        </p>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        placeholder="댓글을 입력하세요"
        style={{ width: '100%', padding: 8 }}
      />
      <div style={{ margin: '8px 0' }}>
        <label>
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />{' '}
          익명으로 작성
        </label>
      </div>
      <button
        type="submit"
        style={{
          float: 'right',
          marginTop: 8,
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        작성
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default CreateComment;
