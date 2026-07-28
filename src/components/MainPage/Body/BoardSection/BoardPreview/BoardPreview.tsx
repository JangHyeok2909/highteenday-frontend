import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { PostPreview, pickList } from "../../../../../types/models";
import { formatBoardPreviewDate } from "../../../../../utils/dateFormat";
import { Card, Skeleton } from "../../../../ui";
import "./BoardPreview.css";

interface BoardPreviewProps {
  boardId: number;
  boardName: string;
}

function BoardPreview({ boardId, boardName }: BoardPreviewProps) {
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await axios.get(`/api/boards/${boardId}/posts`, {
          params: { page: 0, size: 4, sortType: "RECENT" },
          withCredentials: true,
        });
        setPosts(pickList<PostPreview>(response.data));
      } catch (err) {
        console.error(`${boardId} 게시판 불러오기 실패:`, err);
        setError(true);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [boardId]);

  const renderContent = () => {
    if (loading) {
      return (
        <li className="board-preview__skeletons">
          <Skeleton height={14} />
          <Skeleton height={14} width="85%" />
          <Skeleton height={14} width="70%" />
        </li>
      );
    }
    if (error) {
      return (
        <li className="board-preview__empty">게시글을 불러올 수 없습니다.</li>
      );
    }
    if (posts.length === 0) {
      return <li className="board-preview__empty">게시글이 없습니다.</li>;
    }

    return posts.slice(0, 4).map((post) => (
      <li key={post.id} className="board-preview__item">
        <Link to={`/board/post/${post.id}`} className="board-preview__link">
          <span className="board-preview__title" title={post.title}>
            {post.title}
            {(post.commentCount ?? 0) > 0 && (
              <span className="board-preview__count">
                [{post.commentCount}]
              </span>
            )}
          </span>
          <span className="board-preview__meta">
            <span>{post.anonymous ? "익명" : post.author ?? ""}</span>
            <span>{formatBoardPreviewDate(post.createdAt)}</span>
          </span>
        </Link>
      </li>
    ));
  };

  return (
    <Card
      className="board-preview"
      title={
        <h3 className="board-preview__name">
          <Link to={`/board/${boardId}`}>{boardName}</Link>
        </h3>
      }
      headerAction={
        <Link to={`/board/${boardId}`} className="board-preview__more">
          전체보기
        </Link>
      }
    >
      <ul className="board-preview__list">{renderContent()}</ul>
    </Card>
  );
}

export default BoardPreview;
