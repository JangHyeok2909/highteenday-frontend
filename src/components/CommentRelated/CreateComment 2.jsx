import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "/api";

const CreateComment = ({
  postId,
  parentId = null,
  onSubmit,
  onCancel,
  placeholder = "댓글을 작성하세요...",
  mentionText = "",
}) => {
  const initialContent = parentId && mentionText ? `${mentionText} ` : "";
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (parentId && mentionText && textareaRef.current) {
      const mentionLength = mentionText.length + 1;
      setTimeout(() => {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(mentionLength, mentionLength);
      }, 0);
    }
  }, [parentId, mentionText]);

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const userId = localStorage.getItem("loginUserId");
      const response = await axios.post(
        `${API_BASE}/media?userId=${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const uploadedUrl =
        response.headers.location ||
        response.data?.url ||
        response.data?.imageUrl ||
        response.data?.path ||
        (typeof response.data === "string" ? response.data : "");

      if (!uploadedUrl) throw new Error("이미지 URL을 받을 수 없습니다.");
      setImageUrl(uploadedUrl);
      setImagePreview(URL.createObjectURL(file));
    } catch (err) {
      console.error(err);
      setError("이미지 업로드에 실패했습니다.");
      setImageFile(null);
      setImageUrl("");
      setImagePreview("");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024)
      return setError("파일 크기는 5MB 이하여야 합니다.");
    if (!file.type.startsWith("image/"))
      return setError("이미지 파일만 업로드 가능합니다.");

    setImageFile(file);
    setError(null);
    handleImageUpload(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImageUrl("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const actualContent =
      parentId && mentionText
        ? content.slice(mentionText.length + 1).trim()
        : content.trim();

    if (!actualContent && !imageUrl) {
      setError("댓글 내용을 입력하거나 이미지를 첨부해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (onSubmit) {
        const result = await onSubmit(
          content.trim(),
          imageUrl,
          parentId ?? null,
          anonymous
        );
        if (result?.success === false) {
          setError(result.error || "댓글 작성에 실패했습니다.");
          return;
        }
        setContent("");
        setAnonymous(false);
        removeImage();
        if (onCancel) onCancel();
      }
    } catch (err) {
      console.error(err);
      setError("댓글 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) handleSubmit(e);
    if (e.key === "Escape" && onCancel) onCancel();

    if (parentId && mentionText) {
      const mentionLength = mentionText.length + 1;
      if (
        (e.key === "Backspace" || e.key === "ArrowLeft") &&
        e.target.selectionStart <= mentionLength
      ) {
        e.preventDefault();
        if (e.key === "ArrowLeft")
          e.target.setSelectionRange(mentionLength, mentionLength);
      }
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (parentId && mentionText) {
      const expectedStart = `${mentionText} `;
      if (!newValue.startsWith(expectedStart)) return setContent(expectedStart);
    }
    setContent(newValue);
  };

  const handleClick = (e) => {
    if (
      parentId &&
      mentionText &&
      e.target.selectionStart < mentionText.length + 1
    ) {
      setTimeout(
        () =>
          e.target.setSelectionRange(
            mentionText.length + 1,
            mentionText.length + 1
          ),
        0
      );
    }
  };

  const handleCancel = () => {
    setContent("");
    setAnonymous(false);
    removeImage();
    setError(null);
    if (onCancel) onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`create-comment-form ${parentId ? "reply-form" : ""}`}
    >
      <div className="comment-input-container">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          placeholder={parentId ? "" : placeholder}
          rows={parentId ? 3 : 4}
          maxLength={1000}
          disabled={isSubmitting}
        />
        <div className="character-count">
          {Math.max(
            0,
            content.length -
              (parentId && mentionText ? mentionText.length + 1 : 0)
          )}
          /1000
        </div>
      </div>

      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="preview" />
          <button type="button" onClick={removeImage} disabled={isSubmitting}>
            ✕
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={isSubmitting || uploadingImage}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isSubmitting || uploadingImage}
      >
        {uploadingImage ? "업로드 중..." : "📷 이미지 첨부"}
      </button>

      {error && <div className="error-message">{error}</div>}

      <div className="comment-options">
        <label>
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            disabled={isSubmitting}
          />
          익명
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting || (!content.trim() && !imageUrl)}
        >
          {isSubmitting
            ? parentId
              ? "답글 작성 중..."
              : "댓글 작성 중..."
            : parentId
            ? "답글 작성"
            : "댓글 작성"}
        </button>
        {onCancel && (
          <button type="button" onClick={handleCancel} disabled={isSubmitting}>
            취소
          </button>
        )}
      </div>
    </form>
  );
};

export default CreateComment;
