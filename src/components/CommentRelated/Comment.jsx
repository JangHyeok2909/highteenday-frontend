import React, { useState } from 'react';
import CreateComment from './CreateComment';

const Comment = ({
  comment,
  currentUserId,
  onUpdate,
  onDelete,
  onLike,
  onDislike,
  onReply,
  onEdit,
  replyTo,
  editingId,
  likedComments,
  dislikedComments,
  depth = 0,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isOwner = () => String(comment.userId) === String(currentUserId);
  const isLiked = likedComments.includes(comment.id);
  const isDisliked = dislikedComments.includes(comment.id);

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

  const handleLike = () => {
    onLike(comment.id);
  };

  const handleDislike = () => {
    onDislike(comment.id);
  };

  const handleReplySubmit = async (content) => {
    try {
      const result = await onUpdate(comment.id, content);
      return result;
    } catch (err) {
      console.error('답글 작성 오류:', err);
      return { success: false, error: '답글 작성에 실패했습니다.' };
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleEdit();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditContent(comment.content);
      setError(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return '오늘 ' + date.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffDays <= 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <div
      className={`comment ${depth > 0 ? 'comment-reply' : ''}`}
      style={{ marginLeft: `${depth * 20}px` }}
    >
      <div className="comment-header">
        <div className="comment-author">
          <div className="author-avatar">
            {comment.author ? comment.author.charAt(0).toUpperCase() : '익'}
          </div>
          <div className="author-info">
            <span className="author-name">{comment.author || '익명'}</span>
            <span className="comment-date">{formatDate(comment.createdAt)}</span>
            {comment.updatedAt !== comment.createdAt && (
              <span className="edited-indicator">(수정됨)</span>
            )}
          </div>
        </div>

        {isOwner() && (
          <div className="comment-actions">
            <button onClick={() => setIsEditing(true)} disabled={isSubmitting}>
              수정
            </button>
            <button onClick={handleDelete} disabled={isSubmitting}>
              삭제
            </button>
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
          <div className="comment-text">{comment.content}</div>
        )}
      </div>

      {!isEditing && (
        <div className="comment-footer">
          <div className="comment-stats">
            <button
              onClick={handleLike}
              className={`like-button ${isLiked ? 'liked' : ''}`}
            >
              ❤️ {comment.likeCount || 0}
            </button>
            <button
              onClick={handleDislike}
              className={`dislike-button ${isDisliked ? 'disliked' : ''}`}
            >
              💔 {comment.dislikeCount || 0}
            </button>
            <button onClick={() => onReply(comment.id)} className="reply-button">
              💬 답글
            </button>
          </div>
          {comment.replies && comment.replies.length > 0 && (
            <span className="reply-count">답글 {comment.replies.length}개</span>
          )}
        </div>
      )}

      {replyTo === comment.id && (
        <div className="reply-form">
          <CreateComment
            postId={comment.postId}
            parentId={comment.id}
            onSubmit={handleReplySubmit}
            onCancel={() => onReply(null)}
            placeholder="답글을 작성하세요..."
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onLike={onLike}
              onDislike={onDislike}
              onReply={onReply}
              onEdit={onEdit}
              replyTo={replyTo}
              editingId={editingId}
              likedComments={likedComments}
              dislikedComments={dislikedComments}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
