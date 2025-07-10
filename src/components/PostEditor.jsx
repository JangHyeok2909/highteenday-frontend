import React, { useRef, useState } from 'react';
import { Editor } from '@toast-ui/react-editor';
import axios from 'axios';
import '@toast-ui/editor/dist/toastui-editor.css';

function PostEditor() {
  const editorRef = useRef(); 
  const userIdInputRef = useRef(); // ✅ ref로 userId 관리
  const [boardId, setBoardId] = useState('');
  const [title, setTitle] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  // ✅ 게시글 저장
  const handleSubmit = async () => {
    const currentUserId = userIdInputRef.current?.value;

    if (!currentUserId || isNaN(currentUserId)) {
      alert('User ID를 입력하세요.');
      return;
    }

    const content = editorRef.current.getInstance().getHTML();

    const postData = {
      userId: Number(currentUserId),
      boardId: Number(boardId),
      title,
      content,
      isAnonymous,
    };

    try {
      await axios.post('https://highteenday.duckdns.org/api/posts', postData);
      alert('게시글이 작성되었습니다.');
    } catch (error) {
      console.error(error);
      alert('작성 실패');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>게시글 작성</h2>

      {/* ✅ ref로 userId 입력 받음 */}
      <input
        type="text"
        placeholder="User ID"
        ref={userIdInputRef}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <input
        type="text"
        placeholder="Board ID"
        value={boardId}
        onChange={(e) => setBoardId(e.target.value)}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      
      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      {/* ✅ 텍스트 에디터 */}
      <Editor
        ref={editorRef}
        initialValue=""
        previewStyle="vertical"
        height="400px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}

        hooks={{
          // ✅ 이미지 업로드 훅
          addImageBlobHook: async (blob, callback) => {
            const currentUserId = userIdInputRef.current?.value;

            if (!currentUserId || isNaN(currentUserId)) {
              alert('이미지를 업로드하려면 User ID를 입력하세요.');
              return;
            }

            const formData = new FormData();
            formData.append('file', blob);
            formData.append('userId', Number(currentUserId)); // 숫자 변환 필수

            try {
              const res = await axios.post('/api/media', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              });

              const imageUrl = res.headers['location'];
              callback(imageUrl, 'image');
            } catch (e) {
              console.error('업로드 실패', e);
            }
          }
        }}
      />

      <label style={{ display: 'block', marginTop: '10px' }}>
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
        />
        익명으로 작성
      </label>

      <button onClick={handleSubmit} style={{ marginTop: '20px' }}>
        작성 완료
      </button>
    </div>
  );
}

export default PostEditor;
