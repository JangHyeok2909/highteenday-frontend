import React, { useState, useRef } from 'react';
import CreateComment from './CreateComment';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Trash2,
  Edit3,
  X
} from 'lucide-react';

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
  onCancelReply,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editImage, setEditImage] = useState(comment.url || null);
  const [editFile, setEditFile] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOwner = comment.owner === true;
  const isReply = comment.parentId !== null && comment.parentId !== undefined;
  const isLiked = likedComments.includes(comment.id);
  const isDisliked = dislikedComments.includes(comment.id);
  const fileInputRef = useRef(null);

  const anonymousLabel = comment.anonymous
    ? `익명`
    : comment.author;

  const isCommentEdited = () => {
    if (comment.updated !== undefined) {
      return comment.updated === true;
    }
    
    if (!comment.updatedAt || comment.updatedAt === null) {
      return false;
    }
    
    if (comment.createdAt && comment.updatedAt) {
      return comment.createdAt !== comment.updatedAt;
    }
    
    return false;
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('/')) {
      return `${process.env.REACT_APP_API_BASE_URL}${url}`;
    }
    return url;
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const errorMsg = document.createElement('div');
    errorMsg.textContent = '이미지를 불러올 수 없습니다.';
    errorMsg.style.cssText = 'color: #666; font-size: 12px; padding: 8px; border: 1px dashed #ccc;';
    e.target.parentNode.appendChild(errorMsg);
  };

  const handleImageLoad = (e) => {
    console.log('Image loaded:', e.target.src);
  };

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
    if (isReply && comment.parentId) {
      const originalMentionMatch = comment.content.match(/^@\S+\s*/);
      if (originalMentionMatch) {
        const mentionPrefix = originalMentionMatch[0];
        if (!newContent.startsWith(mentionPrefix.trim())) {
          newContent = mentionPrefix + newContent;
        }
      }
    }
    setEditContent(newContent);
  };

  const handleEdit = async () => {
    const finalContent = editContent.trim();
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
        const uploadUrl = `${process.env.REACT_APP_API_BASE_URL}/media?userId=${userId}`;
        const response = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) throw new Error(`이미지 업로드 실패: ${response.status}`);

        let extractedUrl = response.headers.get('location') || '';
        if (!extractedUrl) {
          const data = await response.json().catch(() => null);
          extractedUrl = data?.url || data?.imageUrl || data?.path || '';
        }
        if (extractedUrl.startsWith('/')) {
          extractedUrl = `${process.env.REACT_APP_API_BASE_URL}${extractedUrl}`;
        }
        imageUrl = extractedUrl;
      }

      await onUpdate(comment.id, finalContent, imageUrl);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError(`댓글 수정 중 오류 발생: ${err.message}`);
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
    onReplyClick(comment.id, anonymousLabel);
  };

  console.log('Comment rendering:', { 
    id: comment.id, 
    parentId: comment.parentId, 
    isReply, 
    repliesCount: comment.replies?.length || 0,
    author: comment.author
  });

  return (
    <>
      <div className={`comment ${isReply ? 'comment-reply' : ''}`}>
        <div className="comment-container">
          <div className="comment-content">
            <div className="comment-header">
              <div className="comment-author">
                <div className="author-avatar">{anonymousLabel[0]}</div>
                <div className="author-info">
                  <span className="author-name">{anonymousLabel}</span>
                  <span className="comment-date">{comment.createdAt}</span>
                  {isCommentEdited() && (
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
                    <img
                      src={getImageUrl(editImage)}
                      alt="preview"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                    />
                    <button className="remove-image-btn" onClick={handleRemoveImage}>
                      <X size={16} />
                    </button>
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
                  <button onClick={handleEdit} disabled={isSubmitting}>
                    {isSubmitting ? '수정 중...' : '수정 완료'}
                  </button>
                  <button onClick={() => setIsEditing(false)} disabled={isSubmitting}>취소</button>
                </div>
              </div>
            ) : (
              <>
                <div className="comment-text">{renderCommentContent(comment.content)}</div>
                {comment.url && comment.url !== '' && (
                  <div className="comment-image">
                    <img
                      src={getImageUrl(comment.url)}
                      alt="comment"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                      style={{ maxWidth: '100%', height: 'auto' }}
                    />
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

                  {!isReply && !isOwner && (
                    <button className="reply-button" onClick={handleReplyClick}>
                      <MessageSquare size={14} /> 답글
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {replyTarget?.parentId === comment.id && (
          <div className="reply-form-container">
            <CreateComment
              postId={comment.postId}
              parentId={comment.id}
              mentionText={`@${anonymousLabel}`}
              onSubmit={onSubmitReply}
              onCancel={onCancelReply}
            />
          </div>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies-container">
          {comment.replies.map(reply => (
            <Comment
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onSubmitReply={onSubmitReply}
              onLike={onLike}
              onDislike={onDislike}
              onReplyClick={onReplyClick}
              replyTarget={replyTarget}
              likedComments={likedComments}
              dislikedComments={dislikedComments}
              onCancelReply={onCancelReply}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Comment;