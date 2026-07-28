import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Comment from "./Comment";
import CreateComment from "./CreateComment";
import { useAuth } from "../../contexts/AuthContext";
import { Comment as CommentModel } from "../../types/models";
import { Card, Spinner } from "../ui";
import "./CommentSystem.css";

export interface ReplyTarget {
  parentId: number;
  parentAuthor: string;
}

export interface CreateResult {
  success: boolean;
  error?: string;
}

interface CommentSectionProps {
  postId: string | number | undefined;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [replyTarget, setReplyTarget] = useState<ReplyTarget | null>(null);
  const [likedComments, setLikedComments] = useState<number[]>([]);
  const [dislikedComments, setDislikedComments] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { isLogin } = useAuth();
  const navigate = useNavigate();

  const buildCommentTree = (flatComments: CommentModel[]): CommentModel[] => {
    const commentMap: Record<number, CommentModel> = {};
    const rootComments: CommentModel[] = [];

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
          parent.replies!.push(c);
        } else {
          rootComments.push(c);
        }
      }
    });

    const sortByCreatedAt = (a: CommentModel, b: CommentModel) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    rootComments.sort(sortByCreatedAt);
    Object.values(commentMap).forEach((c) => {
      if (c.replies && c.replies.length > 0) c.replies.sort(sortByCreatedAt);
    });

    return rootComments;
  };

  const fetchComments = useCallback(
    async (silent = false) => {
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      try {
        const response = await axios.get<CommentModel[]>(
          `/api/posts/${postId}/comments`,
          { withCredentials: true }
        );
        const flat = Array.isArray(response.data) ? response.data : [];
        setLikedComments(flat.filter((c) => c.liked).map((c) => c.id));
        setDislikedComments(flat.filter((c) => c.disliked).map((c) => c.id));
        setComments(buildCommentTree(flat));
      } catch (err) {
        console.error(err);
        if (!silent) setError("댓글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [postId]
  );

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCreate = async (
    content: string,
    imageUrl: string,
    parentId: number | null,
    anonymous: boolean
  ): Promise<CreateResult> => {
    try {
      const requestData = {
        content: content ?? "",
        parentId: parentId ?? null,
        anonymous: Boolean(anonymous),
        url: imageUrl || "",
      };

      await axios.post(`/api/posts/${postId}/comments`, requestData, {
        withCredentials: true,
      });

      await fetchComments();

      if (parentId) {
        setReplyTarget(null);
      }

      return { success: true };
    } catch (err: any) {
      console.error("댓글 작성 실패:", err);
      return {
        success: false,
        error: err.response?.data?.message || "댓글 작성에 실패했습니다.",
      };
    }
  };

  const handleUpdate = async (
    commentId: number,
    content: string,
    url: string
  ) => {
    try {
      await axios.patch(
        `/api/posts/${postId}/comments/${commentId}`,
        {
          content: content ?? "",
          url: url || "",
          anonymous: false,
        },
        { withCredentials: true }
      );
      fetchComments();
    } catch (err) {
      console.error("댓글 수정 실패:", err);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/api/posts/${postId}/comments/${commentId}`, {
        withCredentials: true,
      });
      fetchComments();
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
    }
  };

  const handleLike = async (commentId: number) => {
    if (!isLogin) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `/api/comments/${commentId}/reaction?type=LIKE`,
        {},
        { withCredentials: true }
      );
      setLikedComments((prev) =>
        prev.includes(commentId)
          ? prev.filter((id) => id !== commentId)
          : [...prev, commentId]
      );
      setDislikedComments((prev) => prev.filter((id) => id !== commentId));
      fetchComments(true);
    } catch (err) {
      console.error("좋아요 실패:", err);
    }
  };

  const handleDislike = async (commentId: number) => {
    if (!isLogin) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `/api/comments/${commentId}/reaction?type=DISLIKE`,
        {},
        { withCredentials: true }
      );
      setDislikedComments((prev) =>
        prev.includes(commentId)
          ? prev.filter((id) => id !== commentId)
          : [...prev, commentId]
      );
      setLikedComments((prev) => prev.filter((id) => id !== commentId));
      fetchComments(true);
    } catch (err) {
      console.error("싫어요 실패:", err);
    }
  };

  const handleReplyClick = (parentId: number, parentAuthor: string) => {
    setReplyTarget({ parentId, parentAuthor });
  };
  const handleCancelReply = () => setReplyTarget(null);

  const getTotalCommentCount = (items: CommentModel[]) => {
    let count = 0;
    items.forEach((c) => {
      count += 1;
      if (c.replies && c.replies.length > 0) count += c.replies.length;
    });
    return count;
  };

  return (
    <Card className="comment-section">
      <h3 className="comment-section-title">
        댓글 ({getTotalCommentCount(comments)})
      </h3>

      <CreateComment onSubmit={handleCreate} onCancel={null} parentId={null} />

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="comment-loading">
          <Spinner size={22} />
        </div>
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
    </Card>
  );
};

export default CommentSection;
