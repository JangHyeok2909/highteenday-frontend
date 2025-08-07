import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BoardPreview.css";

// 게시판 설정 객체
const BOARD_CONFIGS = {
  1: { name: "free", displayName: "자유게시판" },
  2: { name: "exam", displayName: "수능게시판" },
  3: { name: "science", displayName: "이과게시판" },
  4: { name: "liberal", displayName: "문과게시판" }
};

function BoardPreview({ boardId, customBoardName = null }) {
  const [posts, setPosts] = useState([]);
  const [boardName, setBoardName] = useState("");
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
        
        // 게시판 이름 우선순위: customBoardName > API 응답 > 설정 객체 > 기본값
        const displayName = customBoardName || 
                           response.data.boardName || 
                           BOARD_CONFIGS[boardId]?.displayName || 
                           `게시판 ${boardId}`;
        setBoardName(displayName);
        
      } catch (err) {
        console.error(`${boardId} 게시판 불러오기 실패:`, err);
        setError(err);
        setPosts([]);
        
        // 에러 시에도 게시판 이름은 표시
        const displayName = customBoardName || 
                           BOARD_CONFIGS[boardId]?.displayName || 
                           `게시판 ${boardId}`;
        setBoardName(displayName);
      } finally {
        setLoading(false);
      }
    };

    if (boardId) {
      fetchPosts();
    }
  }, [boardId, customBoardName]);

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
        <Link to={`/board/${boardId}/post/${post.id}`} className="post-link">
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
    <div className="board-block">
      <div className="board-header">
        <h3 className="board-name">{boardName}</h3>
        <Link to={`/board/${boardId}`} className="view-all-btn">
          전체보기
        </Link>
      </div>
      <ul className="post-list">
        {renderPostList()}
      </ul>
    </div>
  );
}

// 특정 게시판용 컴포넌트들 (기존 컴포넌트와의 호환성을 위해)
export function BoardPreviewFree() {
  return <BoardPreview boardId={1} />;
}

export function BoardPreviewExam() {
  return <BoardPreview boardId={2} />;
}

export function BoardPreviewScience() {
  return <BoardPreview boardId={3} />;
}

export function BoardPreviewLiberal() {
  return <BoardPreview boardId={4} />;
}

export default BoardPreview;