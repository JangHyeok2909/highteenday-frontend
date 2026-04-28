import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { nicknameField } from "utils/validationSchemas";
import "./NicknameChange.css";

const schema = yup.object().shape({ nickname: nicknameField });

function NicknameChange() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  const handleNicknameBlur = async (e) => {
    const nickname = e.target.value;
    const valid = await trigger("nickname");
    if (!valid) { setIsAvailable(false); return; }

    try {
      const res = await axios.get(`/api/user/check/nickname?nickname=${nickname}`, {
        withCredentials: true,
      });
      if (res.data === true) {
        clearErrors("nickname");
        setIsAvailable(true);
      } else {
        setError("nickname", { type: "manual", message: "이미 사용 중인 닉네임입니다." });
        setIsAvailable(false);
      }
    } catch (err) {
      console.error(err);
      setError("nickname", { type: "manual", message: "중복 확인 중 오류가 발생했습니다." });
      setIsAvailable(false);
    }
  };

  const onSubmit = async (data) => {
    if (!isAvailable) return;
    try {
      setSaveLoading(true);
      const res = await axios.patch(
        "/api/user/nickname",
        { nickname: data.nickname },
        { withCredentials: true }
      );
      if (res.status === 200) {
        setError("nickname", { type: "manual", message: "닉네임이 변경되었습니다." });
      }
    } catch (err) {
      console.error(err);
      setError("nickname", { type: "manual", message: "닉네임 변경 중 오류가 발생했습니다." });
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

        <form className="nc-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="nc-input-row">
            <label htmlFor="nickname" className="nc-label">닉네임</label>
            <input
              id="nickname"
              type="text"
              className="nc-input"
              placeholder="닉네임을 입력하세요"
              {...register("nickname")}
              onBlur={handleNicknameBlur}
            />
          </div>
          {errors.nickname && <p className="nc-message">{errors.nickname.message}</p>}
          {!errors.nickname && isAvailable && (
            <p className="nc-message">사용 가능한 닉네임입니다.</p>
          )}
          <p className="nc-guide">
            ※ 닉네임은 <span>한 달에 두 번</span>까지 변경 가능합니다.
          </p>
          <button
            type="submit"
            className="nc-submit-btn"
            disabled={!isValid || !isAvailable || saveLoading}
          >
            {saveLoading ? "저장 중..." : "확인"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default NicknameChange;
