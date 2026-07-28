import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { nicknameField } from "../../utils/validationSchemas";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Card, FormField, Input } from "../ui";
import "./ChangePage.css";

const schema = yup.object().shape({ nickname: nicknameField });

interface FormValues {
  nickname: string;
}

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
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    mode: "onChange",
  });

  const handleNicknameBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const nickname = e.target.value;
    const valid = await trigger("nickname");
    if (!valid) {
      setIsAvailable(false);
      return;
    }

    try {
      const res = await axios.get(
        `/api/user/check/nickname?nickname=${nickname}`
      );
      if (res.data === true) {
        clearErrors("nickname");
        setIsAvailable(true);
      } else {
        setError("nickname", {
          type: "manual",
          message: "이미 사용 중인 닉네임입니다.",
        });
        setIsAvailable(false);
      }
    } catch (err) {
      console.error(err);
      setError("nickname", {
        type: "manual",
        message: "중복 확인 중 오류가 발생했습니다.",
      });
      setIsAvailable(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
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
    } catch (err: any) {
      console.error(err);
      setError("nickname", {
        type: "manual",
        message:
          err?.response?.data?.message || "닉네임 변경 중 오류가 발생했습니다.",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="change-page default-root-value">
      <Helmet>
        <title>닉네임 변경 | 하이틴데이</title>
      </Helmet>
      <h1 className="change-page__title">닉네임 변경</h1>

      <Card className="change-page__card">
        <form
          className="change-page__card"
          style={{ padding: 0 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          {currentNickname && (
            <p className="change-page__current">
              현재 닉네임: <strong>{currentNickname}</strong>
            </p>
          )}

          <FormField
            label="새로운 닉네임"
            error={errors.nickname?.message}
            hint={
              !errors.nickname && isAvailable
                ? "사용 가능한 닉네임입니다."
                : undefined
            }
          >
            <Input
              type="text"
              placeholder="새 닉네임을 입력하세요"
              {...register("nickname")}
              onBlur={handleNicknameBlur}
            />
          </FormField>

          <p className="change-page__guide">
            ※ 닉네임은 <span>한 달에 두 번</span>까지 변경 가능합니다.
          </p>

          <div className="change-page__actions">
            <Button
              type="submit"
              fullWidth
              isLoading={saveLoading}
              disabled={!isValid || !isAvailable}
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

export default NicknameChangePage;
