import React, { useState, useRef, useEffect } from "react";
import CreateComment from "./CreateComment";
import axios from "axios";
import { ThumbsUp, ThumbsDown, MessageSquare, Trash2, Edit3, X, CornerDownRight } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "/api";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const isOwner = comment.owner === true;
  const isReply = comment.parentId !== null && comment.parentId !== undefined;
  const isLiked = likedComments.includes(comment.id);
  const isDisliked = dislikedComments.includes(comment.id);
  const anonymousLabel = comment.anonymous ? "익명" : comment.author;

  useEffect(() => {
    return () => {
      if (editImagePreview && editImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(editImagePreview);
      }
    };
  }, [editImagePreview]);

  const isCommentEdited = () => {
    if (comment.updated !== undefined) return comment.updated === true;
    if (!comment.updatedAt) return false;
    if (comment.createdAt && comment.updatedAt) return comment.createdAt !== comment.updatedAt;
    return false;
  };

  const handleImageError = (e) => {
    e.target.style.display = "none";
  };

  const renderCommentContent = (content) => {
    if (!content) return "";
    const mentionRegex = /@(\S+)/g;
    const parts = content.split(mentionRegex);
    return parts.map((part, index) =>
      index % 2 === 1 ? <span key={index} className="mention">@{part}</span> : part
    );
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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      setError("파일 크기는 5MB 이하여야 합니다.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.");
      return;
    }

    setError(null);
    setEditFile(file);

    setEditImagePreview((prev) => {
      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const handleRemoveImage = () => {
    setEditFile(null);
    setEditImage(null);
    setError(null);

    if (editImagePreview && editImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(editImagePreview);
    }
    setEditImagePreview(null);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
    // 서버 저장된 기존 이미지 미리보기(일반 URL)
    setEditImagePreview(comment.url || null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
    setEditImage(comment.url || null);
    if (editImagePreview && editImagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(editImagePreview);
    }
    setEditImagePreview(null);
    setEditFile(null);
    setError(null);
  };

  const handleEdit = async () => {
    const finalContent = editContent.trim();
    if (!finalContent && !editImage && !editFile) {
      setError("댓글 내용이나 이미지를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl = editImage || "";

      if (editFile) {
        const formData = new FormData();
        formData.append("file", editFile);
        const response = await axios.post(`${API_BASE}/media`, formData, {
          withCredentials: true,
        });
        imageUrl =
          response.headers?.location ||
          response.data?.url ||
          response.data?.imageUrl ||
          response.data?.path ||
          (typeof response.data === "string" ? response.data : "");

        if (!imageUrl) throw new Error("이미지 URL을 받을 수 없습니다.");
      }

      await onUpdate(comment.id, finalContent, imageUrl);

      // 정리
      if (editImagePreview && editImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(editImagePreview);
      }
      setIsEditing(false);
      setEditFile(null);
      setEditImagePreview(null);
    } catch (err) {
      console.error(err);
      setError(`댓글 수정 중 오류 발생: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyClick = () => onReplyClick(comment.id, anonymousLabel);

  return (
    <>
      <div className={`comment-item ${isReply ? "comment-reply" : ""}`}>
        {isReply && (
          <div className="reply-icon" aria-hidden>
            <CornerDownRight size={16} />
          </div>
        )}

        <div className="comment-avatar" aria-hidden>
          {anonymousLabel?.[0] || "익"}
        </div>

        <div className="comment-main">
          <div className="comment-header">
            <div className="comment-author-info">
              <span className="comment-author-name">{anonymousLabel}</span>
              <span className="comment-date">{comment.createdAt}</span>
              {isCommentEdited() && <span className="comment-edited">(수정됨)</span>}
            </div>

            {isOwner && !isEditing && (
              <div className="comment-actions">
                <button
                  type="button"
                  className="action-btn"
                  onClick={handleStartEdit}
                  aria-label="댓글 수정"
                  title="댓글 수정"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => onDelete(comment.id)}
                  aria-label="댓글 삭제"
                  title="댓글 삭제"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="comment-edit-form">
              <textarea
                value={editContent}
                onChange={handleEditContentChange}
                rows={3}
                placeholder="댓글을 입력하세요"
                className="edit-textarea"
              />

              {(editImagePreview || editImage) && (
                <div className="image-preview">
                  <img
                    src={editImagePreview || editImage}
                    alt="첨부 이미지 미리보기"
                    onError={handleImageError}
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={handleRemoveImage}
                    aria-label="이미지 제거"
                    title="이미지 제거"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />

              <div className="edit-toolbar">
                <button
                  type="button"
                  className="toolbar-btn"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="이미지 첨부"
                  title="이미지 첨부"
                >
                  📷 이미지
                </button>

                <div className="edit-actions">
                  <button
                    type="button"
                    className="edit-btn save"
                    onClick={handleEdit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "저장 중..." : "저장"}
                  </button>
                  <button
                    type="button"
                    className="edit-btn cancel"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    취소
                  </button>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}
            </div>
          ) : (
            <>
              <div className="comment-content">{renderCommentContent(comment.content)}</div>

              {comment.url && (
                <div className="comment-image">
                  <img src={comment.url} alt="댓글 이미지" onError={handleImageError} />
                </div>
              )}

              <div className="comment-footer">
                <button
                  type="button"
                  className={`reaction-btn ${isLiked ? "liked" : ""}`}
                  onClick={() => onLike(comment.id)}
                  aria-label="좋아요"
                  title="좋아요"
                >
                  <ThumbsUp size={14} />
                  {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
                </button>

                <button
                  type="button"
                  className={`reaction-btn ${isDisliked ? "disliked" : ""}`}
                  onClick={() => onDislike(comment.id)}
                  aria-label="싫어요"
                  title="싫어요"
                >
                  <ThumbsDown size={14} />
                  {comment.dislikeCount > 0 && <span>{comment.dislikeCount}</span>}
                </button>

                {!isReply && !isOwner && (
                  <button
                    type="button"
                    className="reaction-btn"
                    onClick={handleReplyClick}
                    aria-label="답글"
                    title="답글"
                  >
                    <MessageSquare size={14} />
                    답글
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {replyTarget?.parentId === comment.id && (
        <div className="reply-form-wrapper">
          <CreateComment
            postId={comment.postId}
            parentId={comment.id}
            mentionText={`@${anonymousLabel}`}
            onSubmit={onSubmitReply}
            onCancel={onCancelReply}
          />
        </div>
      )}

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
