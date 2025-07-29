import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Comment from './Comment';
import CreateComment from './CreateComment';
import './CommentSystem.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [replyTarget, setReplyTarget] = useState(null);
  const [likedComments, setLikedComments] = useState([]);
  const [dislikedComments, setDislikedComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = parseInt(localStorage.getItem('loginUserId'), 10);

  const buildCommentTree = (flatComments) => {
    const commentMap = {};
    const rootComments = [];

    flatComments.forEach(comment => {
      comment.replies = [];
      commentMap[comment.id] = comment;
    });

    flatComments.forEach(comment => {
      if (comment.parentId !== null) {
        const parent = commentMap[comment.parentId];
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    const sortByCreatedAt = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
    rootComments.sort(sortByCreatedAt);
    Object.values(commentMap).forEach(c => c.replies.sort(sortByCreatedAt));

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
      setError('댓글을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCreate = async (content, parentId, anonymous, url) => {
    try {
      const response = await axios.post(
        `${API_BASE}/posts/${postId}/comments`,
        {
          content,
          parentId,
          anonymous,
          url: url || '',
          userId,
        },
        { withCredentials: true }
      );
      fetchComments();
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: '댓글 작성에 실패했습니다.' };
    }
  };

  const handleUpdate = async (commentId, content, url) => {
    try {
      await axios.put(
        `${API_BASE}/posts/${postId}/comments/${commentId}`,
        {
          content,
          url,
          anonymous: false,
          parentId: null,
        },
        { withCredentials: true }
      );
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`${API_BASE}/posts/${postId}/comments/${commentId}`, {
        withCredentials: true,
      });
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (commentId) => {
    try {
      await axios.post(
        `${API_BASE}/posts/${postId}/comments/${commentId}/like?userId=${userId}`,
        {},
        { withCredentials: true }
      );
      setLikedComments(prev =>
        prev.includes(commentId) ? prev.filter(id => id !== commentId) : [...prev, commentId]
      );
      setDislikedComments(prev => prev.filter(id => id !== commentId));
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async (commentId) => {
    try {
      await axios.post(
        `${API_BASE}/posts/${postId}/comments/${commentId}/dislike?userId=${userId}`,
        {},
        { withCredentials: true }
      );
      setDislikedComments(prev =>
        prev.includes(commentId) ? prev.filter(id => id !== commentId) : [...prev, commentId]
      );
      setLikedComments(prev => prev.filter(id => id !== commentId));
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReplyClick = (parentId, parentAuthor) => {
    setReplyTarget({ parentId, parentAuthor });
  };

  const handleCancelReply = () => {
    setReplyTarget(null);
  };

  return (
    <div className="comment-section">
      <h3>댓글 ({comments.length})</h3>

      <CreateComment
        postId={postId}
        onSubmit={handleCreate}
        onCancel={null}
        parentId={null}
      />

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <div className="comment-list">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              currentUserId={userId}
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
