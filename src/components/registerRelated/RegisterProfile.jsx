import React, { useState } from "react";
import axios from "axios";

function RegisterProfile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);


  // 파일 선택
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    // 이미지 미리보기
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
      const res = await axios.post
      ("/api/media", formData, 
        { withCredentials: true, }
      );
      const url = res.headers.get("Location");
      console.log("이미지 tmp 업로드 성공:", res.data);
      res = await axios.post(
        "/api/media/profileImg-save",
        { url: url },
        { withCredentials: true }
      );
      console.log("프로필 설정 완료:", res.data);
      navigator("/welcome");
    } catch (err) {
      console.error("업로드 실패:", err);
      alert("업로드 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>프로필 사진 설정</h2>

      {/* 이미지 미리보기 */}
      {preview && <img src={preview} alt="preview" width={150} height={150} />}

      {/* 파일 선택 */}
      <input type="file" name="file" accept="image/*" onChange={handleFileChange} />

      {/* 업로드 버튼 */}
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "업로드 중..." : "사진 업로드"}
      </button>
      <button onClick={()=>navigator("/welcome")}>건너뛰기</button>
    </div>
  );
}

export default RegisterProfile;
