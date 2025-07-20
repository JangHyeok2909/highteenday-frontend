import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Comment from './Comment';
import CreateComment from './CreateComment';
import "./CommentSystem.css";
import { data } from 'react-router-dom';


const API_BASE = process.env.REACT_APP_API_BASE_URL;

const CommentSection = ({ postId, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [likedComments, setLikedComments] = useState([]);
  const [dislikedComments, setDislikedComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 익명 유저 번호 부여
  const assignAnonymousNumbers = (comments) => {
    let anonCount = 0;
    const anonMap = new Map();

    comments.forEach(c => {
      if (c.isAnonymous) {
        const key = c.user?.id || c.anonymousId || c.id;
        if (!anonMap.has(key)) {
          anonCount++;
          anonMap.set(key, anonCount);
        }
        c.anonymousNumber = anonMap.get(key);
      }
    });
  };

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/posts/${postId}/comments`, { withCredentials: true });
      assignAnonymousNumbers(res.data);
      setComments(res.data);
    } catch (err) {
      setError('댓글을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (postId) fetchComments();
  }, [fetchComments]);

  const handleCommentSubmit = async (content, parentId = null) => {
  try {
    const res = await axios.post(`${API_BASE}/posts/${postId}/comments`, {
      content,
      parentId,
      anonymous: false,
      url: '',
    }, { withCredentials: true });

    if (res.status === 201) {
      await fetchComments();
      setReplyTo(null);
      return { success: true };
    }
  } catch (err) {
    return { success: false, error: '댓글 작성에 실패했습니다.' };
  }
};

  const handleCommentUpdate = async (commentId, content) => {
    try {
      const res = await axios.put(`${API_BASE}/posts/${postId}/comments/${commentId}`, {
        content,
        anonymous: false,
        url: '',
      }, { withCredentials: true });

      if (res.status === 200) {
        await fetchComments();
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: '댓글 수정에 실패했습니다.' };
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const res = await axios.delete(`${API_BASE}/posts/${postId}/comments/${commentId}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        await fetchComments();
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: '댓글 삭제에 실패했습니다.' };
    }
  };

  const handleLike = async (commentId) => {
    try {
      await axios.post(`${API_BASE}/comments/${commentId}/like`, {}, { withCredentials: true });
      await fetchComments();
      setLikedComments(prev => prev.includes(commentId) ? prev.filter(id => id !== commentId) : [...prev, commentId]);
      setDislikedComments(prev => prev.filter(id => id !== commentId));
    } catch (err) {
      console.error('좋아요 실패:', err);
    }
  };

  const handleDislike = async (commentId) => {
    try {
      await axios.post(`${API_BASE}/comments/${commentId}/dislike`, {}, { withCredentials: true });
      await fetchComments();
      setDislikedComments(prev => prev.includes(commentId) ? prev.filter(id => id !== commentId) : [...prev, commentId]);
      setLikedComments(prev => prev.filter(id => id !== commentId));
    } catch (err) {
      console.error('싫어요 실패:', err);
    }
  };

  const organizeComments = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach(c => {
      map[c.id] = { ...c, replies: [] };
    });

    comments.forEach(c => {
      if (c.parentId && map[c.parentId]) {
        map[c.parentId].replies.push(map[c.id]);
      } else {
        roots.push(map[c.id]);
      }
    });

    return roots;
  };

  const organizedComments = organizeComments(comments);

  const getDisplayName = (comment) =>
    comment.isAnonymous ? `익명#${comment.anonymousNumber}` : comment.author || '알 수 없음';

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
            currentUserId={currentUserId}
            onSubmitReply={handleCommentSubmit}
            onUpdate={handleCommentUpdate}
            onDelete={handleCommentDelete}
            onLike={handleLike}
            onDislike={handleDislike}
            onReplyClick={(id, author) => setReplyTo({ parentId: id, parentAuthor: author })}
            replyTarget={replyTo}
            likedComments={likedComments}
            dislikedComments={dislikedComments}
            getDisplayName={getDisplayName}
          />
        ))}
      </div>

      {replyTo && (
        <CreateComment
          postId={postId}
          parentId={replyTo.parentId}
          onSubmit={(content) =>
            handleCommentSubmit(`@${replyTo.parentAuthor} ${content}`, replyTo.parentId)
          }
          onCancel={() => setReplyTo(null)}
          placeholder={`@${replyTo.parentAuthor} 님에게 답글`}
        />
      )}

      {!comments.length && <div className="no-comments">첫 댓글을 남겨보세요!</div>}
    </div>
  );
};

export default CommentSection;
