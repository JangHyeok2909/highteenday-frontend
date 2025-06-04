import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [editMode, setEditMode] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState(null);

  const userId = localStorage.getItem('loginUserId');

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/posts/${postId}/comments`);
      setComments(res.data);
    } catch {
      setError('댓글을 불러오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (isEdit) {
      setEditImageFile(file);
      setEditPreviewUrl(URL.createObjectURL(file));
    } else {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file) => {
    if (!file || !userId) return null;

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('file', file);

    try {
      const res = await axios.post('/api/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.headers.location;
    } catch (e) {
      console.error('이미지 업로드 실패:', e);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedUserId = parseInt(userId);
    if (!parsedUserId || !newComment.trim()) {
      setError('로그인 정보 또는 댓글 내용이 잘못되었습니다.');
      return;
    }

    try {
      let uploadedImageUrl = null;
      if (imageFile) {
        uploadedImageUrl = await uploadImage(imageFile);
      }

      await axios.post(`/api/posts/${postId}/comments`, {
        userId: parsedUserId,
        parentId: replyTo || 0,
        content: newComment,
        url: uploadedImageUrl || '',
        anonymous,
      });

      setNewComment('');
      setReplyTo(null);
      setImageFile(null);
      setPreviewUrl(null);
      setError(null);
      await fetchComments();
    } catch {
      setError('댓글 작성에 실패했습니다.');
    }
  };

  const enterEditMode = (comment) => {
    setEditMode(comment.id);
    setEditComment(comment.content);
    setEditPreviewUrl(comment.url || null);
    setEditImageFile(null);
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditComment('');
    setEditImageFile(null);
    setEditPreviewUrl(null);
  };

  const handleUpdate = async (comment) => {
    const parsedUserId = parseInt(userId);
    try {
      let uploadedImageUrl = null;
      if (editImageFile) {
        uploadedImageUrl = await uploadImage(editImageFile);
      }

      await axios.put(`/api/posts/${postId}/comments/${comment.id}`, {
        userId: parsedUserId,
        parentId: comment.parentId,
        content: editComment,
        url: uploadedImageUrl || editPreviewUrl || '',
        anonymous: comment.anonymous,
      });

      cancelEdit();
      await fetchComments();
    } catch {
      setError('댓글 수정에 실패했습니다.');
    }
  };

  const handleDelete = async (commentId) => {
    const parsedUserId = parseInt(userId);
    try {
      await axios.delete(`/api/posts/${postId}/comments/${commentId}`, {
        data: parsedUserId,
      });
      await fetchComments();
    } catch {
      setError('댓글 삭제에 실패했습니다.');
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>댓글</h3>

      {comments.map((comment) => (
        <div key={comment.id} style={{ paddingBottom: '10px' }}>
          <p><strong>{comment.anonymous ? '익명' : comment.author}</strong></p>

          {editMode === comment.id ? (
            <>
              <textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows="3"
                style={{ width: '100%' }}
              />
              <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, true)} />
              {editPreviewUrl && (
                <img src={editPreviewUrl} alt="미리보기" style={{ maxWidth: '200px' }} />
              )}
              <div>
                <button onClick={() => handleUpdate(comment)}>저장</button>
                <button onClick={cancelEdit}>취소</button>
              </div>
            </>
          ) : (
            <>
              <p>{comment.content}</p>
              {comment.url && (
                <img src={comment.url} alt="첨부 이미지" style={{ maxWidth: '200px' }} />
              )}
              <button onClick={() => setReplyTo(comment.id)}>답글</button>

              {/* ✅ 익명 여부와 무관하게 userId가 같으면 수정/삭제 버튼 표시 */}
              {comment.userId && parseInt(userId) === comment.userId && (
                <>
                  <button onClick={() => enterEditMode(comment)}>수정</button>
                  <button onClick={() => handleDelete(comment.id)}>삭제</button>
                </>
              )}
            </>
          )}
        </div>
      ))}

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        {replyTo && (
          <p>
            ➥ <strong>{replyTo}</strong>번 댓글에 답글 작성 중...
            <button type="button" onClick={() => setReplyTo(null)}>취소</button>
          </p>
        )}

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="4"
          placeholder="댓글을 입력하세요"
          style={{ width: '100%' }}
        />

        <div style={{ margin: '8px 0' }}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {previewUrl && (
          <img src={previewUrl} alt="미리보기" style={{ maxWidth: '200px', marginBottom: '8px' }} />
        )}

        <label>
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          익명으로 작성
        </label>

        <br />
        <button type="submit">댓글 등록</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default CommentSection;
