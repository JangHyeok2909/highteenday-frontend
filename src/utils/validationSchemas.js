import * as yup from "yup";

export const filterHangul = (value) =>
  value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "");

export const nameField = yup
  .string()
  .required("이름을 입력해주세요.")
  .max(8, "이름은 최대 8자 입니다.")
  .min(2, "이름은 최소 2자 이상이어야 합니다.");

export const nicknameField = yup
  .string()
  .required("닉네임을 입력해주세요.")
  .min(2, "닉네임은 최소 2자 이상이어야 합니다.")
  .max(12, "닉네임은 최대 12자까지 가능합니다.");

export const phoneField = yup
  .string()
  .matches(
    /^010-\d{3,4}-\d{4}$/,
    "휴대폰 번호는 010-1234-5678 형식으로 입력해주세요."
  );

export const emailField = yup
  .string()
  .required("이메일을 입력해주세요.")
  .email("올바른 이메일 형식이 아닙니다.");

export const passwordField = yup
  .string()
  .required("비밀번호는 필수 입력입니다.")
  .min(8, "비밀번호는 최소 8자리 이상이어야 합니다.")
  .matches(/[0-9]/, "숫자를 최소 1개 포함해야 합니다.")
  .matches(/[!@#$%^&*(),.?":{}|<>]/, "특수문자를 최소 1개 포함해야 합니다.");

export const confirmPasswordField = yup
  .string()
  .required("비밀번호 확인은 필수입니다.")
  .oneOf([yup.ref("password"), null], "비밀번호가 일치하지 않습니다.");

export const birthField = yup
  .date()
  .required("생일을 입력해주세요.")
  .transform((value, originalValue) => {
    return originalValue === "" ? null : value;
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
    return actualAge >= 15 && actualAge <= 30;
  });

export const gradeField = yup
  .string()
  .required("학년을 선택해주세요.")
  .oneOf(["SOPHOMORE", "JUNIOR", "SENIOR"], "올바른 학년을 선택해주세요.");

export const genderField = yup
  .string()
  .required("성별을 선택해주세요.")
  .oneOf(["MALE", "FEMALE", "OTHER"], "올바른 성별을 선택해주세요.");
