import React, { useState, useRef } from 'react';
import CreateComment from './CreateComment';
import { ThumbsUp, ThumbsDown, MessageSquare, Trash2, Edit3, X } from 'lucide-react';

const Comment = ({
  comment,
  currentUserId,
  onUpdate,
  onDelete,
  onSubmitReply,
  onLike,
  onDislike,
  replyTo,
  replyTarget,
  likedComments,
  dislikedComments,
  onCancelReply,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editImage, setEditImage] = useState(comment.url || null);
  const [editFile, setEditFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = comment.owner === true;
  const isReply = comment.parentId !== null;
  const isLiked = likedComments.includes(comment.id);
  const isDisliked = dislikedComments.includes(comment.id);
  const fileInputRef = useRef(null);

  const anonymousLabel = comment.anonymous
    ? `익명${comment.anonymousNumber || ''}`
    : comment.author;

  const renderCommentContent = (content) => {
    if (!content) return '';
    
    const mentionRegex = /@(\S+)/g;
    const parts = content.split(mentionRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span key={index} className="mention">
            @{part}
          </span>
        );
      }
      return part;
    });
  };

  const handleEditContentChange = (e) => {
    let newContent = e.target.value;
    
    // 수정 시 "@부모" 텍스트 처리 - 보여주되 수정 불가
    if (isReply && comment.parentId) {
      const originalMentionMatch = comment.content.match(/^@\S+\s*/);
      if (originalMentionMatch) {
        const mentionPrefix = originalMentionMatch[0];
        
        if (!newContent.startsWith(mentionPrefix.trim())) {
          if (newContent.length > 0) {
            newContent = mentionPrefix + newContent;
          } else {
            newContent = mentionPrefix;
          }
        }
      }
    }
    
    setEditContent(newContent);
  };

  const handleEdit = async () => {
    let finalContent = editContent.trim();
    if (isReply && comment.parentId) {
      const mentionMatch = finalContent.match(/^@\S+\s*/);
      if (mentionMatch && finalContent === mentionMatch[0].trim()) {
        setError('댓글 내용을 입력해주세요.');
        return;
      }
    }

    if (!finalContent && !editImage) {
      setError('댓글 내용이나 이미지를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    let imageUrl = editImage;

    try {
      if (editFile) {
        const formData = new FormData();
        formData.append('file', editFile);

        const userId = localStorage.getItem("loginUserId");
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/media?userId=${userId}`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('이미지 업로드 실패');
        }

        imageUrl = response.headers.get('location') || (await response.json()).url;
      }

      await onUpdate(comment.id, editContent.trim(), imageUrl);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError('댓글 수정 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditFile(file);
      setEditImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setEditFile(null);
    setEditImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReplyClick = () => {
    replyTo(comment.id, anonymousLabel);
  };

  return (
    <div className={`comment ${isReply ? 'comment-reply' : ''}`}>
      <div className="comment-container">
        <div className="comment-content">
          <div className="comment-header">
            <div className="comment-author">
              <div className="author-avatar">{anonymousLabel[0]}</div>
              <div className="author-info">
                <span className="author-name">{anonymousLabel}</span>
                <span className="comment-date">{comment.createdAt}</span>
                {comment.updatedAt !== comment.createdAt && (
                  <span className="edited-indicator">(수정됨)</span>
                )}
              </div>
            </div>
            {isOwner && !isEditing && (
              <div className="comment-actions">
                <button onClick={() => setIsEditing(true)}><Edit3 size={16} /></button>
                <button onClick={() => onDelete(comment.id)}><Trash2 size={16} /></button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="edit-form">
              <textarea
                value={editContent}
                onChange={handleEditContentChange}
                rows={3}
                placeholder="댓글을 입력하세요"
              />
              {editImage && (
                <div className="image-preview">
                  <img src={editImage} alt="preview" />
                  <button className="remove-image-btn" onClick={handleRemoveImage}><X size={16} /></button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
              />
              {error && <div className="error-message">{error}</div>}
              <div className="edit-actions">
                <button onClick={handleEdit} disabled={isSubmitting}>수정 완료</button>
                <button onClick={() => setIsEditing(false)} disabled={isSubmitting}>취소</button>
              </div>
            </div>
          ) : (
            <>
              <div className="comment-text">
                {renderCommentContent(comment.content)}
              </div>
              {comment.url && ( // imageUrl -> url로 변경
                <div className="comment-image">
                  <img src={comment.url} alt="comment" />
                </div>
              )}
            </>
          )}

          {!isEditing && (
            <div className="comment-footer">
              <div className="comment-stats">
                <button
                  className={`like-button ${isLiked ? 'liked' : ''}`}
                  onClick={() => onLike(comment.id)}
                >
                  <ThumbsUp size={14} /> {comment.likeCount || 0}
                </button>
                <button
                  className={`dislike-button ${isDisliked ? 'disliked' : ''}`}
                  onClick={() => onDislike(comment.id)}
                >
                  <ThumbsDown size={14} /> {comment.dislikeCount || 0}
                </button>
                {!isReply && (
                  <button
                    className="reply-button"
                    onClick={handleReplyClick}
                  >
                    <MessageSquare size={14} /> 답글
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies-container">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onSubmitReply={onSubmitReply}
              onLike={onLike}
              onDislike={onDislike}
              replyTo={replyTo}
              replyTarget={replyTarget}
              likedComments={likedComments}
              dislikedComments={dislikedComments}
              onCancelReply={onCancelReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;