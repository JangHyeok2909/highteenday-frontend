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
    console.log('Building tree from comments:', flatComments);
    
    const commentMap = {};
    const rootComments = [];

    flatComments.forEach(comment => {
      comment.replies = [];
      commentMap[comment.id] = comment;
      console.log(`Comment ${comment.id}: parentId=${comment.parentId}, content="${comment.content}"`);
    });

    flatComments.forEach(comment => {
      let parentId = comment.parentId;
      
      // parentId가 null인 경우, 멘션을 통해 부모 찾기 시도
      if ((parentId === null || parentId === undefined) && comment.content) {
        const mentionMatch = comment.content.match(/^@(\S+)\s+/);
        if (mentionMatch) {
          const mentionedUser = mentionMatch[1];
          console.log(`Comment ${comment.id} mentions: ${mentionedUser}`);
          
          // 멘션된 사용자의 가장 최근 댓글 찾기 
          const potentialParents = flatComments.filter(c => 
            c.id < comment.id && 
            (c.parentId === null || c.parentId === undefined) && 
            (
              (c.anonymous && mentionedUser === '익명') ||
              (!c.anonymous && c.author === mentionedUser)
            )
          ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          
          if (potentialParents.length > 0) {
            parentId = potentialParents[0].id;
            console.log(`Inferred parentId ${parentId} for comment ${comment.id} based on mention @${mentionedUser}`);
          }
        }
      }
      
      if (parentId !== null && parentId !== undefined) {
        const parent = commentMap[parentId];
        if (parent) {
          console.log(`Adding comment ${comment.id} as reply to ${parentId}`);
          parent.replies.push(comment);
          // 임시로 parentId 설정
          comment.parentId = parentId;
        } else {
          console.warn(`Parent comment ${parentId} not found for comment ${comment.id}, adding to root`);
          rootComments.push(comment);
        }
      } else {
        console.log(`Comment ${comment.id} is a root comment`);
        rootComments.push(comment);
      }
    });

    const sortByCreatedAt = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);
    
    rootComments.sort(sortByCreatedAt);
    
    Object.values(commentMap).forEach(comment => {
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.sort(sortByCreatedAt);
        console.log(`Comment ${comment.id} has ${comment.replies.length} replies:`, comment.replies.map(r => r.id));
      }
    });

    console.log('Final tree structure:', rootComments);
    return rootComments;
  };

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/posts/${postId}/comments`, {
        withCredentials: true,
      });
      
      console.log('Raw comments from API:', response.data); // 디버깅용
      
      const tree = buildCommentTree(response.data);
      
      console.log('Built comment tree:', tree); // 디버깅용
      
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
      const requestData = {
        content,
        parentId,
        anonymous,
        url: url || '',
        userId,
      };
      
      // 디버깅: 요청 데이터 로그
      console.log('Creating comment with data:', requestData);
      console.log('parentId type:', typeof parentId, 'value:', parentId);
      
      const response = await axios.post(
        `${API_BASE}/posts/${postId}/comments`,
        requestData,
        { withCredentials: true }
      );
      
      console.log('Comment creation response:', response.data);
      
      await fetchComments();
      
      if (parentId) {
        setReplyTarget(null);
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error creating comment:', err);
      console.error('Error response:', err.response?.data);
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

  const getTotalCommentCount = (comments) => {
    let count = 0;
    comments.forEach(comment => {
      count += 1; 
      if (comment.replies && comment.replies.length > 0) {
        count += comment.replies.length; 
      }
    });
    return count;
  };

  return (
    <div className="comment-section">
      <h3>댓글 ({getTotalCommentCount(comments)})</h3>

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