import React, { useState } from 'react';
import axios from 'axios';
import './OAuthTermsPage.css';
import TermsToggleItem from './TermsToggleItem';

export default function OAuthTermsPage() {
    const [checkedAll, setCheckedAll] = useState(false);
    const [checkedList, setCheckedList] = useState([]);

    const termItems = [
        { id: 'terms', label: '이용약관 동의 (필수)' },
        { id: 'privacy', label: '개인정보 수집/이용 동의 (필수)' },
        { id: 'marketing', label: '마케팅 정보 수신 동의 (선택)' },
    ];

    const handleToggle = (id, checked) => {
        setCheckedList((prev) =>
            checked ? [...prev, id] : prev.filter((x) => x !== id)
        );
        if (checkedList.length + (checked ? 1 : -1) === termItems.length) {
            setCheckedAll(true);
        } else {
            setCheckedAll(false);
        }
    };

    const handleSubmit = async () => {
        try {
            await axios.post(
                `${process.env.REACT_APP_API_BASE}/auth/oauth/terms`,
                { agreed: checkedList },
                { headers: { 'Content-Type': 'application/json' } }
            );
            alert('약관 동의 완료');
        } catch (err) {
            console.error('Terms Error:', err);
            alert('오류가 발생했습니다.');
        }
    };

    return (
        <div className="terms-container">
            <h2>약관 동의</h2>

            <div className="terms-check">
                <label>
                    <input type="checkbox" checked={terms.all} onChange={handleAll} />
                    아래 약관에 모두 동의합니다.
                </label>
            </div>

            <TermsToggleItem label="서비스 이용약관 동의" required content="제 1조(목적) 설명 쪽 ..." checked={terms.service} onChange={() => handleCheck('service')} />
            <TermsToggleItem label="개인정보 수집 및 이용 동의" required content="수집하는 개인정보 항목 설명 쪽 ..." checked={terms.privacy} onChange={() => handleCheck('privacy')} />
            <TermsToggleItem label="커뮤니티 이용규칙 확인" required content="커뮤니티 이용규칙 안내 설명 쪽 ..." checked={terms.community} onChange={() => handleCheck('community')} />
            <TermsToggleItem label="광고성 정보 수신 동의" content="다양한 알림 정보 수신 동의 설명 쪽 ..." checked={terms.ads} onChange={() => handleCheck('ads')} />
            <TermsToggleItem label="본인 명의 이용 가입" required content="타인 명의 가입 불가 설명 쪽 ..." checked={terms.identity} onChange={() => handleCheck('identity')} />
            <TermsToggleItem label="만 14세 이상" required content="만 14세 이상만 가입 가능 설명 쪽 ..." checked={terms.age} onChange={() => handleCheck('age')} />

            <button className="terms-button" onClick={handleNext}>휴대폰 인증</button>
        </div>
    );
}
