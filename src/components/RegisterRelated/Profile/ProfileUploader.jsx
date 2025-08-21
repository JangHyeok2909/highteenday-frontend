import React, { useState } from "react";
import axios from "axios";
import "./ProfileUploader.css"; 
import defaultImg from "assets/default_profile_image.jpg";


function ProfileUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

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

      const url = res.headers["location"] || res.data.url; // 서버 반환에 맞춰 조정
      console.log("이미지 tmp 업로드 성공:", res.data);

      await axios.post(
        "/api/media/profileImg-save",
        { url: url },
        { withCredentials: true }
      );

      console.log("프로필 설정 완료");
      window.location.href = "/welcome"; // navigator 대신
    } catch (err) {
      console.error("업로드 실패:", err);
      alert("업로드 실패");
    } finally {
      setLoading(false);
    }
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
            {loading ? "업로드 중..." : "사진 업로드"}
          </button>
          <button
            className="skip-button"
            onClick={() => (window.location.href = "/")}
          >
            건너뛰기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileUploader;
