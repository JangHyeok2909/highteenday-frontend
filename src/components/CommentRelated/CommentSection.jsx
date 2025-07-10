// CommentSection.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Comment from './Comment';
import CreateComment from './CreateComment';
import './CommentSection.css';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await axios.get(`/api/posts/${postId}/comments`);
      setComments(data);
    } catch (err) {
      setError('댓글을 불러오는 데 실패했습니다.');
      console.error('댓글 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  // 댓글 추가 (API 호출 후 상태 업데이트)
  const addComment = useCallback((newComment) => {
    setComments(prev => [...prev, newComment]);
  }, []);

  // 댓글 수정
  const editComment = useCallback(async (commentId, newContent) => {
    const userId = localStorage.getItem('loginUserId');
    
    try {
      const response = await axios.put(
        `/api/posts/${postId}/comments/${commentId}`,
        {
          userId: parseInt(userId),
          content: newContent,
          anonymous: true // 기존 설정 유지하거나 별도 관리
        }
      );
      
      // 성공 시 로컬 상태 업데이트
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, content: newContent }
            : comment
        )
      );
    } catch (err) {
      console.error('댓글 수정 실패:', err);
      throw err;
    }
  }, [postId]);

  // 댓글 삭제
  const deleteComment = useCallback(async (commentId) => {
    const userId = localStorage.getItem('loginUserId');
    
    try {
      await axios.delete(`/api/posts/${postId}/comments/${commentId}`, {
        data: { userId: parseInt(userId) }
      });
      
      // 성공 시 로컬 상태 업데이트
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
      throw err;
    }
  }, [postId]);

  // 댓글 계층 구조 정리
  const normalizedComments = comments.map(c => ({
    ...c,
    parentId: c.parentId ?? null
  }));

  const roots = normalizedComments.filter(c => c.parentId === null);
  const byParent = {};
  normalizedComments.forEach(c => {
    if (c.parentId !== null) {
      (byParent[c.parentId] = byParent[c.parentId] || []).push(c);
    }
  });

  // 댓글 성공 핸들러
  const handleCommentSuccess = useCallback(() => {
    setReplyTo(null);
    fetchComments(); // 새로운 댓글 불러오기
  }, [fetchComments]);

  if (loading && comments.length === 0) {
    return (
      <div className="comment-section">
        <h3>댓글</h3>
        <div className="comment-loading">댓글을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="comment-section">
      <h3>댓글 ({comments.length})</h3>
      
      {error && (
        <div className="comment-error">
          {error}
          <button onClick={fetchComments}>다시 시도</button>
        </div>
      )}

      <div className="comment-list">
        {roots.length > 0 ? (
          roots.map(root => (
            <Comment
              key={root.id}
              comment={root}
              replies={byParent[root.id] || []}
              onReply={setReplyTo}
              onEdit={editComment}
              onDelete={deleteComment}
            />
          ))
        ) : (
          !loading && <div className="no-comments">아직 댓글이 없습니다.</div>
        )}
      </div>

      <CreateComment
        postId={postId}
        parentId={replyTo}
        onSuccess={handleCommentSuccess}
        onCancel={() => setReplyTo(null)}
      />
    </div>
  );
}

export default CommentSection;
