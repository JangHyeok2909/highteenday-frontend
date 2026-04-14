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
      // 1단계: 임시 업로드
      const formData = new FormData();
      formData.append("file", profileImg);

      const uploadRes = await axios.post("/api/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const tmpUrl = uploadRes.headers["location"];

      if (!tmpUrl) {
        throw new Error("업로드 응답에서 이미지 URL을 찾을 수 없습니다.");
      }

      // 2단계: 프로필 확정 (tmp → profile-file 복사)
      await axios.patch(
        "/api/media/profile-image",
        { url: tmpUrl },
        { withCredentials: true }
      );

      setMsg("프로필 사진이 변경되었습니다.");
      setPreview(tmpUrl);
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
    <div id="P-Change" className="default-root-value">
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
