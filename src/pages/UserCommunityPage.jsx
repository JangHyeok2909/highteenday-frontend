import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserCommunityPage.css";

function UserCommunityPage() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [scraps, setScraps] = useState([]);
  const navigate = useNavigate(); 
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };


  useEffect(() => {
    axios.get("/api/mypage/posts").then(res => setPosts(res.data));
    axios.get("/api/mypage/comments").then(res => setComments(res.data));
    axios.get("/api/mypage/scraps").then(res => setScraps(res.data));
  }, []);


  useEffect(() => {
  setPosts([{ id: 1, title: "테스트 게시글", createdAt: "2025-07-23" }]);
  setComments([{ postId: 1, content: "테스트 댓글", createdAt: "2025-07-23" }]);
  setScraps([{ id: 2, title: "스크랩 게시글", createdAt: "2025-07-22" }]);
}, []);


  return (
    <div className="community-container">
      <h2>커뮤니티</h2>

     <section>
  <h3 onClick={() => toggleSection('posts')}>📄 내가 쓴 게시글</h3>
  {openSection === 'posts' && (
    posts.length === 0 ? (
      <p>내가 쓴 게시물이 없습니다.</p>
    ) : (
      <ul>
        {posts.map((post) => (
          <li key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
            <span className="title">{post.title}</span>
            <span className="date">{post.createdAt}</span>
          </li>
        ))}
      </ul>
    )
  )}
</section>


   <section>
  <h3 onClick={() => toggleSection('comments')}>💬 내가 쓴 댓글</h3>
  {openSection === 'comments' && (
    comments.length === 0 ? (
      <p>내가 쓴 댓글이 없습니다.</p>
    ) : (
      <ul>
        {comments
          .filter((comment) => comment.postId)
          .map((comment, idx) => (
            <li key={idx} onClick={() => navigate(`/post/${comment.postId}`)}>
              <span className="title">{comment.content}</span>
              <span className="date">{comment.createdAt}</span>
            </li>
          ))}
      </ul>
    )
  )}
</section>


 <section>
  <h3 onClick={() => toggleSection('scraps')}>📌 스크랩한 게시글</h3>
  {openSection === 'scraps' && (
    scraps.length === 0 ? (
      <p>스크랩한 게시글이 없습니다.</p>
    ) : (
      <ul>
        {scraps.map((scrap, idx) => (
          <li key={idx} onClick={() => navigate(`/post/${scrap.id}`)}>
            <span className="title">{scrap.title}</span>
            <span className="date">{scrap.createdAt}</span>
          </li>
        ))}
      </ul>
    )
  )}
</section>

    </div>
  );
}

export default UserCommunityPage;
