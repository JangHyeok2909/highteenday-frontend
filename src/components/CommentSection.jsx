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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadImageAsBase64 = async () => {
    if (!imageFile) return null;

    if (!userId || isNaN(parseInt(userId))) {
      console.warn('이미지 업로드 실패: 유효하지 않은 userId', userId);
      return null;
    }

    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
          const base64String = reader.result.split(',')[1];
          console.log('base64 변환 완료:', base64String.substring(0, 30)); // 앞 일부만 출력

          const res = await axios.post(`/api/media?userId=${userId}`, {
            file: base64String,
          });

          console.log('이미지 업로드 성공:', res.data);
          resolve(res.data); // 서버에서 반환하는 이미지 URL
        } catch (e) {
          console.error('이미지 업로드 실패:', e);
          reject(e);
        }
      };
      reader.readAsDataURL(imageFile);
    });
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
        uploadedImageUrl = await uploadImageAsBase64();
      }

      await axios.post(`/api/posts/${postId}/comments`, {
        userId: parsedUserId,
        parentId: replyTo || 0,
        content: newComment,          
        url: uploadedImageUrl || "",  
        anonymous,
      });

      setNewComment('');
      setReplyTo(null);
      setImageFile(null);
      setPreviewUrl(null);
      setError(null);
      await fetchComments();
    } catch (err) {
      console.error(err);
      setError('댓글 작성에 실패했습니다.');
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>댓글</h3>

      {comments.map(comment => (
        <div key={comment.id} style={{ paddingBottom: '10px' }}>
          <p><strong>{comment.anonymous ? '익명' : comment.author}</strong></p>
          <p>{comment.content}</p>
          <button onClick={() => setReplyTo(comment.id)}>답글</button>
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
