import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BoardPreview.css";
import { formatBoardPreviewDate } from "../../../../../utils/dateFormat";

function BoardPreview({ boardId, boardName }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/boards/${boardId}/posts`, {
          params: { page: 0, size: 4, sortType: "RECENT" },
          withCredentials: true,
        });
        const postList =
          response.data.content ??
          response.data.postPreviewDtos ??
          response.data.postDtos ??
          [];
        setPosts(Array.isArray(postList) ? postList : []);
      } catch (err) {
        console.error(`${boardId} 게시판 불러오기 실패:`, err);
        setError(err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [boardId]);

  const renderContent = () => {
    if (loading) return <li className="post-item post-item--empty">로딩 중...</li>;
    if (error)   return <li className="post-item post-item--empty">게시글을 불러올 수 없습니다.</li>;
    if (posts.length === 0) return <li className="post-item post-item--empty">게시글이 없습니다.</li>;

    return posts.slice(0, 4).map((post) => (
      <li key={post.id} className="post-item">
        <Link to={`/board/post/${post.id}`} className="post-link">
          <span className="post-title" title={post.title}>
            {post.title}
            {post.commentCount > 0 && (
              <span className="post-comment-count">[{post.commentCount}]</span>
            )}
          </span>
          <span className="post-meta">
            <span className="post-author">{post.anonymous ? "익명" : (post.author ?? "")}</span>
            <span className="post-time">{formatBoardPreviewDate(post.createdAt)}</span>
          </span>
        </Link>
      </li>
    ));
  };

  return (
    <div className="board-preview">
      <div className="board-block">
        <div className="board-header">
          <h3 className="board-name">
            <Link to={`/board/${boardId}`}>{boardName}</Link>
          </h3>
          <Link to={`/board/${boardId}`} className="view-all-btn">
            전체보기
          </Link>
        </div>
        <ul className="post-list">
          {renderContent()}
        </ul>
      </div>
    </div>
  );
}

export default BoardPreview;
