import React, { useState } from 'react';

const CreateComment = ({ 
  postId, 
  parentId = null, 
  anonymous=false, 
  onSubmit, 
  onCancel, 
  placeholder = "댓글을 작성하세요..." 
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (onSubmit) {
        await onSubmit(content.trim(), parentId);
      }
      setContent('');
      if (onCancel) onCancel();
    } catch (err) {
      console.error('댓글 작성 오류:', err);
      setError('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  const buttonLabel = isSubmitting
    ? '작성 중...'
    : parentId
    ? '답글 작성'
    : '댓글 작성';

  return (
    <form onSubmit={handleSubmit} className="create-comment-form">
      <div className="comment-input-container">
        <textarea
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows="3"
          maxLength="1000"
          disabled={isSubmitting}
        />
        <div className="character-count">
          {content.length}/1000
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="comment-actions">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="submit-button"
        >
          {buttonLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cancel-button"
            disabled={isSubmitting}
          >
            취소
          </button>
        )}
      </div>

      <div className="shortcut-hint">Ctrl + Enter로 빠른 작성</div>
    </form>
  );
};

export default CreateComment;
