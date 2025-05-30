import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PostDetail({ postId}) {
  const [post, setPost] = useState(null); // 게시글 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null);     // 에러 상태

  /*페이지가 다 렌더링 된 후에 postId가 변경될 때마다 
  서버로 postId에 해당하는 게시글을 가져와 화면에 보여줌*/
  useEffect(() => {
    setLoading(true);       
    setError(null);
    setPost(null); 
    
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/api/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        setError('게시글을 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;
  if (!post) return <p>게시글이 존재하지 않습니다.</p>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{post.title}</h1>
      <p style={{ color: 'gray', fontSize: '14px' }}>
        작성자: {post.author} | 조회수: {post.viewCount} | 좋아요: {post.likeCount}
      </p>
      <hr />
      <div
        dangerouslySetInnerHTML={{ __html: post.content }}
        style={{ marginTop: '20px' }}
      />
<<<<<<< HEAD

      {/* 🔽 댓글 섹션 렌더링 */}
      <div style={{ marginTop: '40px' }}>
        <CommentSection postId={postId} />
      </div>
=======
>>>>>>> b7163ebce2d69bad88bceac2c1f6ec1441a8e420
    </div>
  );
}

<<<<<<< HEAD
export default PostDetail;
=======
export default PostDetail;
>>>>>>> b7163ebce2d69bad88bceac2c1f6ec1441a8e420
