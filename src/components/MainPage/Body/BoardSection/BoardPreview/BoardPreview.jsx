import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BoardPreview.css";

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
          params: { page: 0, sortType: "RECENT" },
          withCredentials: true,
        });
        
        console.log(`${boardId} 게시판 응답:`, response.data);
        
        // API 응답에서 게시글과 게시판 이름 설정
        setPosts(response.data.postDtos || []);
        
        
      } catch (err) {
        console.error(`${boardId} 게시판 불러오기 실패:`, err);
        setError(err);
        setPosts([]);

      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return "";
    
    try {
      const date = new Date(isoString);
      return date.toLocaleString("ko-KR", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("날짜 포맷팅 오류:", error);
      return "";
    }
  };

  const renderPostList = () => {
    if (loading) {
      return <li className="post-item">로딩 중...</li>;
    }

    if (error) {
      return <li className="post-item">게시글을 불러올 수 없습니다.</li>;
    }

    if (posts.length === 0) {
      return <li className="post-item">게시글이 없습니다.</li>;
    }

    return posts.slice(0, 4).map((post) => (
      <li key={post.id} className="post-item">
        <Link to={`/board/post/${post.id}`} className="post-link">
          <span className="post-title" title={post.title}>
            {post.title}
          </span>
          <span className="post-time">
            {formatDate(post.createdAt)}
          </span>
        </Link>
      </li>
    ));
  };

  return (
    <div id="board-preview">
      <div className="board-block">
        <div className="board-header">
          <h3 className="board-name">{boardName}</h3>
          <Link to={`/board/${boardId}`} className="view-all-btn">
            전체보기
          </Link>
        </div>
        
        <ul className="post-list">
          {posts.length > 0 ? (
            posts.slice(0, 4).map((post) => (
              <li key={post.id} className="post-item">
                <Link to={`/board/post/${post.id}`} className="post-link">
                  <span className="post-title">{post.title}</span>
                  <span className="post-time">
                    {formatDate(post.createdAt)}
                  </span>
                </Link>
              </li>
            ))
          ) : (
            <li className="post-item">게시글이 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default BoardPreview;