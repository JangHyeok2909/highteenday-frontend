import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Comment from './Comment';
import CreateComment from './CreateComment';
import './CommentSystem.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [likedComments, setLikedComments] = useState([]);
  const [dislikedComments, setDislikedComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentUserId = parseInt(localStorage.getItem('loginUserId'), 10);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/posts/${postId}/comments`, {
        withCredentials: true,
      });
      setComments(res.data);
    } catch (err) {
      setError('댓글을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentSubmit = async (content, imageUrl, parentId, anonymous) => {
    try {
      const requestBody = {
        content,
        parentId,
        anonymous,
        userId: currentUserId,
      };

      if (imageUrl && imageUrl.trim() !== "") {
        requestBody.url = imageUrl;
      }

      await axios.post(
        `${API_BASE}/posts/${postId}/comments`,
        requestBody,
        { withCredentials: true }
      );
      await fetchComments();
      setReplyTo(null);
      return { success: true };
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || '댓글 작성에 실패했습니다.' 
      };
    }
  };

  const handleCommentUpdate = async (commentId, content, imageUrl) => {
    try {
      const requestBody = {
        content,
        userId: currentUserId,
      };

      if (imageUrl && imageUrl.trim() !== "") {
        requestBody.url = imageUrl;
      }

      await axios.put(
        `${API_BASE}/posts/${postId}/comments/${commentId}`,
        requestBody,
        { withCredentials: true }
      );
      await fetchComments();
    } catch (err) {
      console.error('댓글 수정 실패:', err);
      throw err;
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(
        `${API_BASE}/posts/${postId}/comments/${commentId}`,
        { withCredentials: true }
      );
      await fetchComments();
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
    }
  };

  const handleLike = async (commentId) => {
    try {
      await axios.post(
        `${API_BASE}/comments/${commentId}/like`,
        { userId: currentUserId },
        { withCredentials: true }
      );
      
      await fetchComments();
      
      setLikedComments((prev) =>
        prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]
      );
      setDislikedComments((prev) => prev.filter((id) => id !== commentId));
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  const handleDislike = async (commentId) => {
    try {
      await axios.post(
        `${API_BASE}/comments/${commentId}/dislike`,
        { userId: currentUserId },
        { withCredentials: true }
      );
      
      await fetchComments();
      
      setDislikedComments((prev) =>
        prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]
      );
      setLikedComments((prev) => prev.filter((id) => id !== commentId));
    } catch (err) {
      console.error('싫어요 실패:', err);
    }
  };

  const organizeReplies = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach((comment) => {
      map[comment.id] = { ...comment, replies: [] };
    });

    comments.forEach((comment) => {
      if (comment.parentId) {
        map[comment.parentId]?.replies.push(map[comment.id]);
      } else {
        roots.push(map[comment.id]);
      }
    });

    return roots;
  };

  const commentTree = organizeReplies(comments);

  const renderComment = (comment) => (
    <Comment
      key={comment.id}
      comment={comment}
      currentUserId={currentUserId}
      onSubmitReply={handleCommentSubmit}
      onUpdate={handleCommentUpdate}
      onDelete={handleCommentDelete}
      onLike={handleLike}
      onDislike={handleDislike}
      replyTo={(id, author) => setReplyTo({ parentId: id, parentAuthor: author })}
      replyTarget={replyTo}
      likedComments={likedComments}
      dislikedComments={dislikedComments}
      onCancelReply={() => setReplyTo(null)}
    />
  );

  return (
    <div className="comment-section">
      <h3>댓글 {comments.length}</h3>

      <CreateComment
        postId={postId}
        onSubmit={handleCommentSubmit}
        placeholder="댓글을 작성하세요..."
      />

      {/* 답글 작성 폼 */}
      {replyTo && (
        <div className="reply-form-container">
          <div className="reply-header">
            <span>@{replyTo.parentAuthor}님에게 답글 작성</span>
            <button 
              className="cancel-reply-btn"
              onClick={() => setReplyTo(null)}
            >
              ✕
            </button>
          </div>
          <CreateComment
            postId={postId}
            parentId={replyTo.parentId}
            parentAuthor={replyTo.parentAuthor}
            onSubmit={handleCommentSubmit}
            onCancel={() => setReplyTo(null)}
            placeholder={`@${replyTo.parentAuthor}님에게 답글을 작성하세요...`}
          />
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">댓글을 불러오는 중...</div>}

      <div className="comment-list">
        {commentTree.map((comment) => renderComment(comment))}
      </div>

      {!comments.length && !loading && (
        <div className="no-comments">첫 댓글을 남겨보세요!</div>
      )}
    </div>
  );
};

export default CommentSection;