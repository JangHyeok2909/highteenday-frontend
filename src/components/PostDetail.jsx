import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentSection from './CommentSection';

function PostDetail({ postId }) {
  const [post, setPost] = useState(null);      // 게시글 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null);     // 에러 상태

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

      {/* 댓글 컴포넌트 렌더링 */}
      <CommentSection postId={postId} />
    </div>
  );
}

export default PostDetail;
