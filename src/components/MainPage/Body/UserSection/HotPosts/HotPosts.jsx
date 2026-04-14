import { useEffect, useState } from "react";
import "./HotPosts.css";
import "../../../../Default.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatBoardPreviewDate } from "../../../../../utils/dateFormat";


const HotPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/hotposts/daily", { withCredentials: true })
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.content ?? [];
        setPosts(list.filter((p) => p.id));
      })
      .catch((err) => {
        console.error("Hot posts fetch error:", err);
        setError(true);
      });
  }, []);

  const movePostHandler = (postId) => {
    navigate(`/board/post/${postId}`);
  };
  

  return (
    <div id="hot-posts">
      <div className="hotposts-container">
        <h2 className="hotposts-title">🔥 HOT 게시물</h2>

        {error || posts.length === 0 ? (
          <p className="no-posts">실시간 인기 게시글이 없습니다.</p>
        ) : (
          <table className="hotposts-table">
            <tbody>
              {posts.map((post, idx) => (
                <tr
                  key={post.id}
                  className="hotpost-row"
                  onClick={() => movePostHandler(post.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && movePostHandler(post.id)}
                >
                  <td className="post-rank">
                    <span className={`rank-badge ${idx < 3 ? "rank-top" : ""}`}>{idx + 1}</span>
                  </td>
                  <td className="post-title">{post.title}</td>
                  <td className="post-date">{formatBoardPreviewDate(post.createdAt)}</td>
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


