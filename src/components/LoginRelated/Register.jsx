import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Register() {
    const [email, setEmail] = useState("");
    const [provider, setProvider] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const getUserInfo = async () => {
        try {
          const res = await axios.get(`https://highteenday.duckdns.org/api/user/OAuth2UserInfo`);
          const data = await res.data;

          setEmail(data.Email);
          setProvider(data.Provider);
          setName(data.Name);

        } catch (err) {
          setError('회원 정보를 불러오는데 실패했습니다.');
        }
      };

    useEffect(() => {
        getUserInfo();
    }, []);

    return(
        <div>
            <p>이메일: {email}</p>

            <p>이름: {name}</p>
            <p>제공자: {provider}</p>
            {error && <p style={{ color: "red" }}>{error}</p>}
            
            
            회원가입 페이지입니다.
        </div>
    );
}

export default Register;