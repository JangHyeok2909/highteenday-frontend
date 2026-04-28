import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { passwordField, confirmPasswordField, filterHangul } from "utils/validationSchemas";
import "./PassChange.css";

// currentPw는 yup에서 선택적으로 두고, 서버 /verify 엔드포인트로 별도 검증
const schema = yup.object().shape({
  currentPw: yup.string(),
  password: passwordField,
  confirmPassword: confirmPasswordField,
});

function PassChange() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null); // null = 로딩 중
  const [isCurrentPwVerified, setIsCurrentPwVerified] = useState(false);
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

      const res = await axios.patch(
        "/api/user/password",
        payload,
        {
          withCredentials: true,
          timeout: 10000,
          headers: { "Content-Type": "application/json" },
        }
      );

      const ok =
        (res.status >= 200 && res.status < 300) ||
        res?.data?.success === true;

      if (ok) {
        alert("비밀번호가 성공적으로 변경되었습니다.");
        navigate(-1);
      } else {
        setError("currentPw", {
          type: "manual",
          message: res?.data?.message || "비밀번호 변경에 실패했습니다. 다시 시도해 주세요.",
        });
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        setError("currentPw", { type: "manual", message: "로그인이 필요합니다. 다시 로그인해 주세요." });
      } else {
        setError("currentPw", {
          type: "manual",
          message: err?.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="pass-change">
      <div className="pc-wrapper">
        <header className="pc-header">
          <h1 className="pc-title">비밀번호 변경하기</h1>
        </header>

        <form className="pc-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* 현재 비밀번호 — DEFAULT 유저만 표시 */}
          {isDefault && (
            <div className="pc-row">
              <label htmlFor="currentPw" className="pc-label">현재 비밀번호</label>
              <input
                id="currentPw"
                type="password"
                className="pc-input"
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
              {errors.currentPw && (
                <div className="pc-msg pc-error" aria-live="polite">{errors.currentPw.message}</div>
              )}
            </div>
          )}

          <div className="pc-row">
            <label htmlFor="password" className="pc-label">새로운 비밀번호</label>
            <input
              id="password"
              type="password"
              className="pc-input"
              placeholder="숫자, 특수문자 포함 8자 이상"
              {...passwordRegister}
              onChange={(e) => {
                e.target.value = filterHangul(e.target.value);
                passwordRegister.onChange(e);
              }}
              autoComplete="new-password"
              style={{ imeMode: "inactive" }}
            />
            <p className="pc-hint">숫자, 특수문자를 각 1개 이상 포함, 8자 이상</p>
            {errors.password && (
              <div className="pc-msg pc-error" aria-live="polite">{errors.password.message}</div>
            )}
          </div>

          <div className="pc-row">
            <label htmlFor="confirmPassword" className="pc-label">비밀번호 확인</label>
            <input
              id="confirmPassword"
              type="password"
              className="pc-input"
              placeholder="새 비밀번호 확인"
              {...confirmPasswordRegister}
              onChange={(e) => {
                e.target.value = filterHangul(e.target.value);
                confirmPasswordRegister.onChange(e);
              }}
              autoComplete="new-password"
              style={{ imeMode: "inactive" }}
            />
            {errors.confirmPassword && (
              <div className="pc-msg pc-error" aria-live="polite">{errors.confirmPassword.message}</div>
            )}
          </div>

          <button type="submit" className="pc-submit" disabled={!isFormValid || loading} aria-busy={loading}>
            {loading ? "처리 중..." : "확인"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PassChange;
