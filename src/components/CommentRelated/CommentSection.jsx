import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Comment from "./Comment";
import CreateComment from "./CreateComment";
import "./CommentSystem.css";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_BASE_URL || '/api';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [replyTarget, setReplyTarget] = useState(null);
  const [likedComments, setLikedComments] = useState([]);
  const [dislikedComments, setDislikedComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isLogin } = useAuth();
  const navigate = useNavigate();
  
  const userId = parseInt(localStorage.getItem("loginUserId"), 10);

  const buildCommentTree = (flatComments) => {
    const commentMap = {};
    const rootComments = [];

    flatComments.forEach((c) => {
      c.replies = [];
      commentMap[c.id] = c;
    });

    flatComments.forEach((c) => {
      if (c.parentId === null || c.parentId === undefined) {
        rootComments.push(c);
      } else {
        const parent = commentMap[c.parentId];
        if (parent) {
          parent.replies.push(c);
        } else {
          rootComments.push(c);
        }
      }
    });

    const sortByCreatedAt = (a, b) =>
      new Date(a.createdAt) - new Date(b.createdAt);
    rootComments.sort(sortByCreatedAt);
    Object.values(commentMap).forEach((c) => {
      if (c.replies && c.replies.length > 0) c.replies.sort(sortByCreatedAt);
    });

    return rootComments;
  };

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/posts/${postId}/comments`, {
        withCredentials: true,
      });
      const tree = buildCommentTree(response.data);
      setComments(tree);
    } catch (err) {
      console.error(err);
      setError("댓글을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCreate = async (content, imageUrl, parentId, anonymous) => {
    try {
      const requestData = {
        content: content ?? '',
        parentId: parentId ?? null,
        anonymous: Boolean(anonymous),
        url: imageUrl || '',
        userId,
      };

      await axios.post(
        `${API_BASE}/posts/${postId}/comments`,
        requestData,
        { withCredentials: true }
      );

      await fetchComments();

      if (parentId) {
        setReplyTarget(null);
      }

      return { success: true };
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      return {
        success: false,
        error: err.response?.data?.message || '댓글 작성에 실패했습니다.',
      };
    }
  };

  const handleUpdate = async (commentId, content, url) => {
    try {
      await axios.put(
        `${API_BASE}/posts/${postId}/comments/${commentId}`,
        {
          content: content ?? '',
          url: url || '',
          anonymous: false,
        },
        { withCredentials: true }
      );
      fetchComments();
    } catch (err) {
      console.error('댓글 수정 실패:', err);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axios.delete(`${API_BASE}/posts/${postId}/comments/${commentId}`, {
        withCredentials: true,
      });
      fetchComments();
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
    }
  };

  const handleLike = async (commentId) => {
    if(!isLogin) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `${API_BASE}/comments/${commentId}/like`,
        {},
        { withCredentials: true }
      );
      setLikedComments((prev) =>
        prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]
      );
      setDislikedComments((prev) => prev.filter((id) => id !== commentId));
      fetchComments();
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  const handleDislike = async (commentId) => {
    if (!isLogin) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/comments/${commentId}/dislike`,
        {},
        { withCredentials: true }
      );
      setDislikedComments((prev) =>
        prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]
      );
      setLikedComments((prev) => prev.filter((id) => id !== commentId));
      fetchComments();
    } catch (err) {
      console.error('싫어요 실패:', err);
    }
  };

  const handleReplyClick = (parentId, parentAuthor) => {
    setReplyTarget({ parentId, parentAuthor });
  };
  const handleCancelReply = () => setReplyTarget(null);

  const getTotalCommentCount = (items) => {
    let count = 0;
    items.forEach((c) => {
      count += 1;
      if (c.replies && c.replies.length > 0) count += c.replies.length;
    });
    return count;
  };

  return (
    <div id="comment-section-container" className="comment-section">
      <h3 className="comment-section-title">댓글 ({getTotalCommentCount(comments)})</h3>

      <CreateComment
        postId={postId}
        onSubmit={handleCreate}
        onCancel={null}
        parentId={null}
      />

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p className="loading-message">로딩 중...</p>
      ) : (
        <div className="comment-list">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onSubmitReply={handleCreate}
              onLike={handleLike}
              onDislike={handleDislike}
              onReplyClick={handleReplyClick}
              replyTarget={replyTarget}
              likedComments={likedComments}
              dislikedComments={dislikedComments}
              onCancelReply={handleCancelReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
