// Comment.jsx
import React, { useState } from 'react';
import './Comment.css'; // CSS 파일 분리 권장

function Comment({ comment, replies, onReply, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);

  const isReply = comment.parentId !== null && comment.parentId !== 0;
  const userId = localStorage.getItem('loginUserId');
  const canEdit = userId && parseInt(userId) === comment.userId;

  // 시간 포맷팅 개선
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return '방금 전';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
    
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    
    setLoading(true);
    try {
      await onEdit(comment.id, editContent.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('댓글 수정 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      setLoading(true);
      try {
        await onDelete(comment.id);
      } catch (error) {
        console.error('댓글 삭제 실패:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`comment ${isReply ? 'comment-reply' : ''}`}>
      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">
            {isReply && '↳ '}
            {comment.anonymous ? '익명' : comment.author}
          </span>
          <span className="comment-date">{formatDate(comment.createdAt)}</span>
        </div>

        {isEditing ? (
          <div className="comment-edit">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              disabled={loading}
            />
            <div className="comment-edit-actions">
              <button 
                onClick={handleEdit} 
                disabled={loading || !editContent.trim()}
              >
                {loading ? '수정 중...' : '완료'}
              </button>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                }}
                disabled={loading}
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-text">{comment.content}</p>
        )}

        <div className="comment-actions">
          <button 
            className="comment-reply-btn"
            onClick={() => onReply(comment.id)}
          >
            답글
          </button>
          {canEdit && (
            <>
              <button 
                className="comment-edit-btn"
                onClick={() => setIsEditing(true)}
                disabled={loading}
              >
                수정
              </button>
              <button 
                className="comment-delete-btn"
                onClick={handleDelete}
                disabled={loading}
              >
                삭제
              </button>
            </>
          )}
        </div>
      </div>

      {replies.length > 0 && (
        <div className="comment-replies">
          {replies.map(reply => (
            <Comment 
              key={reply.id} 
              comment={reply} 
              replies={[]} 
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Comment;