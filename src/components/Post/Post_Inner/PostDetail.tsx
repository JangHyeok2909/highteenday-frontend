import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Trash2, Edit3 } from "lucide-react";
import CommentSection from "../../CommentRelated/CommentSection";
import { useAuth } from "../../../contexts/AuthContext";
import ReactionButton from "../../ReactionButtons/ReactionButton";
import ScrapButton from "../../ReactionButtons/ScrapButton";
import { formatBoardPreviewDate } from "../../../utils/dateFormat";
import { getLoginUserId } from "../../../utils/auth";
import { Post } from "../../../types/models";
import { Badge, Card, Spinner } from "../../ui";
import "../PostDetail.css";

function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isLogin } = useAuth();
  const loginUserId = getLoginUserId();

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<Post>(`/api/posts/${postId}`, {
        withCredentials: true,
      });
      setPost(res.data);
    } catch (err) {
      console.error(err);
      setError("게시글을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleScrap = async () => {
    if (!isLogin) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(`/api/posts/${postId}/scraps`, null, {
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
    const dislikeCount = post.disliked
      ? post.dislikeCount - 1
      : post.dislikeCount;

    setPost({ ...post, liked, disliked, likeCount, dislikeCount });

    try {
      await axios.post(`/api/posts/${post.id}/reaction?type=LIKE`, null, {
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
      await axios.post(`/api/posts/${post.id}/reaction?type=DISLIKE`, null, {
        withCredentials: true,
      });
    } catch (e) {
      console.error(e);
      setPost(prev);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("이 게시글을 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/posts/${postId}`, { withCredentials: true });
      navigate(-1);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "게시글 삭제에 실패했습니다.");
    }
  };

  const handleEdit = () => {
    navigate(`/post/edit/${postId}`);
  };

  if (loading) {
    return (
      <div className="post-detail__loading">
        <Spinner size={28} />
      </div>
    );
  }
  if (error) return <p className="post-detail__error">{error}</p>;
  if (!post) return null;

  const isOwner =
    post.owner === true ||
    (post.authorId != null && post.authorId === loginUserId);

  return (
    <>
      <Helmet>
        <title>
          {post.title ? `${post.title} | 하이틴데이` : "게시글 | 하이틴데이"}
        </title>
      </Helmet>

      <Card className="post-detail">
        <div className="post-detail__head">
          <Badge tone="primary">{post.board.boardName || "게시판"}</Badge>
          <h1 className="post-detail__title">{post.title}</h1>
          <div className="post-detail__meta">
            <span>{post.author ?? "익명"}</span>
            <span aria-hidden="true">·</span>
            <span>{formatBoardPreviewDate(post.createdAt)}</span>
            <span aria-hidden="true">·</span>
            <span>조회 {post.viewCount}</span>
            {isOwner && (
              <div className="post-detail__actions">
                <button
                  type="button"
                  className="post-detail__action"
                  onClick={handleEdit}
                  aria-label="수정"
                  title="수정"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  type="button"
                  className="post-detail__action post-detail__action--danger"
                  onClick={handleDelete}
                  aria-label="삭제"
                  title="삭제"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          className="post-detail__content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="post-detail__toolbar">
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
          <ScrapButton active={Boolean(post.scrapped)} onClick={handleScrap} />
        </div>
      </Card>

      <CommentSection postId={postId} />
    </>
  );
}

export default PostDetail;
