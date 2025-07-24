import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const CreateComment = ({
  postId,
  onSubmit,
  onCancel,
  parentId = null,
  parentAuthor = null,
  placeholder = "댓글을 작성하세요...",
  anonymous = false,
}) => {
  const [content, setContent] = useState(parentAuthor ? `@${parentAuthor} ` : '');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContentChange = (e) => {
    let newContent = e.target.value;
    
    // 답글 작성 시 @부모 멘션 처리
    if (parentAuthor && parentId) {
      const mentionPrefix = `@${parentAuthor} `;
      
      // @부모 멘션이 삭제되었다면 다시 추가
      if (!newContent.startsWith(mentionPrefix)) {
        // 사용자가 다른 내용을 입력하고 있다면 멘션을 앞에 유지
        if (newContent.length > 0) {
          newContent = mentionPrefix + newContent;
        } else {
          newContent = mentionPrefix;
        }
      }
    }
    
    setContent(newContent);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const userId = localStorage.getItem("loginUserId");
      const response = await axios.post(
        `${API_BASE}/media?userId=${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      const locationUrl = response.headers['location'];
      if (locationUrl) {
        setUploadedImageUrl(locationUrl);
      } else if (response.data && response.data.url) {
        setUploadedImageUrl(response.data.url);
      } else {
        throw new Error('서버에서 이미지 URL을 반환하지 않았습니다.');
      }
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      setError('이미지 업로드에 실패했습니다.');
      setUploadedImageUrl('');
      setPreviewUrl(null);
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 답글에서 @부모만 있고 다른 내용이 없는 경우 처리
    let finalContent = content.trim();
    if (parentAuthor && parentId) {
      const mentionPrefix = `@${parentAuthor}`;
      if (finalContent === mentionPrefix || finalContent === mentionPrefix + ' ') {
        finalContent = '';
      }
    }

    if (!finalContent && !uploadedImageUrl) {
      setError('댓글 내용이나 이미지를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await onSubmit(content.trim(), uploadedImageUrl, parentId, anonymous);

      if (result && result.success === false) {
        setError(result.error || '댓글 작성에 실패했습니다.');
      } else {
        setContent(parentAuthor ? `@${parentAuthor} ` : '');
        setFile(null);
        setPreviewUrl(null);
        setUploadedImageUrl('');

        const fileInput = document.querySelector(`input[type="file"]#file-input-${parentId || 'main'}`);
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      setError('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setUploadedImageUrl('');
    const fileInput = document.querySelector(`input[type="file"]#file-input-${parentId || 'main'}`);
    if (fileInput) fileInput.value = '';
  };

  // 실제 제출될 내용 길이 계산 (멘션 제외)
  const getActualContentLength = () => {
    let actualContent = content.trim();
    if (parentAuthor && parentId) {
      const mentionPrefix = `@${parentAuthor}`;
      if (actualContent.startsWith(mentionPrefix)) {
        actualContent = actualContent.substring(mentionPrefix.length).trim();
      }
    }
    return actualContent.length;
  };

  const isSubmitDisabled = isSubmitting || (getActualContentLength() === 0 && !uploadedImageUrl);

  return (
    <form className="create-comment-form" onSubmit={handleSubmit}>
      <textarea
        className="create-comment-textarea"
        value={content}
        onChange={handleContentChange}
        placeholder={placeholder}
        disabled={isSubmitting}
        rows="3"
      />

      <div className="file-upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isSubmitting}
          id={`file-input-${parentId || 'main'}`}
        />
      </div>

      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="이미지 미리보기" style={{ maxWidth: '200px', maxHeight: '200px' }} />
          <button type="button" onClick={removeImage} className="remove-image-btn">
            ✕ 제거
          </button>
        </div>
      )}

      {error && <div className="create-comment-error">{error}</div>}

      <div className="comment-form-actions">
        <button
          type="submit"
          className="create-comment-button"
          disabled={isSubmitDisabled}
        >
          {isSubmitting ? '작성 중...' : '댓글 작성'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="cancel-comment-button"
            disabled={isSubmitting}
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
};

export default CreateComment;