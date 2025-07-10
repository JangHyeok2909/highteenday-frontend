import React, { useEffect, useState } from "react";

function LoginButton() {

    const [jwtStatus, setJwtStatus] = useState("Jwt 없음");

    useEffect(() => {
        fetch("https://highteenday.duckdns.org/api/user/loginUser", {
            method: "GET",
            credentials: "include"
        })
        .then(response => {
            if(response.ok){
                setJwtStatus("Jwt 작동 중 (로그인 상태)");
            } else {
                setJwtStatus("Jwt 없음 (비로그인 상태)");
            }
        })
        .catch(error => {
            setJwtStatus("오류 발생");
        });
    
    }, []);


    return(<div>
        <p>{jwtStatus}</p>

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