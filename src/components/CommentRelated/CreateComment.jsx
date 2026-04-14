import React, { useState, useRef, useEffect, useRef as useRefAlias } from "react";
import axios from "axios";
import { X } from "lucide-react";
import "./CommentSystem.css";
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom";



const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const uploadTokenRef = useRefAlias(0);
  const { isLogin } = useAuth();
  const navigate = useNavigate();

  // 멘션 커서
  useEffect(() => {
    if (parentId && mentionText && textareaRef.current) {
      const mentionLength = mentionText.length + 1;
      setTimeout(() => {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(mentionLength, mentionLength);
      }, 0);
    }
  }, [parentId, mentionText]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploadingImage(true);
    setError(null);

    const myToken = ++uploadTokenRef.current;

    try {
      const formData = new FormData();
      formData.append("file", file);
      const userId = localStorage.getItem("loginUserId");

      const response = await axios.post(
        `/api/media?userId=${userId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (myToken !== uploadTokenRef.current) return;

      const uploadedUrl =
        response.headers.location ||
        response.data?.url ||
        response.data?.imageUrl ||
        response.data?.path ||
        (typeof response.data === "string" ? response.data : "");

      if (!uploadedUrl) throw new Error("이미지 URL을 받을 수 없습니다.");

      setImageUrl(uploadedUrl);

      setImagePreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(file);
      });
    } catch (err) {
      console.error(err);
      setError("이미지 업로드에 실패했습니다.");
      setImageUrl("");
      setImagePreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return "";
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e) => {
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
    handleImageUpload(file);
  };

  const removeImage = () => {
    setImageUrl("");
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!isLogin) {
      navigate("/login");
      return;
    }

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

        // 초기화
        setContent(parentId && mentionText ? `${mentionText} ` : "");
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

    // 멘션 보호
    if (parentId && mentionText) {
      const mentionLength = mentionText.length + 1;
      if (
        (e.key === "Backspace" || e.key === "ArrowLeft") &&
        e.target.selectionStart <= mentionLength
      ) {
        e.preventDefault();
        if (e.key === "ArrowLeft") {
          e.target.setSelectionRange(mentionLength, mentionLength);
        }
      }
    }
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (parentId && mentionText) {
      const expectedStart = `${mentionText} `;
      if (!newValue.startsWith(expectedStart)) {
        setContent(expectedStart);
        return;
      }
    }
    setContent(newValue);
  };

  const handleClick = (e) => {
    if (parentId && mentionText && e.target.selectionStart < mentionText.length + 1) {
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
    setContent(parentId && mentionText ? `${mentionText} ` : "");
    setAnonymous(false);
    removeImage();
    setError(null);
    if (onCancel) onCancel();
  };

  const charCount = Math.max(
    0,
    content.length - (parentId && mentionText ? mentionText.length + 1 : 0)
  );
  const isSubmitDisabled = isSubmitting || uploadingImage || (!content.trim() && !imageUrl);

  return (
    <form
      id="comment-section-container"
      onSubmit={handleSubmit}
      className={`comment-form ${parentId ? "reply-form" : "main-form"}`}
    >
      <div className="form-header">
        <div className="form-content">
          <div className="textarea-wrapper">
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
              className="form-textarea"
            />
            <div className="character-count">{charCount}/1000</div>
          </div>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="미리보기" />
              <button
                type="button"
                className="remove-image-btn"
                onClick={removeImage}
                disabled={isSubmitting}
                aria-label="첨부 이미지 제거"
                title="첨부 이미지 제거"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="form-toolbar">
            <div className="toolbar-left">
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
                className="toolbar-btn"
                onClick={() => {
                  if (!isSubmitting && !uploadingImage)
                    fileInputRef.current?.click();
                }}
                disabled={isSubmitting || uploadingImage}
                aria-label="이미지 첨부"
                title="이미지 첨부"
              >
                📷 {uploadingImage ? "업로드 중..." : "이미지"}
              </button>

              <label className="anonymous-checkbox" title="익명으로 작성">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  disabled={isSubmitting}
                />
                익명
              </label>
            </div>

            <div className="toolbar-right">
              {onCancel && (
                <button
                  type="button"
                  className="form-btn cancel"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  취소
                </button>
              )}
              <button
                type="submit"
                className="form-btn submit"
                disabled={isSubmitDisabled}
              >
                {isSubmitting
                  ? parentId
                    ? "답글 작성 중..."
                    : "댓글 작성 중..."
                  : parentId
                  ? "답글 작성"
                  : "댓글 작성"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateComment;
