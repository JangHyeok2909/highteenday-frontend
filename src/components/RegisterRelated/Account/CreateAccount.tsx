import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  nameField,
  nicknameField,
  phoneField,
  emailField,
  passwordField,
  confirmPasswordField,
  birthField,
  gradeField,
  genderField,
  filterHangul,
} from "../../../utils/validationSchemas";
import { Button, Card, FormField, Input } from "../../ui";
import "./CreateAccount.css";

const formatDate = (date: Date) => date.toISOString().split("T")[0];
const today = new Date();
const maxBirthDate = new Date(
  today.getFullYear() - 15,
  today.getMonth(),
  today.getDate()
);
const minBirthDate = new Date(
  today.getFullYear() - 30,
  today.getMonth(),
  today.getDate()
);

const schema = yup.object().shape({
  name: nameField,
  nickname: nicknameField,
  phone: phoneField,
  email: emailField,
  birth: birthField,
  grade: gradeField,
  gender: genderField,
  password: passwordField,
  confirmPassword: confirmPasswordField,
});

interface FormValues {
  name: string;
  nickname: string;
  phone: string;
  email: string;
  birth: Date;
  grade: string;
  gender: string;
  password: string;
  confirmPassword: string;
  mode: boolean;
  provider: string;
}

// 중복체크 요청 함수
async function requestCheck(
  field: "nickname" | "email" | "phone",
  value: string
): Promise<boolean> {
  try {
    let res;
    switch (field) {
      case "nickname":
        res = await axios.get(`/api/user/check/nickname?nickname=${value}`);
        return res.data;
      case "email":
        res = await axios.get(`/api/user/check/email?email=${value}`);
        return res.data;
      case "phone":
        res = await axios.get(
          `/api/user/check/phone?phone=${encodeURIComponent(value)}`
        );
        return res.data;
      default:
        return false;
    }
  } catch (err) {
    console.log("서버에러");
    return false;
  }
}

function CreateAccount() {
  const navigate = useNavigate();
  const [isNicknameChecked, setNicknameChecked] = useState(false);
  const [isEmailChecked, setEmailChecked] = useState(false);
  const [, setPhoneChecked] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    setError,
    clearErrors,
    watch,
    getValues,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    mode: "onChange",
    defaultValues: { mode: false, provider: "DEFAULT" },
  });
  const isOAuth = watch("mode");
  const passwordRegister = register("password");
  const confirmPasswordRegister = register("confirmPassword");

  const handleNicknameBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const nickname = e.target.value;

    // 유효성 체크(통과시에만 중복체크)
    const valid = await trigger("nickname");
    if (!valid) return;

    // 서버 중복 체크
    const res = await requestCheck("nickname", nickname);
    if (res) {
      setNicknameChecked(true);
      clearErrors("nickname");
    } else {
      setNicknameChecked(false);
      setError("nickname", {
        type: "manual",
        message: "이미 사용 중인 닉네임입니다.",
      });
    }
  };

  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;

    const valid = await trigger("email");
    if (!valid) return;

    const res = await requestCheck("email", email);
    if (res) {
      setEmailChecked(true);
      clearErrors("email");
    } else {
      setEmailChecked(false);
      setError("email", {
        type: "manual",
        message: "이미 사용 중인 이메일입니다.",
      });
    }
  };

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

    setValue("phone", formatted, { shouldValidate: false });
  };

  const handlePhoneBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const valid = await trigger("phone");
    if (!valid) return;

    const formattedPhone = formattingPhone(value);
    const res = await requestCheck("phone", formattedPhone);
    if (res) {
      setPhoneChecked(true);
      clearErrors("phone");
    } else {
      setPhoneChecked(false);
      setError("phone", {
        type: "manual",
        message: "이미 가입된 전화번호 입니다.",
      });
    }
  };

  const isFormValid =
    isValid && isNicknameChecked && isEmailChecked && !errors.phone;

  const onSubmit = async (data: FormValues) => {
    // confirmPassword, mode는 프론트 전용 필드 — 백엔드에 보내지 않음
    const { confirmPassword, mode, birth, ...rest } = data;
    const payload = {
      ...rest,
      phone: formattingPhone(data.phone),
      birthDate: birth ? new Date(birth).toISOString().split("T")[0] : null,
    };

    try {
      const res = await axios.post("/api/user/register", payload, {
        withCredentials: true,
      });
      console.log("회원가입 성공:", res.data);
      navigate("/register/school");
    } catch (err: any) {
      console.error("회원가입 실패:", err);
      alert(err.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  const handleSendCode = async () => {
    // 서버로 인증번호 요청
    await axios.post(
      "/api/verification/cool-sms/start",
      {
        userPhoneNum: getValues("phone"),
      },
      {
        withCredentials: true,
      }
    );
  };

  const formattingPhone = (phone: string) => {
    return phone.replace(/-/g, "").replace(/^0/, "+82");
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/user/OAuth2UserInfo", {
          withCredentials: true,
        });
        if (data.mode === "OAuth") {
          setValue("mode", true);
          setValue("email", data.email, {
            shouldValidate: true,
            shouldDirty: false,
          });
          setValue("provider", data.provider);
        } else {
          setValue("mode", false);
          setValue("provider", "DEFAULT");
        }
      } catch (err) {
        console.log("마운트 에러", err);
        setValue("mode", false);
        setValue("provider", "DEFAULT");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className="create-account">
      <form className="create-account__form" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="이름" error={errors.name?.message} required>
          <Input {...register("name")} placeholder="이름을 입력하세요." />
        </FormField>

        <FormField label="닉네임" error={errors.nickname?.message} required>
          <Input {...register("nickname")} onBlur={handleNicknameBlur} />
        </FormField>

        <FormField label="휴대폰 번호" error={errors.phone?.message}>
          <Input
            type="tel"
            {...register("phone")}
            onChange={handlePhoneChange}
            onBlur={handlePhoneBlur}
            maxLength={13}
          />
        </FormField>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onBlur={handleSendCode}
          className="create-account__verify-btn"
        >
          인증번호 전송
        </Button>

        <FormField label="이메일" error={errors.email?.message} required>
          <Input
            {...register("email")}
            readOnly={isOAuth}
            onBlur={!isOAuth ? handleEmailBlur : undefined}
          />
        </FormField>

        <FormField
          label="비밀번호 설정"
          error={errors.password?.message}
          required
        >
          <Input
            type="password"
            {...passwordRegister}
            onChange={(e) => {
              e.target.value = filterHangul(e.target.value);
              passwordRegister.onChange(e);
            }}
          />
        </FormField>

        <FormField
          label="비밀번호 확인"
          error={errors.confirmPassword?.message}
          required
        >
          <Input
            type="password"
            {...confirmPasswordRegister}
            onChange={(e) => {
              e.target.value = filterHangul(e.target.value);
              confirmPasswordRegister.onChange(e);
            }}
          />
        </FormField>

        <FormField label="생년월일" error={errors.birth?.message} required>
          <Input
            type="date"
            {...register("birth")}
            max={formatDate(maxBirthDate)}
            min={formatDate(minBirthDate)}
            onKeyDown={(e) => e.preventDefault()}
          />
        </FormField>

        <FormField label="학년" error={errors.grade?.message} required>
          <select className="create-account__select" {...register("grade")}>
            <option value="">선택</option>
            <option value="SOPHOMORE">1학년</option>
            <option value="JUNIOR">2학년</option>
            <option value="SENIOR">3학년</option>
          </select>
        </FormField>

        <FormField label="성별" error={errors.gender?.message} required>
          <select className="create-account__select" {...register("gender")}>
            <option value="">선택</option>
            <option value="MALE">남자</option>
            <option value="FEMALE">여자</option>
            <option value="OTHER">공개 안함</option>
          </select>
        </FormField>

        <input type="hidden" {...register("provider")} />

        <Button type="submit" fullWidth size="lg" disabled={!isFormValid}>
          완료
        </Button>
      </form>
    </Card>
  );
}

export default CreateAccount;
