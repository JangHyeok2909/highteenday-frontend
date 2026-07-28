import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { phoneField } from "../../utils/validationSchemas";
import { Button, Card, FormField, Input } from "../ui";
import "./ChangePage.css";

const schema = yup.object().shape({
  phone: phoneField.required("전화번호를 입력해주세요."),
});

interface FormValues {
  phone: string;
}

type MsgType = "info" | "success" | "error";

function PhoneChangePage() {
  const navigate = useNavigate();
  const [verifyCode, setVerifyCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgType, setMsgType] = useState<MsgType>("info");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    mode: "onChange",
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    if (digits.length > 0 && !digits.startsWith("010")) digits = "010";
    digits = digits.slice(0, 11);

    let formatted = digits;
    if (digits.length > 7) {
      formatted =
        digits.slice(0, 3) + "-" + digits.slice(3, 7) + "-" + digits.slice(7);
    } else if (digits.length > 3) {
      formatted = digits.slice(0, 3) + "-" + digits.slice(3);
    }

    setValue("phone", formatted, { shouldValidate: true });
  };

  const handleSendCode = () => {
    const phone = getValues("phone");
    if (!phone?.trim()) {
      setMsg("전화번호를 입력해 주세요.");
      setMsgType("error");
      return;
    }
    setCodeSent(true);
    setMsg("인증번호 전송 기능은 준비 중입니다.");
    setMsgType("info");
  };

  const handleVerify = () => {
    setMsg("인증 기능은 준비 중입니다.");
    setMsgType("info");
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      await axios.patch(
        "/api/user/phone",
        { phoneNum: data.phone.replace(/-/g, "") },
        { withCredentials: true }
      );
      setMsg("전화번호가 변경되었습니다.");
      setMsgType("success");
    } catch (err: any) {
      setMsg(
        err?.response?.data?.message || "전화번호 변경 중 오류가 발생했습니다."
      );
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-page default-root-value">
      <Helmet>
        <title>전화번호 변경 | 하이틴데이</title>
      </Helmet>
      <h1 className="change-page__title">전화번호 변경</h1>

      <Card className="change-page__card">
        <form
          className="change-page__card"
          style={{ padding: 0 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormField label="전화번호" error={errors.phone?.message}>
            <div className="change-page__input-row">
              <Input
                type="tel"
                placeholder="010-0000-0000"
                invalid={!!errors.phone}
                {...register("phone")}
                onChange={handlePhoneChange}
              />
              <Button type="button" variant="secondary" onClick={handleSendCode}>
                인증번호 전송
              </Button>
            </div>
          </FormField>

          <FormField
            label="인증번호"
            hint="※ 인증 없이도 전화번호 변경이 가능합니다."
          >
            <div className="change-page__input-row">
              <Input
                type="text"
                placeholder={
                  codeSent ? "인증번호를 입력하세요" : "인증번호 전송 후 입력"
                }
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                disabled={!codeSent}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleVerify}
                disabled={!codeSent}
              >
                인증하기
              </Button>
            </div>
          </FormField>

          {msg && (
            <p className={`change-page__msg change-page__msg--${msgType}`}>
              {msg}
            </p>
          )}

          <div className="change-page__actions">
            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              disabled={!isValid}
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

export default PhoneChangePage;
