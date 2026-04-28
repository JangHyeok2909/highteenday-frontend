import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Header from "components/Header/MainHader/Header";
import { passwordField, confirmPasswordField, filterHangul } from "utils/validationSchemas";
import "components/Default.css";
import "./PasswordChangePage.css";

// currentPw는 yup에서 선택적으로 두고, 서버 /verify 엔드포인트로 별도 검증
const schema = yup.object().shape({
  currentPw: yup.string(),
  password: passwordField,
  confirmPassword: confirmPasswordField,
});

function PasswordChangePage() {
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null); // null = 로딩 중
  const [isCurrentPwVerified, setIsCurrentPwVerified] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors, isValid },
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  useEffect(() => {
    axios
      .get("/api/user/userInfo", { withCredentials: true })
      .then((res) => setProvider(res.data.provider || "DEFAULT"))
      .catch(() => setProvider("DEFAULT"));
  }, []);

  const isDefault = provider === "DEFAULT";
  // DEFAULT 유저는 현재 비밀번호 서버 검증까지 통과해야 제출 가능
  const isFormValid = isValid && (!isDefault || isCurrentPwVerified);

  const currentPwRegister = register("currentPw");
  const passwordRegister = register("password");
  const confirmPasswordRegister = register("confirmPassword");

  const handleCurrentPwBlur = async (e) => {
    const password = e.target.value;
    if (!password) return;

    try {
      const res = await axios.post(
        "/api/user/password/verify",
        { password },
        { withCredentials: true }
      );
      if (res.data === true) {
        clearErrors("currentPw");
        setIsCurrentPwVerified(true);
      } else {
        setError("currentPw", { type: "manual", message: "현재 비밀번호가 올바르지 않습니다." });
        setIsCurrentPwVerified(false);
      }
    } catch (err) {
      setError("currentPw", {
        type: "manual",
        message: err?.response?.data?.message || "비밀번호 확인 중 오류가 발생했습니다.",
      });
      setIsCurrentPwVerified(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = isDefault
        ? { pastPassword: data.currentPw, newPassword: data.password }
        : { newPassword: data.password };

      await axios.patch(
        "/api/user/password",
        payload,
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate(-1);
    } catch (err) {
      setError("currentPw", {
        type: "manual",
        message: err?.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="default-root-value">
      <Header isMainPage={false} />

      <div className="pw-change-page">
        <Helmet><title>비밀번호 변경 | 하이틴데이</title></Helmet>
        <h2 className="pw-change-title">비밀번호 변경</h2>

        <form className="pw-change-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* 현재 비밀번호 — DEFAULT 유저만 표시 */}
          {isDefault && (
            <div className="pw-field-group">
              <label className="pw-label">현재 비밀번호</label>
              <div className="pw-input-wrap">
                <input
                  type={showCurrent ? "text" : "password"}
                  className="pw-input"
                  placeholder="현재 비밀번호"
                  {...currentPwRegister}
                  onChange={(e) => {
                    e.target.value = filterHangul(e.target.value);
                    currentPwRegister.onChange(e);
                    setIsCurrentPwVerified(false);
                  }}
                  style={{ imeMode: "inactive" }}
                  onBlur={handleCurrentPwBlur}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="pw-eye-btn"
                  onClick={() => setShowCurrent((v) => !v)}
                  tabIndex={-1}
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.currentPw && <p className="pw-msg pw-error">{errors.currentPw.message}</p>}
            </div>
          )}

          {/* 새 비밀번호 */}
          <div className="pw-field-group">
            <label className="pw-label">새로운 비밀번호</label>
            <div className="pw-input-wrap">
              <input
                type={showNew ? "text" : "password"}
                className="pw-input"
                placeholder="숫자, 특수문자 포함 8자 이상"
                {...passwordRegister}
                onChange={(e) => {
                  e.target.value = filterHangul(e.target.value);
                  passwordRegister.onChange(e);
                }}
                autoComplete="new-password"
                style={{ imeMode: "inactive" }}
              />
              <button
                type="button"
                className="pw-eye-btn"
                onClick={() => setShowNew((v) => !v)}
                tabIndex={-1}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="pw-hint">숫자, 특수문자를 각 1개 이상 포함, 8자 이상</p>
            {errors.password && <p className="pw-msg pw-error">{errors.password.message}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div className="pw-field-group">
            <label className="pw-label">비밀번호 확인</label>
            <div className="pw-input-wrap">
              <input
                type={showConfirm ? "text" : "password"}
                className="pw-input"
                placeholder="새 비밀번호 확인"
                {...confirmPasswordRegister}
                onChange={(e) => {
                  e.target.value = filterHangul(e.target.value);
                  confirmPasswordRegister.onChange(e);
                }}
                autoComplete="new-password"
                style={{ imeMode: "inactive" }}
              />
              <button
                type="button"
                className="pw-eye-btn"
                onClick={() => setShowConfirm((v) => !v)}
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="pw-msg pw-error">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pw-change-actions">
            <button type="submit" className="pw-submit" disabled={!isFormValid || loading}>
              {loading ? "처리 중..." : "변경하기"}
            </button>
            <button
              type="button"
              className="pw-cancel"
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

export default PasswordChangePage;
