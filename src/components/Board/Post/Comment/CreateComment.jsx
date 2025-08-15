import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const CreateComment = ({
  postId,
  onSubmit,
  onCancel,
  parentId = null,
  placeholder = "댓글을 작성하세요...",
  anonymous = false,
}) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(selectedFile);

    // 실제 업로드 처리
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

      // location 헤더에서 URL 가져오기
      const locationUrl = response.headers['location'];
      if (locationUrl) {
        setUploadedImageUrl(locationUrl);
      } else if (response.data && response.data.url) {
        // 응답 데이터에서 URL 가져오기 (백업)
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

    if (!content.trim() && !uploadedImageUrl) {
      setError('댓글 내용이나 이미지를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await onSubmit(content.trim(), uploadedImageUrl, parentId, anonymous);
      
      if (result && result.success !== false) {
        // 성공 시 초기화
        setContent('');
        setFile(null);
        setPreviewUrl(null);
        setUploadedImageUrl('');
        
        // 파일 입력 초기화
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = '';
      } else {
        setError(result?.error || '댓글 작성에 실패했습니다.');
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
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div id="coment-related">
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
            disabled={isSubmitting || (!content.trim() && !uploadedImageUrl)}
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
    </div>
  );
};

export default CreateComment;