import { useEffect, useState } from "react";
import "./HotPosts.css";
import "../../../../Default.css"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


const HotPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 실제 API 요청 (현재는 주석 처리)
    axios
      .get("/api/hotposts/daily")
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        console.error("Hot posts fetch error:", err);
        setError(true);
      });

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

  const movePostHandler = ({postId}) => {
    navigate(`/board/post/${postId}`);
  }
  

  return (
    <div id="hot-posts">
      <div className="hotposts-container">
        <h2 className="hotposts-title">🔥 HOT 게시물</h2>

        {error || posts.length === 0 ? (
          <p className="no-posts">실시간 인기 게시글이 없습니다.</p>
        ) : (
          <table className="hotposts-table">
            <tbody>
              {posts.map((post) => (
                <tr 
                  key={post.id} className="hotpost-row"
                  onClick={() => movePostHandler(post.id)}
                >
                  <td className="post-title">{post.title}</td>
                  <td className="post-date">{formatDate(post.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HotPosts;


