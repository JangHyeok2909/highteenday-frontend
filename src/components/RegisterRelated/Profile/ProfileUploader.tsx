import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import { uploadImage, validateImageFile } from "../../../utils/media";
import defaultImg from "../../../assets/default_profile_image.jpg";
import { Button, Card } from "../../ui";
import "./ProfileUploader.css";

interface ProfileUploaderProps {
  mode?: "register" | "edit";
}

function ProfileUploader({ mode = "register" }: ProfileUploaderProps) {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const isEdit = mode === "edit";
  const { refresh } = useAuth();

  // 파일 선택
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // 업로드
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("파일을 선택해주세요.");
      return;
    }

    setLoading(true);
    try {
      const url = await uploadImage(selectedFile);

      await axios.patch(
        "/api/media/profile-image",
        { url },
        { withCredentials: true }
      );

      if (!isEdit) await refresh();
      navigate(isEdit ? "/profile/edit" : "/welcome");
    } catch (err: any) {
      console.error("업로드 실패:", err);
      alert(err?.response?.data?.message || "업로드 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!isEdit) await refresh();
    navigate(isEdit ? "/profile/edit" : "/welcome");
  };

  return (
    <Card className="profile-uploader">
      <div className="profile-uploader__preview">
        <img
          src={preview || defaultImg}
          alt="프로필 미리보기"
          className="profile-uploader__image"
        />
      </div>

      <input
        type="file"
        name="file"
        accept="image/*"
        onChange={handleFileChange}
        className="profile-uploader__input"
      />

      <div className="profile-uploader__buttons">
        <Button fullWidth onClick={handleUpload} isLoading={loading}>
          {isEdit ? "프로필 이미지 변경" : "프로필 이미지 등록"}
        </Button>
        <Button fullWidth variant="secondary" onClick={handleCancel}>
          {isEdit ? "취소" : "건너뛰기"}
        </Button>
      </div>
    </Card>
  );
}

export default ProfileUploader;
