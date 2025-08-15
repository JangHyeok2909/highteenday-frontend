import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./CreateAccount.css";

function CreateAccount() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    nickname: "",
    phone: "",
    email: "",
    birth: "",
    gender: "",
    profileImage: null,
    school: "",
  });

  useEffect(() => {
    if (location.state) {
      setForm((prev) => ({
        ...prev,
        ...location.state, 
      }));
    }
  }, [location.state]);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleImageSource = (e) => {
    const selected = e.target.value;
    if (selected === "file") {
      fileInputRef.current.click();
    } else if (selected === "camera") {
      cameraInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      const res = await axios.post("/api/user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert("회원가입 성공!");
      console.log("회원가입 응답:", res.data);
      navigate("/");
    } catch (err) {
      console.error("회원가입 실패:", err);
      alert(err.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="form-container">
      <form className="account-form" onSubmit={handleSubmit}>
        <label>닉네임 [필수]</label>
        <input
          type="text"
          name="nickname"
          placeholder="입력하세요."
          required
          value={form.nickname}
          onChange={handleChange}
        />

        <label>휴대폰 번호 [필수]</label>
        <input
          type="tel"
          name="phone"
          placeholder="010-xxxx-xxxx"
          required
          value={form.phone}
          onChange={handleChange}
        />

        <label>이메일 [필수]</label>
        <input
          type="email"
          name="email"
          placeholder="HighteenDay@example.com"
          required
          value={form.email}
          onChange={handleChange}
        />

        <label>생일 [필수]</label>
        <input
          type="date"
          name="birth"
          required
          value={form.birth}
          onChange={handleChange}
        />

        <label>성별</label>
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">선택</option>
          <option value="남자">남자</option>
          <option value="여자">여자</option>
          <option value="공개 안함">공개 안함</option>
        </select>

        <label>사용자 이미지</label>
        <select onChange={handleImageSource} defaultValue="">
          <option value="" disabled>
            선택하세요
          </option>
          <option value="file">파일</option>
          <option value="camera">사진 찍기</option>
        </select>

        <input
          type="file"
          accept="image/*"
          name="profileImage"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleChange}
        />

        <input
          type="file"
          accept="image/*"
          capture="environment"
          name="profileImage"
          ref={cameraInputRef}
          style={{ display: "none" }}
          onChange={handleChange}
        />

        <label>학교</label>
        <input
          type="text"
          name="school"
          value={form.school}
          readOnly
          placeholder="학교를 검색하세요."
        />

        <div className="button-wrapper">
          <button
            type="button"
            className="submit-button"
            onClick={() => navigate("/school", { state: form })}
          >
            학교 검색
          </button>
        </div>

        <div className="button-wrapper">
          <button type="submit" className="submit-button">
            완료
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAccount;
