import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentSection from '../../CommentRelated/CommentSection.jsx';
import TimeStamp from '../../common/TimeStamp.jsx';
import '../PostDetail.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '/api';

function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/posts/${postId}`, {
        withCredentials: true,
      });
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
    if (!post) return;
    const prev = post;
    const scrapped = !post.scrapped;
    setPost({ ...post, scrapped });
    try {
      await axios.post(`${API_BASE}/posts/${post.id}/scraps`, null, {
        withCredentials: true,
      });
    } catch (err) {
      console.error('스크랩 실패:', err);
      setPost(prev);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    const prev = { ...post };

    const liked = !post.liked;
    const disliked = false;
    const likeCount = post.likeCount + (liked ? 1 : -1);
    const dislikeCount = post.disliked ? post.dislikeCount - 1 : post.dislikeCount;

    setPost({ ...post, liked, disliked, likeCount, dislikeCount });

    try {
      await axios.post(`${API_BASE}/posts/${post.id}/like`, null, {
        withCredentials: true,
      });
    } catch (e) {
      console.error(e);
      setPost(prev);
    }
  };

  const handleDislike = async () => {
    if (!post) return;
    const prev = { ...post };

    const disliked = !post.disliked;
    const liked = false;
    const dislikeCount = post.dislikeCount + (disliked ? 1 : -1);
    const likeCount = post.liked ? post.likeCount - 1 : post.likeCount;

    setPost({ ...post, liked, disliked, likeCount, dislikeCount });

    try {
      await axios.post(`${API_BASE}/posts/${post.id}/dislike`, null, {
        withCredentials: true,
      });
    } catch (e) {
      console.error(e);
      setPost(prev);
    }
  };

  if (loading) return <p className="loading-message">불러오는 중...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!post) return null;

  return (
    <div className="post-container">
      {/* 헤더 */}
      <div className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-category">
          {post.boardName || post.board || '게시판'}
        </div>
      </div>

      {/* 메타 */}
      <div className="post-meta">
        <span>작성자: {post.author || '익명'}</span>
        <span>·</span>
        <span>조회수: {post.viewCount}</span>
        <span>·</span>
        <span>
          작성일: <TimeStamp value={post.createdAt} />
        </span>
      </div>

      {/* 본문 */}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 액션 */}
      <div className="post-toolbar">
        <button
          className={`chip chip--scrap ${post.scrapped ? 'is-active' : ''}`}
          onClick={handleScrap}
        >
          {post.scrapped ? '스크랩 취소' : '스크랩'}
        </button>
        <button
          className={`chip chip--like ${post.liked ? 'is-active' : ''}`}
          onClick={handleLike}
        >
          👍 좋아요 ({post.likeCount || 0})
        </button>
        <button
          className={`chip chip--dislike ${post.disliked ? 'is-active' : ''}`}
          onClick={handleDislike}
        >
          👎 싫어요 ({post.dislikeCount || 0})
        </button>
      </div>

      {/* 댓글 */}
      <CommentSection postId={postId} />
    </div>
  );
}

export default PostDetail;
