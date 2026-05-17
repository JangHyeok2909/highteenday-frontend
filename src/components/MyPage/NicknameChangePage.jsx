import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Header from "components/Header/MainHader/Header";
import { nicknameField } from "utils/validationSchemas";
import { useAuth } from "../../contexts/AuthContext";
import "components/Default.css";
import "./NicknameChangePage.css";

const schema = yup.object().shape({ nickname: nicknameField });

function NicknameChangePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentNickname = user?.nickname || "";
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
      const res = await axios.get(`/api/user/check/nickname?nickname=${nickname}`);
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
    setSaveLoading(true);
    try {
      await axios.patch(
        "/api/user/nickname",
        { pastNickname: currentNickname, newNickname: data.nickname.trim() },
        { withCredentials: true }
      );
      alert("닉네임이 변경되었습니다.");
      navigate("/profile/edit");
    } catch (err) {
      console.error(err);
      setError("nickname", {
        type: "manual",
        message: err?.response?.data?.message || "닉네임 변경 중 오류가 발생했습니다.",
      });
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

        <form className="nc2-form" onSubmit={handleSubmit(onSubmit)}>
          {currentNickname && (
            <p className="nc2-current">현재 닉네임: <strong>{currentNickname}</strong></p>
          )}

          <div className="nc2-field-group">
            <label className="nc2-label">새로운 닉네임</label>
            <input
              type="text"
              className="nc2-input"
              placeholder="새 닉네임을 입력하세요"
              {...register("nickname")}
              onBlur={handleNicknameBlur}
            />
            {errors.nickname && (
              <p className="nc2-msg nc2-msg--error">{errors.nickname.message}</p>
            )}
            {!errors.nickname && isAvailable && (
              <p className="nc2-msg nc2-msg--success">사용 가능한 닉네임입니다.</p>
            )}
          </div>

          <p className="nc2-guide">※ 닉네임은 <span>한 달에 두 번</span>까지 변경 가능합니다.</p>

          <div className="nc2-actions">
            <button
              type="submit"
              className="nc2-submit"
              disabled={!isValid || !isAvailable || saveLoading}
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
