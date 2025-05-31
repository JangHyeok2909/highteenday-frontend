import React from "react";

function LoginButton() {

    return(<div>
        <a href="http://54.180.155.188:8080/oauth2/authorization/kakao">
            <button>카카오 로그인</button>
        </a> 

        <br></br>

        ======================================================<br></br>

        <a href="http://54.180.155.188:8080/oauth2/authorization/naver">
            <button>네이버 로그인</button>
        </a>

        <br></br>

        ======================================================<br></br>

        <a href="http://54.180.155.188:8080/oauth2/authorization/google">
            <button>구글 로그인</button>
        </a>
    </div>);
}

export default LoginButton;