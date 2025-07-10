import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Register() {
    const [email, setEmail] = useState("");
    const [provider, setProvider] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [nickName, setNickName] = useState("");

    const getUserInfo = async () => {
        try {
          const res = await axios.get(`https://highteenday.duckdns.org/api/user/OAuth2UserInfo`,
            {
              withCredentials: true
            }
          );
          const data = await res.data;

          setEmail(data.Email);
          setProvider(data.Provider);
          setName(data.Name);

        } catch (err) {
          setError('회원 정보를 불러오는데 실패했습니다.');
        }
    };

    const handleRegister = async (e) => {
      e.preventDefault();
      try {
        const res = await axios.post(`https://highteenday.duckdns.org/api/user/register`,
          {
            nickname: nickName,
            name: name,
            email: email,
            provider: provider
          },
          {
            withCredentials: true,
          }
        )
        console.log("회원가입 성공", res.data);
        console.log(res.status);  
        console.log(res.statusText);
        console.log("==================================================");
      } catch(err){
        console.log("회원가입 실패" + err);
        console.log(err.response?.status);
        console.log(err.response?.statusText);
        console.log("==================================================");
      }
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
      console.log(nickName);
    }, [nickName]);

    return(
        <div>
          회원가입 페이지입니다.

          <p>이메일: {email}</p>
          <p>이름: {name}</p>
          <p>제공자: {provider}</p>
          {error && <p style={{ color: "red" }}>{error}</p>}
          
          <form>
            <label>
              닉네임 : <input type="text" value={nickName} onChange={(e) => setNickName(e.target.value)}></input>
            </label>
            <button type="submit" onSubmit={handleRegister}>가입</button>
          </form>            
            
        </div>
    );
}

export default Register;