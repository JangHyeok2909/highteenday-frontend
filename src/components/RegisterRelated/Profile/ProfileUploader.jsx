import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfileUploader.css";
import defaultImg from "assets/default_profile_image.jpg";

// mode: "register" | "edit"
function ProfileUploader({ mode = "register" }) {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = mode === "edit";

  // 파일 선택
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // 업로드
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    try {
      const res = await axios.post("/api/media", formData, {
        withCredentials: true,
      });

      const url = res.headers["location"] || res.data.url;
      console.log("이미지 tmp 업로드 성공:", res.data);

      await axios.patch(
        "/api/media/profile-image",
        { url: url },
        { withCredentials: true }
      );

      console.log("프로필 설정 완료");
      navigate(isEdit ? "/profile/edit" : "/welcome");
    } catch (err) {
      console.error("업로드 실패:", err);
      alert("업로드 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(isEdit ? "/profile/edit" : "/welcome");
  };

  return (
    <div id="profile">
      <div className="profile-uploader-container">
        {/* 미리보기 */}
        <div className="profile-preview">
          <img
            src={preview || defaultImg}
            alt="Profile Preview"
            className="profile-image"
          />
        </div>

        {/* 파일 선택 */}
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={handleFileChange}
          className="profile-input"
        />

        {/* 버튼 */}
        <div className="profile-buttons">
          <button
            className="upload-button"
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? "업로드 중..." : isEdit ? "프로필 이미지 변경" : "프로필 이미지 등록"}
          </button>
          <button
            className="skip-button"
            onClick={handleCancel}
          >
            {isEdit ? "취소" : "건너뛰기"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileUploader;
