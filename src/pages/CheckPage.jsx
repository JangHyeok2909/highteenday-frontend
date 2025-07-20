import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CheckPage.css";

function CheckPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/user/login", {
        email,
        password,
      }, {
        withCredentials: true // 로그인 세션/쿠키가 필요한 경우
      });

      const user = res.data;

      // 여기서 user.school, user.grade 같은 필드도 서버가 주면 포함 가능
      navigate("/user-profile", { state: user });
    } catch (err) {
      setError("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="login-container">
      <h2>본인 인증</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">확인</button>
      </form>
    </div>
  );
}

export default CheckPage;
