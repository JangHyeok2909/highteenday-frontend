import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Comment from './Comment';
import CreateComment from './CreateComment';
import './CommentSystem.css';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [likedComments, setLikedComments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = parseInt(localStorage.getItem('loginUserId'), 10);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${API_BASE}/posts/${postId}/comments?userId=${userId}`,
        { withCredentials: true }
      );
      setComments(res.data);
    } catch (err) {
      setError('댓글을 불러오는데 실패했습니다.');
      console.error('댓글 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [postId, userId]);

  useEffect(() => {
    if (postId && userId) {
      fetchComments();
    }
  }, [fetchComments]);

  const handleCommentSubmit = async (content, parentId = null) => {
    try {
      const response = await axios.post(
        `${API_BASE}/comments`,
        {
          postId,
          content,
          parentId,
          userId: String(userId),
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        await fetchComments();
        setReplyTo(null);
        return { success: true };
      }
    } catch (err) {
      console.error('댓글 작성 실패:', err);
      return { success: false, error: '댓글 작성에 실패했습니다.' };
    }
  };

  const handleCommentUpdate = async (commentId, content) => {
    try {
      const response = await axios.put(
        `${API_BASE}/comments/${commentId}`,
        {
          content,
          userId: String(userId),
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        await fetchComments();
        setEditingId(null);
        return { success: true };
      }
    } catch (err) {
      console.error('댓글 수정 실패:', err);
      return { success: false, error: '댓글 수정에 실패했습니다.' };
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/comments/${commentId}`,
        {
          data: { userId: String(userId) },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        await fetchComments();
        return { success: true };
      }
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
      return { success: false, error: '댓글 삭제에 실패했습니다.' };
    }
  };

  const handleLike = async (commentId) => {
    try {
      const response = await axios.post(
        `${API_BASE}/comments/${commentId}/like`,
        { userId: String(userId) },
        { withCredentials: true }
      );

      if (response.status === 200) {
        await fetchComments();
        setLikedComments(prev =>
          prev.includes(commentId)
            ? prev.filter(id => id !== commentId)
            : [...prev, commentId]
        );
      }
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  const organizeComments = (comments) => {
    const commentMap = {};
    const rootComments = [];

    comments.forEach(comment => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    comments.forEach(comment => {
      if (comment.parentId != null && comment.parentId !== 0) {
        const parentComment = commentMap[comment.parentId];
        if (parentComment) {
          parentComment.replies.push(commentMap[comment.id]);
        }
      } else {
        rootComments.push(commentMap[comment.id]);
      }
    });

    return rootComments;
  };

  if (loading) return <div className="loading">댓글을 불러오는 중...</div>;
  if (error) return <div className="error-message">오류: {error}</div>;

  const organizedComments = organizeComments(comments);

  return (
    <div className="comment-section">
      <h3>댓글 ({comments.length})</h3>

      <CreateComment
        postId={postId}
        onSubmit={handleCommentSubmit}
        placeholder="댓글을 작성하세요..."
      />

      <div className="comments-list">
        {organizedComments.map(comment => (
          <Comment
            key={comment.id}
            comment={comment}
            currentUserId={userId}
            onUpdate={handleCommentUpdate}
            onDelete={handleCommentDelete}
            onLike={handleLike}
            onReply={(parentId) => setReplyTo(parentId)}
            onEdit={(commentId) => setEditingId(commentId)}
            replyTo={replyTo}
            editingId={editingId}
            likedComments={likedComments}
          />
        ))}
      </div>

      {replyTo && (
        <CreateComment
          postId={postId}
          parentId={replyTo}
          onSubmit={handleCommentSubmit}
          onCancel={() => setReplyTo(null)}
          placeholder="답글을 작성하세요..."
        />
      )}

      {comments.length === 0 && (
        <div className="no-comments">
          아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
        </div>
      )}
    </div>
  );
};

export default CommentSection;
