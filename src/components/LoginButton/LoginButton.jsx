import React, { useEffect, useState } from "react";
import axios from 'axios';

function LoginButton() {
    // JWT 작동 여부 코드
    const [jwtStatus, setJwtStatus] = useState("Jwt 없음");
    const [userInfo, setUserInfo] = useState(null);

    const getJwtStatus = async () => {
        try {
            const res = await axios.get(`https://highteenday.duckdns.org/api/user/loginUser`, {
                withCredentials: true
            });
    
            // 로그인된 경우
            setJwtStatus("Jwt 작동 중 (로그인 상태)");
            setUserInfo(res.data);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                // 로그인 안 된 경우
                setJwtStatus("Jwt 없음 (비로그인 상태)");
                setUserInfo(null);
            } else {
                // 기타 오류
                setJwtStatus("오류 발생");
                setUserInfo(null);
            }
        }
    };

    useEffect(() => {
        getJwtStatus();
    }, []);
    // 요기까지

    return(<div>
        <p>{jwtStatus}</p><br></br>
        {userInfo && (
            <div>
                <p>이름: {userInfo?.name}</p>
                <p>이메일: {userInfo?.email}</p>
                <p>닉네임: {userInfo?.nickname}</p>
                <p>제공자: {userInfo?.provider}</p>
            </div>
        )}

        <a href="https://highteenday.duckdns.org/oauth2/authorization/kakao">
            <button>카카오 로그인</button>
        </a> 

        <br></br>

        ======================================================<br></br>

        <a href="https://highteenday.duckdns.org/oauth2/authorization/naver">
            <button>네이버 로그인</button>
        </a>

        <br></br>

        ======================================================<br></br>

        <a href="https://highteenday.duckdns.org/oauth2/authorization/google">
            <button>구글 로그인</button>
        </a>
    </div>);
}

export default LoginButton;