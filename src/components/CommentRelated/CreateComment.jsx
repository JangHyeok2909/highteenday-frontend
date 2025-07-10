import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateComment.css';

function CreateComment({ postId, parentId, onSuccess, onCancel }) {
  const [content, setContent] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem('loginUserId');

  useEffect(() => {
    setContent('');
    setError(null);
  }, [parentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const uid = parseInt(userId, 10);
    if (!uid || !content.trim()) {
      setError('로그인 정보 또는 댓글 내용이 잘못되었습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        userId: uid,
        parentId: parentId || null,
        content: content.trim(),
        anonymous,
        url: ''
      });

      setContent('');
      setAnonymous(true);
      
      onSuccess(response.data);
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      setError(
        err.response?.data?.message || 
        '댓글 작성에 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setError(null);
    onCancel();
  };

  return (
    <div className="create-comment">
      {parentId && (
        <div className="reply-indicator">
          <span>답글 작성 중...</span>
          <button 
            type="button" 
            onClick={handleCancel}
            className="cancel-reply-btn"
          >
            취소
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="댓글을 입력하세요"
          className="comment-textarea"
          disabled={loading}
          maxLength={500}
        />
        
        <div className="comment-form-footer">
          <div className="comment-options">
            <label className="anonymous-checkbox">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                disabled={loading}
              />
              익명으로 작성
            </label>
            <span className="character-count">
              {content.length}/500
            </span>
          </div>
          
          <button
            type="submit"
            className="submit-comment-btn"
            disabled={loading || !content.trim()}
          >
            {loading ? '작성 중...' : '댓글 작성'}
          </button>
        </div>
        
        {error && <div className="comment-error">{error}</div>}
      </form>
    </div>
  );
}

export default CreateComment;
