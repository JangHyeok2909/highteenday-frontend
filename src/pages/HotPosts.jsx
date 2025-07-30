// src/pages/HotPosts.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "./HotPosts.css";

const HotPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
  //  axios
  //    .get("/api/hotposts/daily")
  //    .then((res) => {
  //      console.log("🔥 서버 응답:", res.data);
  //      setPosts(res.data);
  //    })
  //    .catch((err) => {
  //      console.error("Hot posts fetch error:", err);
  //      setError(true);
  //    });

  //디자인 확인용 임시 데이터
   const dummyPosts = [
      {
        id: 1,
        author: "망고",
        title: "첫 번째 임시 게시글",
        content: "임시로 만든 게시글 내용. 디자인 확인용.",
        viewCount: 123,
        likeCount: 42,
        commentCount: 7,
        createdAt: "2025-07-30T14:23:00Z",
      },
      {
        id: 2,
        author: "덩크",
        title: "두 번째 게시글 제목",
        content:
          "컹컹컹",
        viewCount: 56,
        likeCount: 13,
        commentCount: 2,
        createdAt: "2025-07-29T10:02:00Z",
      },
    ];

    setPosts(dummyPosts);
  }, []);

  // 날짜 포맷 함수 (YYYY.MM.DD HH:MM)
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="hotposts-container">
      <h2 className="hotposts-title">🔥 실시간 인기 게시글</h2>

      {error || posts.length === 0 ? (
        <p className="no-posts">실시간 인기 게시글이 없습니다.</p>
      ) : (
        <ul className="hotposts-list">
          {posts.map((post) => (
            <li key={post.id} className="hotpost-card">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-author">
                작성자: {post.author} · {formatDate(post.createdAt)}
              </p>
              <div className="post-meta">
                <span>👍 {post.likeCount}</span>
                <span>💬 {post.commentCount}</span>
                <span>👀 {post.viewCount}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HotPosts;
