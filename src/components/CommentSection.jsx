import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [replyTo, setReplyTo] = useState(null);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);  // 이미지 파일 상태
  const [previewUrl, setPreviewUrl] = useState(null); // 미리보기 URL

  const userId = localStorage.getItem('loginUserId');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`/api/posts/${postId}/comments`);
      setComments(res.data);
    } catch (err) {
      setError('댓글을 불러오는 데 실패했습니다.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedUserId = parseInt(localStorage.getItem('loginUserId'));
    if (!parsedUserId || !newComment.trim()) {
      setError('로그인 정보 또는 댓글 내용이 잘못되었습니다.');
      return;
    }

    let uploadedImageUrl = '';
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('userId', parsedUserId);

        const res = await axios.post('/api/media', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        uploadedImageUrl = res.data;
      } catch (err) {
        console.error('이미지 업로드 실패:', err);
        setError('이미지 업로드 중 오류가 발생했습니다.');
        return;
      }
    }

    try {
      await axios.post(`/api/posts/${postId}/comments`, {
        userId: parsedUserId,
        parentId: replyTo || 0,
        content: newComment.trim(),
        anonymous: anonymous,
        url: uploadedImageUrl || ''
      });

      await fetchComments();
      setNewComment('');
      setReplyTo(null);
      setImageFile(null);
      setPreviewUrl(null);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('댓글 작성에 실패했습니다.');
    }
  };

  const handleReply = (commentId) => {
    setReplyTo(commentId);
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h3>댓글</h3>

      {comments.map((comment) => (
        <div key={comment.id} style={{ borderBottom: '1px solid #ddd', marginBottom: '10px', paddingLeft: comment.parentId ? '20px' : '0' }}>
          <p><strong>{comment.anonymous ? '익명' : comment.author}</strong></p>
          <p>{comment.content}</p>
          {comment.url && (
            <img src={comment.url} alt="첨부 이미지" style={{ maxWidth: '300px', marginTop: '8px' }} />
          )}
          <p style={{ fontSize: '12px', color: '#888' }}>
            {new Date(new Date(comment.createdAt).getTime() + 9 * 60 * 60 * 1000).toLocaleString('ko-KR', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })}
          </p>
          <button onClick={() => handleReply(comment.id)} style={{ fontSize: '12px' }}>답글</button>
        </div>
      ))}

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        {replyTo && (
          <p style={{ color: 'gray' }}>
            ➥ <strong>{replyTo}</strong>번 댓글에 답글 작성 중...
            <button type="button" onClick={() => setReplyTo(null)} style={{ marginLeft: '10px', fontSize: '12px' }}>취소</button>
          </p>
        )}

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="4"
          placeholder="댓글을 입력하세요"
          style={{ width: '100%', padding: '8px' }}
        />
        <div style={{ margin: '8px 0' }}>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewUrl && (
            <div style={{ marginTop: '10px' }}>
              <img src={previewUrl} alt="미리보기" style={{ maxWidth: '200px' }} />
            </div>
          )}
        </div>
        <div style={{ margin: '8px 0' }}>
          <label>
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
            /> 익명으로 작성
          </label>
        </div>
        <button type="submit">댓글 등록</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default CommentSection;
