import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Flame } from "lucide-react";
import { PostPreview, pickList } from "../../../../../types/models";
import { formatBoardPreviewDate } from "../../../../../utils/dateFormat";
import { Card } from "../../../../ui";
import "./HotPosts.css";

const HotPosts = () => {
  const [posts, setPosts] = useState<PostPreview[]>([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/hotposts/daily", { withCredentials: true })
      .then((res) => {
        const list = Array.isArray(res.data)
          ? (res.data as PostPreview[])
          : pickList<PostPreview>(res.data);
        setPosts(list.filter((p) => p.id));
      })
      .catch((err) => {
        console.error("Hot posts fetch error:", err);
        setError(true);
      });
  }, []);

  return (
    <Card
      className="hot-posts"
      title={
        <h2 className="hot-posts__title">
          <Flame size={16} /> HOT 게시물
        </h2>
      }
    >
      {error || posts.length === 0 ? (
        <p className="hot-posts__empty">실시간 인기 게시글이 없습니다.</p>
      ) : (
        <ol className="hot-posts__list">
          {posts.map((post, idx) => (
            <li key={post.id}>
              <button
                type="button"
                className="hot-posts__row"
                onClick={() => navigate(`/board/post/${post.id}`)}
              >
                <span
                  className={`hot-posts__rank ${
                    idx < 3 ? "hot-posts__rank--top" : ""
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="hot-posts__post-title">{post.title}</span>
                <span className="hot-posts__date">
                  {formatBoardPreviewDate(post.createdAt)}
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
};

export default HotPosts;
