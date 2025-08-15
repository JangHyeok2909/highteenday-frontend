import React, { useState } from 'react';
import CreateComment from './CreateComment';

const Comment = ({
  comment,
  currentUserId,
  onUpdate,
  onDelete,
  onSubmitReply,
  onLike,
  onDislike,
  onReplyClick,
  replyTarget,
  likedComments,
  dislikedComments,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isOwner = comment.owner === true;
  const isLiked = likedComments.includes(comment.id);
  const isDisliked = dislikedComments.includes(comment.id);

  const anonymousLabel = comment.anonymous
    ? `익명${comment.anonymousNumber || ''}`
    : comment.author;

  const handleEdit = async () => {
    if (!editContent.trim()) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await onUpdate(comment.id, editContent.trim());
      if (result.success) {
        setIsEditing(false);
        setEditContent(editContent.trim());
      } else {
        setError(result.error || '댓글 수정에 실패했습니다.');
      }
    } catch (err) {
      setError('댓글 수정에 실패했습니다.');
      console.error('댓글 수정 오류:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await onDelete(comment.id);
      if (!result.success) {
        setError(result.error || '댓글 삭제에 실패했습니다.');
      }
    } catch (err) {
      setError('댓글 삭제에 실패했습니다.');
      console.error('댓글 삭제 오류:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) handleEdit();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditContent(comment.content);
      setError(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return '오늘 ' + date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (days < 7) {
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <div id="coment-related">

      <div className="comment">
        <div className="comment-header">
          <div className="comment-author">
            <div className="author-avatar">
              {anonymousLabel ? anonymousLabel.charAt(0).toUpperCase() : '익'}
            </div>
            <div className="author-info">
              <span className="author-name">{anonymousLabel}</span>
              <span className="comment-date">{formatDate(comment.createdAt)}</span>
              {comment.updatedAt !== comment.createdAt && (
                <span className="edited-indicator">(수정됨)</span>
              )}
            </div>
          </div>

          {isOwner && (
            <div className="comment-actions">
              <button onClick={() => setIsEditing(true)} disabled={isSubmitting}>수정</button>
              <button onClick={handleDelete} disabled={isSubmitting}>삭제</button>
            </div>
          )}
        </div>

        <div className="comment-content">
          {isEditing ? (
            <div className="edit-form">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyPress}
                rows="3"
                maxLength="1000"
                disabled={isSubmitting}
                autoFocus
              />
              <div className="character-count">{editContent.length}/1000</div>
              {error && <div className="error-message">{error}</div>}
              <div className="edit-actions">
                <button onClick={handleEdit} disabled={isSubmitting || !editContent.trim()}>
                  저장
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(comment.content);
                    setError(null);
                  }}
                  disabled={isSubmitting}
                >
                  취소
                </button>
              </div>
              <div className="shortcut-hint">Ctrl + Enter: 저장, Esc: 취소</div>
            </div>
          ) : (
            <>
              <div className="comment-text">{comment.content}</div>
              {comment.url && comment.url.trim() !== '' && (
                <div className="comment-image" style={{ marginTop: '10px' }}>
                  <img
                    src={comment.url}
                    alt="첨부 이미지"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                    onClick={() => window.open(comment.url, '_blank')}
                    onError={(e) => {
                      console.error('이미지 로드 실패:', comment.url);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {!isEditing && (
          <div className="comment-footer">
            <div className="comment-stats">
              <button
                onClick={() => onLike(comment.id)}
                className={`like-button ${isLiked ? 'liked' : ''}`}
              >
                👍 {comment.likeCount || 0}
              </button>
              <button
                onClick={() => onDislike(comment.id)}
                className={`dislike-button ${isDisliked ? 'disliked' : ''}`}
              >
                👎 {comment.dislikeCount || 0}
              </button>
              {!isOwner && (
                <button
                  onClick={() => onReplyClick(comment.id, anonymousLabel)}
                  className="reply-button"
                >
                  💬 답글
                </button>
              )}
            </div>
          </div>
        )}

        {!isOwner && replyTarget?.parentId === comment.id && (
          <div className="reply-form">
            <CreateComment
              postId={comment.postId}
              parentId={comment.id}
              onSubmit={(content, imageUrl) =>
                onSubmitReply(`@${replyTarget.parentAuthor} ${content}`, imageUrl, comment.id, false)
              }
              onCancel={() => onReplyClick(null)}
              placeholder={`@${replyTarget.parentAuthor} 님에게 답글`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
