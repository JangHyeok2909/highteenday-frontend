import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./CreateAccount.css";
import "components/Default.css";

const formatDate = (date) => date.toISOString().split("T")[0];
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
  name: yup
    .string()
    .required("이름을 입력해주세요.")
    .max(8, "이름은 최대 8자 입니다.")
    .min(2, "이름은 최소 2자 이상이어야 합니다."),

  nickname: yup
    .string()
    .required("닉네임을 입력해주세요.")
    .min(2, "닉네임은 최소 2자 이상이어야 합니다.")
    .max(12, "닉네임은 최대 12자까지 가능합니다."),

  phone: yup
    .string()
    // .required("휴대폰 번호를 입력해주세요.")
    .matches(
      /^010-\d{3,4}-\d{4}$/,
      "휴대폰 번호는 010-1234-5678 형식으로 입력해주세요."
    ),
  email: yup
    .string()
    .required("이메일을 입력해주세요.")
    .email("올바른 이메일 형식이 아닙니다."),

  birth: yup
    .date()
    .required("생일을 입력해주세요.")
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value; // 빈 문자열은 null로 변환
    })
    .max(new Date(), "생일은 오늘 날짜보다 이후일 수 없습니다.")
    .test("highschool-age", "고등학생 이상만 가입할 수 있습니다.", (value) => {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      const actualAge =
        monthDiff > 0 || (monthDiff === 0 && dayDiff >= 0) ? age : age - 1;

      return actualAge >= 15 && actualAge <= 30; // 15~30살까지 가입가능
    }),

  grade: yup
    .string()
    .required("학년을 선택해주세요.")
    .oneOf(["SOPHOMORE", "JUNIOR", "SENIOR"], "올바른 학년을 선택해주세요."),

  gender: yup
    .string()
    .required("성별을 선택해주세요.")
    .oneOf(["MALE", "FEMALE", "OTHER"], "올바른 성별을 선택해주세요."),

  password: yup
    .string()
    .required("비밀번호는 필수 입력입니다.")
    .min(8, "비밀번호는 최소 8자리 이상이어야 합니다.")
    .matches(/[0-9]/, "숫자를 최소 1개 포함해야 합니다.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "특수문자를 최소 1개 포함해야 합니다."),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호 확인은 필수입니다."),
});

//중복체크 요청 함수
async function requestCheck(field,value){
  try{
    let res;
    switch (field) {

      case "nickname":
        res = await axios.get(
          `/api/user/check/nickname?nickname=${value}`
        );
        return res.data;
      case "email":
        res = await axios.get(
          `/api/user/check/email?email=${value}`
        );
        return res.data;
      case "phone":
        res = await axios.get(
          `/api/user/check/phone?phone=${encodeURIComponent(value)}`
        );
        return res.data;
      default:
        return false;
    }
  } catch(err){
      console.log("서버에러")
      return false;
  }
}

function CreateAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNicknameChecked, setNicknameChecked] = useState(false);
  const [isEmailChecked, setEmailChecked] = useState(false);
  const [isPhoneChecked,setPhoneChecked] = useState(false);
  const [isPhoneAutehnticated, setPhoneAutehnticated] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  // useEffect(() => {
  //   if (location.state) {
  //     setForm((prev) => ({
  //       ...prev,
  //       ...location.state,
  //     }));
  //   }
  // }, [location.state]);
  const {
    register, handleSubmit, trigger, setValue, setError, clearErrors, watch, getValues,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: { mode: false, provider: "LOCAL" }, 
  });
  const isOAuth = watch("mode");

  const handleNicknameBlur = async (e) => {
    const nickname = e.target.value;

    //유효성 체크(통과시에만 중복체크)
    const valid = await trigger("nickname");
    if (!valid) return;

    //서버 중복 체크
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

  const handleEmailBlur = async (e) => {
    const email = e.target.value;

    //유효성 체크(통과시에만 중복체크)
    const valid = await trigger("email");
    if (!valid) return;

    //서버 중복 체크
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

  const handlePhoneChange = async (e) => {
    //입력폼 제한(010-xxxx-xxxx 형식)
    let value = e.target.value.replace(/\D/g, ""); // 숫자만
    if (!value.startsWith("010")) value = "010" + value.slice(3);
    if (value.length > 3 && value.length <= 7)
      value = value.replace(/(\d{3})(\d+)/, "$1-$2");
    else if (value.length > 7)
      value = value.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");

    setValue("phone", value); // RHF 상태 업데이트
    trigger("phone"); // yup 유효성 체크

    //서버 중복 체크
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
    isValid & isNicknameChecked && isEmailChecked && isPhoneAutehnticated;

  const onSubmit = async (data) => {
    console.log("Submit called!", data);
    // 전송되는 phone +82 형식으로 변환
    const payload = {
      ...data,
      phone:formattingPhone(data.phone),
    }

    
    try {
      const res = await axios.post("/api/user/register", payload);
      console.log("회원가입 성공:", res.data);
      navigate("/register/school");
    } catch (err) {
      console.error("회원가입 실패:", err);
      alert(err.response?.data?.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  const handleSendCode = async () => {
    // 서버로 인증번호 요청
    await axios.post("/api/verification/cool-sms/start", {
      "userPhoneNum": getValues("phone")
    },{
      withCredentials: true
    })
  };
  
  const formattingPhone = (phone) =>{
    return phone.replace(/-/g, "").replace(/^0/, "+82");
  }


  useEffect(() => {
   (async () => {
     try {
       const { data } = await axios.get('/api/user/OAuth2UserInfo', { withCredentials: true });
       if (data.mode === 'OAuth') {
         setValue("mode", true);
         setValue("email", data.email, { shouldValidate: true, shouldDirty: false });
         setValue("name",  data.name,  { shouldValidate: true, shouldDirty: false });
         setValue("provider", data.provider);
       } else {
         setValue("mode", false);
         setValue("provider", "LOCAL");
       }
     } catch (err) {
       console.log("마운트 에러", err);
       setValue("mode", false);
       setValue("provider", "LOCAL");
     }
   })();
 }, []);

  return (
    <div id="CreateAccount">
      <div className="form-container">
        <form
          className="account-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label>이름</label>
          <input {...register("name")} placeholder="이름을 입력하세요." />
          {errors.name && <p>{errors.name.message}</p>}

          <label>닉네임</label>
          <input {...register("nickname")} onBlur={handleNicknameBlur} />
          {errors.nickname && <p>{errors.nickname.message}</p>}

          <label>휴대폰 번호</label>
          <input
            type="tel"
            {...register("phone")}
            onChange={handlePhoneChange}
            maxLength={13}
          />
          {errors.phone && <p>{errors.phone.message}</p>}
          <button type="button" onBlur={handleSendCode}>
            인증번호 전송
          </button>

          

          <label>이메일</label>
          <input
            {...register("email")}
            readOnly={isOAuth}
            onBlur={!isOAuth ? handleEmailBlur : undefined}
          />          
          {errors.email && <p>{errors.email.message}</p>}

          <label>비밀번호 설정</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
          />
          {errors.password && <p>{errors.password.message}</p>}
          <label>비밀번호 확인</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

          <label>생년월일</label>
          <input
            type="date"
            {...register("birth")}
            max={formatDate(maxBirthDate)}
            min={formatDate(minBirthDate)}
            onKeyDown={(e) => e.preventDefault()}
          />
          {errors.birth && <p>{errors.birth.message}</p>}
          
          <label>학년</label>
          <select {...register("grade")}>
            <option value="">선택</option>
            <option value="SOPHOMORE">1학년</option>
            <option value="JUNIOR">2학년</option>
            <option value="SENIOR">3학년</option>
          </select>
          {errors.grade && <p>{errors.grade.message}</p>}

          <label>성별</label>
          <select {...register("gender")}>
            <option value="">선택</option>
            <option value="MALE">남자</option>
            <option value="FEMALE">여자</option>
            <option value="OTHER">공개 안함</option>
          </select>
          {errors.gender && <p>{errors.gender.message}</p>}

          <input type="hidden" {...register("provider")} />

          <div className="button-wrapper">
            <button
              type="submit"
              className="submit-button"
              disabled={!isFormValid}
            >
              완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAccount;
