import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Comment from './Comment';
import CreateComment from './CreateComment';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [likedComments, setLikedComments] = useState([]);
  const [dislikedComments, setDislikedComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      console.error('댓글 불러오기 실패:', err);
      setError('댓글을 불러오는 데 실패했습니다.');
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
      const res = await axios.post(
        `${API_BASE}/posts/${postId}/comments`,
        {
          content,
          parentId,
          userId,
          anonymous: false,
          url: ''
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
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
      const res = await axios.put(
        `${API_BASE}/posts/${postId}/comments/${commentId}?userId=${userId}`,
        {
          content,
          parentId: null,
          anonymous: false,
          url: ''
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
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
      const res = await axios.delete(
        `${API_BASE}/posts/${postId}/comments/${commentId}?userId=${userId}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
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
      const res = await axios.post(
        `${API_BASE}/comments/${commentId}/like?userId=${userId}`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        await fetchComments();
        setDislikedComments(prev => prev.filter(id => id !== commentId));
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

  const handleDislike = async (commentId) => {
    try {
      const res = await axios.post(
        `${API_BASE}/comments/${commentId}/dislike?userId=${userId}`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        await fetchComments();
        setLikedComments(prev => prev.filter(id => id !== commentId));
        setDislikedComments(prev =>
          prev.includes(commentId)
            ? prev.filter(id => id !== commentId)
            : [...prev, commentId]
        );
      }
    } catch (err) {
      console.error('싫어요 실패:', err);
    }
  };

  const organizeComments = (comments) => {
    const commentMap = {};
    const roots = [];

    comments.forEach(comment => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    comments.forEach(comment => {
      if (comment.parentId && commentMap[comment.parentId]) {
        commentMap[comment.parentId].replies.push(commentMap[comment.id]);
      } else {
        roots.push(commentMap[comment.id]);
      }
    });

    return roots;
  };

  const organizedComments = organizeComments(comments);

  return (
    <div className="comment-section">
      <h3>댓글 ({comments.length})</h3>

      <CreateComment
        postId={postId}
        onSubmit={handleCommentSubmit}
        placeholder="댓글을 작성하세요..."
      />

      <div className="comment-list">
        {organizedComments.map(comment => (
          <Comment
            key={comment.id}
            comment={comment}
            currentUserId={userId}
            onUpdate={handleCommentUpdate}
            onDelete={handleCommentDelete}
            onLike={handleLike}
            onDislike={handleDislike}
            onReply={(id) => setReplyTo(id)}
            onEdit={(id) => setEditingId(id)}
            replyTo={replyTo}
            editingId={editingId}
            likedComments={likedComments}
            dislikedComments={dislikedComments}
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
        <div className="no-comments">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</div>
      )}
    </div>
  );
};

export default CommentSection;
