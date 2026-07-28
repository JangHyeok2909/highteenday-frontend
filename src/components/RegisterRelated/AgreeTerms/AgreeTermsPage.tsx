import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import RegisterHeader from "../../Header/RegisterHeader/RegisterHeader";
import { Button, Card } from "../../ui";
import "./AgreeTermsPage.css";

type AgreementKey =
  | "terms"
  | "privacy"
  | "community"
  | "ads"
  | "realname"
  | "over14";

interface AgreementItem {
  key: AgreementKey;
  label: string;
  required: boolean;
  description: string;
}

const AGREEMENT_ITEMS: AgreementItem[] = [
  {
    key: "terms",
    label: "서비스 이용약관 동의",
    required: true,
    description: "제 1조(목적)\n이하 설명",
  },
  {
    key: "privacy",
    label: "개인정보 수집 및 이용 동의",
    required: true,
    description: "수집하는 개인정보의 목록\n이하 설명",
  },
  {
    key: "community",
    label: "커뮤니티 이용규칙 확인",
    required: true,
    description: "커뮤니티 이용규칙 안내\n이하 설명",
  },
  {
    key: "ads",
    label: "광고성 정보 수신 동의",
    required: false,
    description: "다양한 맞춤형 광고성 정보가 메일로 전송됨\n이하 설명",
  },
  {
    key: "realname",
    label: "본인 명의 이용 가입",
    required: false,
    description: "타인 명의 가입 할 수 없음 무조건 본인\n이하 설명",
  },
  {
    key: "over14",
    label: "만 14세 이상",
    required: false,
    description: "만 14세 이상만 가능합니다.\n이하 설명",
  },
];

const initialAgreements: Record<AgreementKey, boolean> = {
  terms: false,
  privacy: false,
  community: false,
  ads: false,
  realname: false,
  over14: false,
};

function AgreeTermsPage() {
  const navigate = useNavigate();

  const [allAgree, setAllAgree] = useState(false);
  const [agreements, setAgreements] =
    useState<Record<AgreementKey, boolean>>(initialAgreements);

  const handleAllAgree = () => {
    const newValue = !allAgree;
    setAllAgree(newValue);
    setAgreements({
      terms: newValue,
      privacy: newValue,
      community: newValue,
      ads: newValue,
      realname: newValue,
      over14: newValue,
    });
  };

  const handleSingleAgree = (key: AgreementKey) => {
    const updated = { ...agreements, [key]: !agreements[key] };
    setAgreements(updated);
    setAllAgree(Object.values(updated).every(Boolean));
  };

  const handleNext = () => {
    if (!agreements.terms || !agreements.privacy || !agreements.community) {
      alert("필수 약관에 모두 동의해주세요.");
      return;
    }
    navigate("/register");
  };

  return (
    <div className="register-page default-root-value">
      <Helmet>
        <title>약관 동의 | 하이틴데이</title>
      </Helmet>
      <RegisterHeader title="약관 동의" />

      <Card className="agree-terms">
        <label className="agree-terms__all">
          <input type="checkbox" checked={allAgree} onChange={handleAllAgree} />
          아래 약관에 모두 동의합니다.
        </label>

        <hr className="agree-terms__divider" />

        <div className="agree-terms__list">
          {AGREEMENT_ITEMS.map((item) => (
            <label key={item.key} className="agree-terms__item">
              <span className="agree-terms__item-head">
                <input
                  type="checkbox"
                  checked={agreements[item.key]}
                  onChange={() => handleSingleAgree(item.key)}
                />
                {item.label}{" "}
                <span
                  className={
                    item.required
                      ? "agree-terms__required"
                      : "agree-terms__optional"
                  }
                >
                  ({item.required ? "필수" : "선택"})
                </span>
              </span>
              <span className="agree-terms__description">
                {item.description}
              </span>
            </label>
          ))}
        </div>

        <Button fullWidth size="lg" onClick={handleNext}>
          다음으로
        </Button>
      </Card>
    </div>
  );
}

export default AgreeTermsPage;
