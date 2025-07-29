import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@toast-ui/react-editor';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@toast-ui/editor/dist/toastui-editor.css';

function PostEditor() {
  const editorRef = useRef();
  const { postId } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!postId;
  const currentUserId = parseInt(localStorage.getItem('loginUserId'), 10);

  const [boardId, setBoardId] = useState('');
  const [title, setTitle] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  useEffect(() => {
    if (isEditMode) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/posts/${postId}`, {
          withCredentials: true,
        })
        .then((res) => {
          const data = res.data;
          setTitle(data.title);
          setIsAnonymous(data.anonymous);
          editorRef.current?.getInstance().setHTML(data.content);
          setBoardId(data.boardId || '');
        })
        .catch((err) => {
          console.error('게시글 로딩 실패:', err);
          alert('게시글을 불러오지 못했습니다.');
        });
    }
  }, [isEditMode, postId]);

  const handleSubmit = async () => {
    const content = editorRef.current.getInstance().getHTML();

    const postData = {
      title,
      content,
      anonymous: isAnonymous,
    };

    try {
      if (isEditMode) {
        await axios.put(
          `${process.env.REACT_APP_API_BASE_URL}/posts/${postId}`,
          postData,
          { withCredentials: true }
        );
        alert('게시글이 수정되었습니다.');
        navigate(`/posts/${postId}`);
      } else {
        const newPostData = {
          ...postData,
          boardId: Number(boardId),
        };

        const res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/posts`,
          newPostData,
          { withCredentials: true }
        );
        alert('게시글이 작성되었습니다.');
        const location = res.headers.location || '/';
        navigate(location.startsWith('/posts/') ? location : '/');
      }
    } catch (error) {
      console.error('게시글 저장 실패:', error);
      alert(isEditMode ? '수정 실패' : '작성 실패');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>{isEditMode ? '게시글 수정' : '게시글 작성'}</h2>

      {!isEditMode && (
        <input
          type="text"
          placeholder="Board ID"
          value={boardId}
          onChange={(e) => setBoardId(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
      )}

      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <Editor
        ref={editorRef}
        initialValue=""
        previewStyle="vertical"
        height="400px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        hooks={{
          addImageBlobHook: async (blob, callback) => {
            const formData = new FormData();
            formData.append('file', blob);

            try {
              const userId = localStorage.getItem("loginUserId");
              const res = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/media?userId=${userId}`,
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                  withCredentials: true,
                }
              );

              const imageUrl = res.headers['location'];
              callback(imageUrl, 'image');
            } catch (e) {
              console.error('이미지 업로드 실패:', e);
              alert('이미지 업로드에 실패했습니다.');
            }
          },
        }}
      />

      <label style={{ display: 'block', marginTop: '10px' }}>
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
        />
        익명으로 {isEditMode ? '수정' : '작성'}
      </label>

      <button onClick={handleSubmit} style={{ marginTop: '20px' }}>
        {isEditMode ? '수정 완료' : '작성 완료'}
      </button>
    </div>
  );
}

export default PostEditor;