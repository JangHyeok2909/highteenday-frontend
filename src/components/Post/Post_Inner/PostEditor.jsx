import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@toast-ui/react-editor';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '@toast-ui/editor/dist/toastui-editor.css';
import './PostEditor.css';

const boardNameMap = {
  1: '자유게시판',
  2: '수능게시판',
  3: '이과게시판',
  4: '문과게시판',
};

function PostEditor() {
  const editorRef = useRef();
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isEditMode = !!postId;

  // 글쓰기 진입 시 state로 넘어온 boardId 사용 (없으면 '1')
  const initialBoardId = location.state?.boardId != null ? String(location.state.boardId) : '1';
  const [boardId, setBoardId] = useState(initialBoardId);
  const [title, setTitle] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  useEffect(() => {
    if (isEditMode) {
      axios
        .get(`/api/posts/${postId}`, {
          withCredentials: true,
        })
        .then((res) => {
          const data = res.data;
          setTitle(data.title);
          setIsAnonymous(data.anonymous);
          editorRef.current?.getInstance().setHTML(data.content);
          setBoardId(data.boardId != null ? String(data.boardId) : '1');
        })
        .catch((err) => {
          console.error('게시글 로딩 실패:', err);
          alert(err?.response?.data?.message || '게시글을 불러오지 못했습니다.');
        });
    }
  }, [isEditMode, postId]);

  const handleSubmit = async () => {
    const trimmedTitle = (title || '').trim();
    if (!trimmedTitle) {
      alert('제목을 입력해주세요.');
      return;
    }

    const rawHtml = editorRef.current.getInstance().getHTML();
    const textContent = (rawHtml || '').replace(/<[^>]*>/g, '');
    const meaningful = textContent.replace(/\s*(Write|Preview|Markdown|WYSIWYG)\s*/gi, '').trim();
    if (!meaningful) {
      alert('본문 내용을 입력해주세요.');
      return;
    }
    // 백엔드가 빈 <p><br></p>를 제거하므로 &nbsp;로 치환해서 보존
    const content = rawHtml.replace(/<p><br\s*\/?><\/p>/gi, '<p>&nbsp;</p>');
    const postData = {
      title: trimmedTitle,
      content,
      anonymous: isAnonymous,
    };

    try {
      if (isEditMode) {
        await axios.patch(
          `/api/posts/${postId}`,
          postData,
          { withCredentials: true }
        );
        alert('게시글이 수정되었습니다.');
        navigate(`/board/post/${postId}`);
      } else {
        const newPostData = {
          ...postData,
          boardId: Number(boardId),
        };

        const res = await axios.post(
          `/api/posts`,
          newPostData,
          { withCredentials: true }
        );
        alert('게시글이 작성되었습니다.');
        const location = res.headers?.location || '';
        const idFromLocation = location.match(/\/(\d+)\s*$/)?.[1];
        const newPostId = res.data?.id ?? idFromLocation;
        if (newPostId) {
          navigate(`/board/post/${newPostId}`);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('게시글 저장 실패:', error);
      alert(error?.response?.data?.message || (isEditMode ? '수정 실패' : '작성 실패'));
    }
  };

  const handleCancel = () => {
    if (isEditMode && postId) {
      navigate(`/board/post/${postId}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="post-editor">
      <div className="editor-section">
        {!isEditMode && (
          <div className="form-row">
            <label className="form-label">게시판</label>
            <select
              className="form-select"
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
            >
              {Object.entries(boardNameMap).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-row">
          <label className="form-label">제목</label>
          <input
            type="text"
            className="form-input"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label className="form-label">내용</label>
          <div className="editor-wrapper">
            <Editor
              ref={editorRef}
              initialValue=" "
              previewStyle="vertical"
              height="400px"
              initialEditType="wysiwyg"
              useCommandShortcut={true}
              hideModeSwitch={true}
              onLoad={() => {
                if (!isEditMode) {
                  requestAnimationFrame(() => {
                    const editor = editorRef.current?.getInstance();
                    if (editor) {
                      if (typeof editor.reset === 'function') editor.reset();
                      else editor.setHTML('<p><br></p>');
                    }
                  });
                }
              }}
              hooks={{
                addImageBlobHook: async (blob, callback) => {
                  const formData = new FormData();
                  formData.append('file', blob);

                  try {
                    const userId = localStorage.getItem("loginUserId");
                    const res = await axios.post(
                      `/api/media?userId=${userId}`,
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
                    alert(e?.response?.data?.message || '이미지 업로드에 실패했습니다.');
                  }
                },
              }}
            />
          </div>
        </div>

        <div className="anonymous-row">
          <input
            id="anonymous-check"
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <label htmlFor="anonymous-check">
            익명으로 {isEditMode ? '수정' : '작성'}
          </label>
        </div>

        <div className="submit-row">
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            취소
          </button>
          <button type="button" className="btn-submit" onClick={handleSubmit}>
            {isEditMode ? '수정 완료' : '작성 완료'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostEditor;