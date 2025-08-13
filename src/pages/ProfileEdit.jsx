import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProfileEdit.css';

function ProfileEdit() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    nickname: '',
    school: '',
    grade: '',
    email: ''
  });
  const [formData, setFormData] = useState({
    nickname: '',
    school: '',
    grade: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get('/api/user/userInfo', {
          withCredentials: true
        });
        setUserInfo(res.data);
        setFormData({
          nickname: res.data.nickname || '',
          school: res.data.school || '',
          grade: res.data.grade || ''
        });
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
        setError('로그인이 필요합니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setFormData({
      nickname: userInfo.nickname || '',
      school: userInfo.school || '',
      grade: userInfo.grade || ''
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    if (!formData.nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    try {
      const res = await axios.put('/api/user/profile', formData, {
        withCredentials: true
      });
      
      setUserInfo(res.data);
      setIsEditing(false);
      setSuccess('프로필이 성공적으로 수정되었습니다.');
      setError('');
    } catch (err) {
      setError('프로필 수정에 실패했습니다. 다시 시도해주세요.');
      console.error('프로필 수정 실패:', err);
    }
  };

  if (loading) {
    return (
      <div id="profile-edit-container">
        <div id="loading">로딩 중...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div id="profile-edit-container">
        <div id="profile-edit-content">
          <h1 id="profile-title">프로필 수정</h1>
          <div id="login-required">
            <p>로그인이 필요한 서비스입니다.</p>
            <Link to="/loginTest" id="login-link">로그인 하러 가기</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="profile-edit-container">
      <div id="profile-edit-content">
        <h1 id="profile-title">프로필 수정</h1>
        
        <div id="profile-avatar-section">
          <div id="profile-avatar">
            <div id="avatar-circle">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="30" fill="#f0f0f0"/>
                <circle cx="30" cy="22" r="8" fill="#666"/>
                <path d="M15 45c0-8.284 6.716-15 15-15s15 6.716 15 15" fill="#666"/>
              </svg>
            </div>
          </div>
          <button id="profile-avatar-edit">프로필 사진 변경 ⚙️</button>
        </div>

        <div id="profile-form">
          <div className="form-section">
            <h3 className="section-title">닉네임</h3>
            <div id="nickname-field">
              {isEditing ? (
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="닉네임을 입력하세요"
                />
              ) : (
                <span className="field-value">
                  {userInfo.nickname || '닉네임을 설정해주세요'}
                </span>
              )}
              <button 
                id="nickname-edit-btn"
                onClick={isEditing ? handleSave : handleEdit}
              >
                닉네임 변경 ⚙️
              </button>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">학교 / 학년</h3>
            <div id="school-grade-field">
              {isEditing ? (
                <div id="school-grade-inputs">
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    className="form-input school-input"
                    placeholder="학교명"
                  />
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    className="form-input grade-select"
                  >
                    <option value="">학년 선택</option>
                    <option value="1">1학년</option>
                    <option value="2">2학년</option>
                    <option value="3">3학년</option>
                  </select>
                </div>
              ) : (
                <span className="field-value">
                  {userInfo.school && userInfo.grade 
                    ? `${userInfo.school} ${userInfo.grade}학년` 
                    : '학교 정보를 설정해주세요'}
                </span>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">연동된 이메일</h3>
            <div id="email-field">
              <span className="field-value">
                {userInfo.email || '이메일 정보가 없습니다'}
              </span>
            </div>
          </div>

          {(error || success) && (
            <div className={`message ${error ? 'error' : 'success'}`}>
              {error || success}
            </div>
          )}

          {isEditing && (
            <div id="form-actions">
              <button id="btn-cancel" onClick={handleCancel}>
                취소
              </button>
              <button id="btn-save" onClick={handleSave}>
                저장
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileEdit;