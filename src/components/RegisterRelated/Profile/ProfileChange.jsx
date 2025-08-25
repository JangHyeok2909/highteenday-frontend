import { useState } from "react";
import axios from "axios";
import "./ProfileChange.css";
import defaultProfile from "../../../assets/default-profile-image.jpg";

function ProfileEdit() {
  const [profileImg, setProfileImg] = useState(null);
  const [preview, setPreview] = useState(defaultProfile);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profileImg) {
      setMsg("변경할 프로필 사진을 선택하세요.");
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      // 1단계: 업로드
      const formData = new FormData();
      formData.append("profileImage", profileImg); // 서버가 기대하는 키 사용

      const uploadRes = await axios.post("/api/media/profileImg-save", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      // 응답 구조에 맞게 URL 추출
      const imageUrl =
        uploadRes.data.url ||
        (uploadRes.data.data && uploadRes.data.data.url);

      if (!imageUrl) {
        throw new Error("업로드 응답에서 이미지 URL을 찾을 수 없습니다.");
      }

      // 2단계: 프로필 업데이트
      await axios.put(
        "/api/user/updateProfileImage",
        { profileImageUrl: imageUrl },
        { withCredentials: true }
      );

      setMsg("프로필 사진이 변경되었습니다.");
      setPreview(imageUrl); // 새 URL을 미리보기에도 반영
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 413) {
        setMsg("파일 용량이 너무 커서 업로드할 수 없습니다.");
      } else {
        setMsg("프로필 사진 변경에 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="profile-edit">
      <header className="pe-header">
        <h1 className="pe-title">하이틴데이</h1>
        <hr className="pe-divider" />
      </header>

      <main className="pe-container">
        <h2 className="pe-heading">프로필 변경하기</h2>

        <div className="pe-avatar-wrapper">
          <img src={preview} alt="프로필" className="pe-avatar" />
          <label className="pe-camera-icon">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
            📷
          </label>
        </div>

        <button
          className="pe-submit-btn"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "저장 중..." : "확인"}
        </button>

        {msg && <p className="pe-message">{msg}</p>}
      </main>
    </div>
  );
}

export default ProfileEdit;
