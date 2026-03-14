import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit3 } from 'lucide-react';
import CommentSection from '../../CommentRelated/CommentSection';
import '../PostDetail.css';
import { useAuth } from "../../../contexts/AuthContext";
import ReactionButton from '../../ReactionButtons/ReactionButton';
import ScrapButton from '../../ReactionButtons/ScrapButton';
import { formatBoardPreviewDate } from '../../../utils/dateFormat';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '/api';

function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isLogin } = useAuth();
  const loginUserId = parseInt(localStorage.getItem('loginUserId'), 10);
  


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
    if (!isLogin) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(`${API_BASE}/posts/${postId}/scraps`, null, {
        withCredentials: true,
      });
      await fetchPost();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async () => {
    if (!isLogin) {
      navigate("/login");
      return;
    }
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
    if (!isLogin) {
      navigate("/login");
      return;
    }

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

  const handleDelete = async () => {
    if (!window.confirm('이 게시글을 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`${API_BASE}/posts/${postId}`, { withCredentials: true });
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  const handleEdit = () => {
    navigate(`/post/edit/${postId}`);
  };

  if (loading) return <p className="loading-message">불러오는 중...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (!post) return null;

  const isOwner =
    post.owner === true ||
    (post.authorId != null && post.authorId === loginUserId);

  return (
    <div className="post-container">
      {/* 헤더 */}
      <div className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-category">
          {post.board.boardName || '게시판'}
        </div>
      </div>

      {/* 메타 */}
      <div className="post-meta">
        <span>작성자: {post.author ?? ''}</span>
        <span>·</span>
        <span>조회수: {post.viewCount}</span>
        <span>·</span>
        <span>작성일: {formatBoardPreviewDate(post.createdAt)}</span>
        {isOwner && (
          <div className="post-meta-actions">
            <button
              type="button"
              className="post-action-btn"
              onClick={handleEdit}
              aria-label="수정"
              title="수정"
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              className="post-action-btn post-action-btn--danger"
              onClick={handleDelete}
              aria-label="삭제"
              title="삭제"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* 본문 */}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 액션 */}
      <div className="post-toolbar">
        <ScrapButton active={Boolean(post.scrapped)} onClick={handleScrap} />
        <ReactionButton
          active={Boolean(post.liked)}
          tone="like"
          onClick={handleLike}
          aria-label="좋아요"
          title="좋아요"
          count={post.likeCount || 0}
        />
        <ReactionButton
          active={Boolean(post.disliked)}
          tone="dislike"
          onClick={handleDislike}
          aria-label="싫어요"
          title="싫어요"
          count={post.dislikeCount || 0}
        />
      </div>

      {/* 댓글 */}
      <CommentSection postId={postId} />
    </div>
  );
}

export default PostDetail;
