import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "components/Header/MainHader/Header";
import "components/Default.css";
import "./NicknameChangePage.css";

function NicknameChangePage() {
  const navigate = useNavigate();
  const [currentNickname, setCurrentNickname] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [msg, setMsg] = useState(null);
  const [msgType, setMsgType] = useState("info"); // "error" | "success" | "info"
  const [checkLoading, setCheckLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null); // null | true | false
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    axios
      .get("/api/user/userInfo", { withCredentials: true })
      .then((res) => setCurrentNickname(res.data.nickname || ""))
      .catch((err) => console.error("유저 정보 불러오기 실패:", err));
  }, []);

  // 입력값 변경 시 500ms 디바운스로 중복 체크
  useEffect(() => {
    const trimmed = newNickname.trim();
    if (!trimmed) {
      setMsg(null);
      setIsAvailable(null);
      return;
    }

    setCheckLoading(true);
    setIsAvailable(null);
    setMsg(null);

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          `/api/user/check/nickname?nickname=${trimmed}`
        );
        if (res.data === true) {
          setMsg("사용 가능한 닉네임입니다."); setMsgType("success");
          setIsAvailable(true);
        } else {
          setMsg("이미 사용 중인 닉네임입니다."); setMsgType("error");
          setIsAvailable(false);
        }
      } catch (err) {
        console.error(err);
        setMsg("중복 확인 중 오류가 발생했습니다."); setMsgType("error");
        setIsAvailable(false);
      } finally {
        setCheckLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [newNickname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAvailable) return;
    setSaveLoading(true);
    try {
      await axios.patch(
        "/api/user/nickname",
        { pastNickname: currentNickname, newNickname: newNickname.trim() },
        { withCredentials: true }
      );
      alert("닉네임이 변경되었습니다.");
      navigate("/profile/edit");
    } catch (err) {
      console.error(err);
      setMsg(err?.response?.data?.message || "닉네임 변경 중 오류가 발생했습니다.");
      setMsgType("error");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="default-root-value">
      <Header isMainPage={false} />

      <div className="nc2-page">
        <Helmet><title>닉네임 변경 | 하이틴데이</title></Helmet>
        <h2 className="nc2-title">닉네임 변경</h2>

        <form className="nc2-form" onSubmit={handleSubmit}>
          {currentNickname && (
            <p className="nc2-current">현재 닉네임: <strong>{currentNickname}</strong></p>
          )}

          <div className="nc2-field-group">
            <label className="nc2-label">새로운 닉네임</label>
            <input
              type="text"
              className="nc2-input"
              placeholder="새 닉네임을 입력하세요"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
            />
            {checkLoading && <p className="nc2-checking">확인 중...</p>}
          </div>

          <p className="nc2-guide">※ 닉네임은 <span>한 달에 두 번</span>까지 변경 가능합니다.</p>

          {msg && !checkLoading && (
            <p className={`nc2-msg nc2-msg--${msgType}`}>{msg}</p>
          )}

          <div className="nc2-actions">
            <button
              type="submit"
              className="nc2-submit"
              disabled={!isAvailable || saveLoading}
            >
              {saveLoading ? "저장 중..." : "변경하기"}
            </button>
            <button
              type="button"
              className="nc2-cancel"
              onClick={() => navigate("/profile/edit")}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NicknameChangePage;
