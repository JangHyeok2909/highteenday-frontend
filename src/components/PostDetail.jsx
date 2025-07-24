import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PostPage.css'; 

function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/posts/${postId}`,
        { withCredentials: true }
      );
      setPost(res.data);
    } catch (err) {
      console.error(err);
      setError('게시글을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchPost();
  }, [postId]);

  const handleScrap = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/posts/${postId}/scraps`, null, {
        withCredentials: true,
      });
      await fetchPost();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    const prevPost = { ...post };

    const newLiked = !post.liked;
    const newDisliked = false;

    const newLikeCount = post.likeCount + (newLiked ? 1 : -1);
    const newDislikeCount = post.disliked ? post.dislikeCount - 1 : post.dislikeCount;

    setPost({
      ...post,
      liked: newLiked,
      disliked: newDisliked,
      likeCount: newLikeCount,
      dislikeCount: newDislikeCount,
    });

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/posts/${post.id}/like`,
        null,
        { withCredentials: true }
      );
    } catch (error) {
      console.error('좋아요 요청 실패:', error);
      setPost(prevPost);
    }
  };

  const handleDislike = async () => {
    if (!post) return;
    const prevPost = { ...post };

    const newDisliked = !post.disliked;
    const newLiked = false;

    const newDislikeCount = post.dislikeCount + (newDisliked ? 1 : -1);
    const newLikeCount = post.liked ? post.likeCount - 1 : post.likeCount;

    setPost({
      ...post,
      liked: newLiked,
      disliked: newDisliked,
      likeCount: newLikeCount,
      dislikeCount: newDislikeCount,
    });

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/posts/${post.id}/dislike`,
        null,
        { withCredentials: true }
      );
    } catch (error) {
      console.error('싫어요 요청 실패:', error);
      setPost(prevPost);
    }
  };

  const handleEdit = () => {
    navigate(`/posts/${postId}/edit`);
  };

  if (loading) return <p>불러오는 중...</p>;
  if (error) return <p>{error}</p>;
  if (!post) return null;

  return (
    <div className="post-section">
      <h1 className="post-title">{post.title}</h1>
      <div className="post-meta">
        <span>작성자: {post.author}</span>
        <span>조회수: {post.viewCount}</span>
        <span>작성일: {post.createdAt}</span>
      </div>

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.imageUrl && (
        <div className="post-image">
          <img src={post.imageUrl} alt="첨부 이미지" />
        </div>
      )}

      <div className="post-actions">
        <button onClick={handleScrap}>
          {post.scrapped ? '스크랩 취소' : '스크랩'}
        </button>

        <button onClick={handleLike}>
          👍 {post.liked ? '좋아요 취소' : '좋아요'} ({post.likeCount})
        </button>

        <button onClick={handleDislike}>
          👎 {post.disliked ? '싫어요 취소' : '싫어요'} ({post.dislikeCount})
        </button>

        {post.owner && (
          <button onClick={handleEdit}>
            📝 수정
          </button>
        )}
        
      </div>
    </div>
  );
}

export default PostDetail;
