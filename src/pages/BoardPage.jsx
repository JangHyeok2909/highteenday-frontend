import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./BoardPage.css";

const POSTS_PER_PAGE = 10;

const boardNames = {
  1: "자유게시판",
  2: "비밀게시판",
  3: "졸업생게시판",
  4: "새내기게시판",
};


export default function BoardPage() {
  const { boardId } = useParams();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
 const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    setPage(0); // board 바뀌면 1페이지로
    setIsInitialLoad(false);
  }, [boardId]);


  useEffect(() => {
    if (isInitialLoad) return; // 초기 로드 시에는 API 호출하지 않음

    const fetchPosts = async () => {
      try {
        const res = await axios.get(`https://highteenday.duckdns.org/api/boards/${boardId}/posts`, {
          params: { 
            page, 
            size: 10, 
            sortType: "RECENT" },
            withCredentials: true,
        });
        setPosts(Array.isArray(res.data.postDtos) ? res.data.postDtos : []);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        setPosts([]);      }
    };
    fetchPosts();
  }, [ page, boardId, isInitialLoad]);

 
  


    return (
    <div className="board-page-container">
      <h2>{boardNames[boardId] || `${boardId} 게시판`}</h2>


      <ul className="post-list">
        {Array.isArray(posts) && posts.length > 0 ? (
            posts.map((post) => (
                <li key={post.id} className="post-item">
                    <Link to={`/board/${boardId}/post/${post.id}`}>
                        <span className="post-title">{post.title}</span>
                        <span className="post-time">{post.createdAt}</span>
                    </Link>
                </li>
            ))
        ) : (
            <li className="post-item">게시글이 없습니다.</li>
        )}
      </ul>



      {/*  4. 페이지네이션 */}
      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}>이전</button>
        <span>{page + 1} 페이지</span>
        <button onClick={() => setPage((p) => p + 1)}>다음</button>
      </div>
    </div>
  );
}