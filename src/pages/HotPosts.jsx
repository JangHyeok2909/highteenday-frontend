import { useEffect, useState } from "react";
import axios from "axios";
import "./HotPosts.css";

const HotPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    // 실제 API 요청 (현재는 주석 처리)
    // axios
    //   .get("/api/hotposts/daily")
    //   .then((res) => {
    //     setPosts(res.data);
    //   })
    //   .catch((err) => {
    //     console.error("Hot posts fetch error:", err);
    //     setError(true);
    //   });

    // 디자인 확인용 임시 데이터
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
        author: "망고",
        title: "두 번째 게시글 제목",
        content: "확인용",
        viewCount: 56,
        likeCount: 13,
        commentCount: 2,
        createdAt: "2025-07-29T10:02:00Z",
      },
    ];

    setPosts(dummyPosts);
  }, []);

  // 날짜 포맷 함수 (MM.DD HH:MM)
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString("ko-KR", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="hotposts-container">
      <h2 className="hotposts-title">🔥 HOT 게시물</h2>

      {error || posts.length === 0 ? (
        <p className="no-posts">실시간 인기 게시글이 없습니다.</p>
      ) : (
        <table className="hotposts-table">
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="hotpost-row">
                <td className="post-title">{post.title}</td>
                <td className="post-date">{formatDate(post.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HotPosts;


