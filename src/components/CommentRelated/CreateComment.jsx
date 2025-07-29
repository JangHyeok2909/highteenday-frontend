import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const CreateComment = ({
  postId,
  parentId = null,
  onSubmit,
  onCancel,
  placeholder = "댓글을 작성하세요...",
  mentionText = ""
}) => {
  const initialContent = parentId && mentionText ? `${mentionText} ` : '';
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
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
    try {
      const formData = new FormData();
      formData.append('file', file);

      const userId = localStorage.getItem('loginUserId');

      const response = await axios.post(`${API_BASE}/media?userId=${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      let uploadedUrl =
        response.headers.get?.('location') ||
        response.headers?.location ||
        response.data?.url ||
        response.data?.location ||
        (typeof response.data === 'string' ? response.data : '');

      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
      } else {
        throw new Error('이미지 URL을 가져올 수 없습니다.');
      }
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      setError('이미지 URL을 가져올 수 없습니다.');
      setImageFile(null);
      setImageUrl('');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('파일 크기는 5MB 이하여야 합니다.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드 가능합니다.');
        return;
      }

      setImageFile(file);
      setError(null);
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const actualContent = parentId && mentionText
      ? content.slice(mentionText.length + 1).trim()
      : content.trim();

    if (!actualContent && !imageUrl) {
      setError('댓글 내용을 입력하거나 이미지를 첨부해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (onSubmit) {
        const result = await onSubmit(content.trim(), parentId, anonymous, imageUrl);
        if (result?.success === false) {
          setError(result.error || '댓글 작성에 실패했습니다.');
          return;
        }

        setContent('');
        setAnonymous(false);
        removeImage();
        if (onCancel) onCancel();
      }
    } catch (err) {
      console.error('댓글 작성 오류:', err);
      setError('댓글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (e.key === 'Escape' && onCancel) {
      onCancel();
    }

    if (parentId && mentionText) {
      const mentionLength = mentionText.length + 1;
      const { selectionStart } = e.target;

      if (e.key === 'Backspace' && selectionStart <= mentionLength) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft' && selectionStart <= mentionLength) {
        e.preventDefault();
        e.target.setSelectionRange(mentionLength, mentionLength);
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
    if (parentId && mentionText) {
      const mentionLength = mentionText.length + 1;
      const { selectionStart } = e.target;
      if (selectionStart < mentionLength) {
        setTimeout(() => {
          e.target.setSelectionRange(mentionLength, mentionLength);
        }, 0);
      }
    }
  };

  const handleCancel = () => {
    setContent('');
    setAnonymous(false);
    removeImage();
    setError(null);
    if (onCancel) onCancel();
  };

  const buttonLabel = isSubmitting
    ? (parentId ? '답글 작성 중...' : '댓글 작성 중...')
    : (parentId ? '답글 작성' : '댓글 작성');

  const actualLength = parentId && mentionText
    ? Math.max(0, content.length - mentionText.length - 1)
    : content.length;

  return (
    <form onSubmit={handleSubmit} className={`create-comment-form ${parentId ? 'reply-form' : ''}`}>
      <div className="comment-input-container">
        <textarea
          ref={textareaRef}
          name="content"
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          placeholder={parentId ? "" : placeholder}
          rows={parentId ? "3" : "4"}
          maxLength="1000"
          disabled={isSubmitting}
          className="create-comment-textarea"
          style={{ resize: 'none' }}
        />
        <div className="character-count">
          {actualLength}/1000
        </div>
      </div>

      {imageFile && (
        <div className="image-preview">
          <img src={URL.createObjectURL(imageFile)} alt="미리보기" />
          <button
            type="button"
            onClick={removeImage}
            className="remove-image-btn"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>
      )}

      <div className="file-upload-section">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isSubmitting || uploadingImage}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSubmitting || uploadingImage}
          className="upload-button"
        >
          {uploadingImage ? '업로드 중...' : '📷 이미지 첨부'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="comment-form-actions">
        <div className="comment-options">
          <label className="anonymous-option">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              disabled={isSubmitting}
            />
            익명으로 작성
          </label>
        </div>

        <div className="comment-actions">
          <button
            type="submit"
            disabled={isSubmitting || (actualLength === 0 && !imageUrl)}
            className="create-comment-button"
          >
            {buttonLabel}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-comment-button"
              disabled={isSubmitting}
            >
              취소
            </button>
          )}
        </div>
      </div>

      <div className="shortcut-hint">
        Ctrl + Enter로 빠른 작성{onCancel && ', Esc로 취소'}
      </div>
    </form>
  );
};

export default CreateComment;
