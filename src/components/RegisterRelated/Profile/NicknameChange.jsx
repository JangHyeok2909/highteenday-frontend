import { useState } from "react";
import axios from "axios";
import "./NicknameChange.css";

function NicknameChange() {
  const [nickname, setNickname] = useState("");
  const [msg, setMsg] = useState(null);
  const [checkLoading, setCheckLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // 닉네임 중복 확인
  const handleCheck = async () => {
    if (!nickname) {
      setMsg("닉네임을 입력하세요.");
      return;
    }

    try {
      setCheckLoading(true);
      const res = await axios.get(`/api/user/check/nickname?nickname=${nickname}`, {
        withCredentials: true,
      });

      if (res.data === true) {
        setMsg("이미 사용 중인 닉네임입니다.");
      } else {
        setMsg("사용 가능한 닉네임입니다.");
      }
    } catch (err) {
      console.error(err);
      setMsg("중복 확인 중 오류가 발생했습니다.");
    } finally {
      setCheckLoading(false);
    }
  };

  // 닉네임 변경 저장
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname) {
      setMsg("닉네임을 입력하세요.");
      return;
    }

    try {
      setSaveLoading(true);
      const res = await axios.put(
        "/api/user/update-nickname",
        { nickname },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setMsg("닉네임이 변경되었습니다.");
      } else {
        setMsg("닉네임 변경에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      setMsg("닉네임 변경 중 오류가 발생했습니다.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div id="N-Change" className="default-root-value">
      <header className="nc-header">
        <h1 className="nc-title">하이틴데이</h1>
        <hr className="nc-divider" />
      </header>

      <main className="nc-container">
        <h2 className="nc-heading">닉네임 설정</h2>

        <form className="nc-form" onSubmit={handleSubmit}>
          <div className="nc-input-row">
            <label htmlFor="nickname" className="nc-label">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="nc-input"
              placeholder="닉네임을 입력하세요"
            />
            <button
              type="button"
              className="nc-check-btn"
              onClick={handleCheck}
              disabled={checkLoading}
            >
              {checkLoading ? "확인 중..." : "중복 확인"}
            </button>
          </div>
          <p className="nc-guide">
            ※ 닉네임은 <span>한 달에 두 번</span>까지 변경 가능합니다.
          </p>
          <button type="submit" className="nc-submit-btn" disabled={saveLoading}>
            {saveLoading ? "저장 중..." : "확인"}
          </button>
        </form>

        {msg && <p className="nc-message">{msg}</p>}
      </main>
    </div>
  );
}

export default NicknameChange;
