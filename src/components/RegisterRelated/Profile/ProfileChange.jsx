import { useState } from "react";
import axios from "axios";
import "./ProfileChange.css";
import defaultProfile from "../../images/ddd.png"; // ✅ 기본 이미지 import

function ProfileEdit() {
  const [profileImg, setProfileImg] = useState(null);
  const [preview, setPreview] = useState(defaultProfile); // ✅ 기본 이미지 적용
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // 파일 선택
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file);
      setPreview(URL.createObjectURL(file)); // 선택 시 미리보기
    }
  };

  // 저장 처리
  const handleSave = async (e) => {
    e.preventDefault();
    if (!profileImg) {
      setMsg("변경할 프로필 사진을 선택하세요.");
      return;
    }

    setLoading(true);
    setMsg(null);

    try {
      const formData = new FormData();
      formData.append("profileImage", profileImg);

      // 실제 API 엔드포인트 연결 필요
      await axios.post("/api/user/updateProfileImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setMsg("프로필 사진이 변경되었습니다.");
    } catch (err) {
      console.error(err);
      setMsg("프로필 사진 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="profile-edit">
      {/* 상단 헤더 */}
      <header className="pe-header">
        <h1 className="pe-title">하이틴데이</h1>
        <hr className="pe-divider" />
      </header>

      {/* 본문 */}
      <main className="pe-container">
        <h2 className="pe-heading">프로필 변경하기</h2>

        <div className="pe-avatar-wrapper">
          <img
            src={preview}
            alt="프로필"
            className="pe-avatar"
          />
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
