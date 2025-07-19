import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PostDetail({ postId }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isScrapped, setIsScrapped] = useState(false);

  const userId = localStorage.getItem('loginUserId');

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      setPost(null);
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/posts/${postId}`,
          {
            params: { userId },
            withCredentials: true,
          }
        );
        setPost(res.data);
        setIsScrapped(res.data.isScrapped || false);
      } catch (err) {
        console.error('게시글 불러오기 실패:', err);
        setError('게시글을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, userId]);

  const handleScrap = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/posts/${postId}/scraps`,
        null,
        {
          params: { userId },
          withCredentials: true,
        }
      );
      setIsScrapped((prev) => !prev);
    } catch (err) {
      console.error('스크랩 요청 실패:', err);
      alert('스크랩 처리 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <p>로딩 중 ...</p>;
  if (error) return <p>{error}</p>;
  if (!post) return <p>게시글이 존재하지 않습니다.</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{post.title}</h1>
      <p style={{ color: 'gray', fontSize: '14px' }}>
        작성자: {post.author || '익명'} | 조회수: {post.views}
      </p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <button onClick={handleScrap} style={{ marginTop: '20px' }}>
        {isScrapped ? '스크랩 취소' : '스크랩'}
      </button>
    </div>
  );
}

export default PostDetail;
