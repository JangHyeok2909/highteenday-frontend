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
    <div className="post-detail-container">
      <h1 className="post-detail-title">{post.title}</h1>
      <p className="post-detail-meta">
          작성자: {post.author} | 조회수: {post.viewCount} | 좋아요: {post.likeCount}
      </p>
      <div className="post-detail-content" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}

export default PostDetail;
