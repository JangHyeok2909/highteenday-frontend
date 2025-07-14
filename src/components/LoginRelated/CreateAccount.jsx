import React, { useRef, useState } from "react";
import "./CreateAccount.css";

function CreateAccount() {
    const [form, setForm] = useState({
        nickname: "",
        phone: "",
        birth: "",
        gender: "",
        profileImage: null,
    });

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
            fileInputRef.current.click(); // 파일 선택
        } else if (selected === "camera") {
            cameraInputRef.current.click(); // 사진 찍기
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("회원가입 데이터:", form);
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
                    onChange={handleChange}
                />

                <label>휴대폰 번호 [필수]</label>
                <input
                    type="tel"
                    name="phone"
                    placeholder="010-xxxx-xxxx"
                    required
                    onChange={handleChange}
                />

                <label>이메일 [필수]</label>
                <input
                    type="email"
                    name="email"
                    placeholder="HighteenDay@example.com"
                    required
                    onChange={handleChange}
                />


                <label>생일 [필수]</label>
                <input type="date" name="birth" required onChange={handleChange} />

                <label>성별</label>
                <select name="gender" onChange={handleChange}>
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

                {/* 숨겨진 파일 선택 인풋 */}
                <input
                    type="file"
                    accept="image/*"
                    name="profileImage"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleChange}
                />

                {/* 카메라로 직접 찍기 */}
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    name="profileImage"
                    ref={cameraInputRef}
                    style={{ display: "none" }}
                    onChange={handleChange}
                />

                <button type="submit" className="submit-button">
                    완료
                </button>
            </form>
        </div>
    );
}

export default CreateAccount;
