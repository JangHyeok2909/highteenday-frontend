import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import {
  passwordField,
  confirmPasswordField,
  filterHangul,
} from "../../utils/validationSchemas";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Card, FormField, Input } from "../ui";
import "./ChangePage.css";

// currentPw는 yup에서 선택적으로 두고, 서버 /verify 엔드포인트로 별도 검증
const schema = yup.object().shape({
  currentPw: yup.string(),
  password: passwordField,
  confirmPassword: confirmPasswordField,
});

interface FormValues {
  currentPw?: string;
  password: string;
  confirmPassword: string;
}

function PasswordChangePage() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const provider = user?.provider ?? null;
  const [isCurrentPwVerified, setIsCurrentPwVerified] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDefault = provider === "LOCAL";

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    mode: "onChange",
  });

  // LOCAL 유저는 현재 비밀번호 서버 검증까지 통과해야 제출 가능
  const isFormValid = isValid && (!isDefault || isCurrentPwVerified);

  const currentPwRegister = register("currentPw");
  const passwordRegister = register("password");
  const confirmPasswordRegister = register("confirmPassword");

  const handleCurrentPwBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
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
        setError("currentPw", {
          type: "manual",
          message: "현재 비밀번호가 올바르지 않습니다.",
        });
        setIsCurrentPwVerified(false);
      }
    } catch (err: any) {
      setError("currentPw", {
        type: "manual",
        message:
          err?.response?.data?.message ||
          "비밀번호 확인 중 오류가 발생했습니다.",
      });
      setIsCurrentPwVerified(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      const payload = isDefault
        ? { pastPassword: data.currentPw, newPassword: data.password }
        : { newPassword: data.password };

      await axios.patch("/api/user/password", payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate(-1);
    } catch (err: any) {
      setError("currentPw", {
        type: "manual",
        message:
          err?.response?.data?.message ||
          "비밀번호 변경 중 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-page default-root-value">
      <Helmet>
        <title>비밀번호 변경 | 하이틴데이</title>
      </Helmet>
      <h1 className="change-page__title">비밀번호 변경</h1>

      <Card className="change-page__card">
        <form
          className="change-page__card"
          style={{ padding: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* 현재 비밀번호 — LOCAL 유저만 표시 */}
          {isDefault && (
            <FormField label="현재 비밀번호" error={errors.currentPw?.message}>
              <div className="change-page__pw-wrap">
                <Input
                  type={showCurrent ? "text" : "password"}
                  placeholder="현재 비밀번호"
                  invalid={!!errors.currentPw}
                  {...currentPwRegister}
                  onChange={(e) => {
                    e.target.value = filterHangul(e.target.value);
                    currentPwRegister.onChange(e);
                    setIsCurrentPwVerified(false);
                  }}
                  onBlur={handleCurrentPwBlur}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="change-page__eye"
                  onClick={() => setShowCurrent((v) => !v)}
                  tabIndex={-1}
                  aria-label="비밀번호 표시 전환"
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </FormField>
          )}

          <FormField
            label="새로운 비밀번호"
            error={errors.password?.message}
            hint="숫자, 특수문자를 각 1개 이상 포함, 8자 이상"
          >
            <div className="change-page__pw-wrap">
              <Input
                type={showNew ? "text" : "password"}
                placeholder="숫자, 특수문자 포함 8자 이상"
                invalid={!!errors.password}
                {...passwordRegister}
                onChange={(e) => {
                  e.target.value = filterHangul(e.target.value);
                  passwordRegister.onChange(e);
                }}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="change-page__eye"
                onClick={() => setShowNew((v) => !v)}
                tabIndex={-1}
                aria-label="비밀번호 표시 전환"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>

          <FormField
            label="비밀번호 확인"
            error={errors.confirmPassword?.message}
          >
            <div className="change-page__pw-wrap">
              <Input
                type={showConfirm ? "text" : "password"}
                placeholder="새 비밀번호 확인"
                invalid={!!errors.confirmPassword}
                {...confirmPasswordRegister}
                onChange={(e) => {
                  e.target.value = filterHangul(e.target.value);
                  confirmPasswordRegister.onChange(e);
                }}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="change-page__eye"
                onClick={() => setShowConfirm((v) => !v)}
                tabIndex={-1}
                aria-label="비밀번호 표시 전환"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>

          <div className="change-page__actions">
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              disabled={!isFormValid}
            >
              변경하기
            </Button>
            <Button
              type="button"
              fullWidth
              variant="secondary"
              onClick={() => navigate("/profile/edit")}
            >
              취소
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default PasswordChangePage;
