import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OAuthRegisterPage.css';

export default function OAuthRegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        nickname: '',
        phone: '',
        birth: '',
        gender: '',
        profileImage: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'profileImage') {
            setFormData((prev) => ({ ...prev, profileImage: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, val]) => {
            // FormData에 모든 form 필드 및 파일 첨부
            data.append(key, val);
        });

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_BASE}/auth/oauth/register`,
                data,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            alert('회원가입 완료!');
            navigate('/login');
        } catch (err) {
            console.error('Register Error:', err);
            alert('오류가 발생했습니다.');
        }
    };

    return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">추가 정보 입력</h2>
        <form onSubmit={handleSubmit}>
          <div className="signup-form-group"><label>이메일</label><input type="email" value={formData.email} name="email" readOnly /></div>
          <div className="signup-form-group"><label>닉네임</label><input type="text" name="nickname" value={formData.nickname} onChange={handleChange} required /></div>
          <div className="signup-form-group"><label>휴대폰 번호</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required /></div>
          <div className="signup-form-group"><label>생일</label><input type="date" name="birth" value={formData.birth} onChange={handleChange} required /></div>
          <div className="signup-form-group"><label>성별</label><select name="gender" value={formData.gender} onChange={handleChange} required><option value="">선택</option><option value="male">남성</option><option value="female">여성</option><option value="other">기타</option></select></div>
          <div className="signup-form-group"><label>프로필 이미지</label><input type="file" name="profileImage" accept="image/*" onChange={handleChange} /></div>
          <button type="submit" className="signup-button">회원가입 완료</button>
        </form>
      </div>
    </div>
  );
}
