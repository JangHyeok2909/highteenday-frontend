import React from "react";
import { Smartphone, Mail, ChevronRight } from "lucide-react";
import { Modal } from "../ui";
import "./Find.css";

interface FindIdProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToPw: () => void;
}

function FindId({ isOpen, onClose, onSwitchToPw }: FindIdProps) {
  const handlePhoneAuth = () => {
    console.log("휴대폰 인증 클릭");
  };

  const handleEmailAuth = () => {
    console.log("이메일 인증 클릭");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width={420}>
      <div className="find-modal__tabs">
        <button type="button" className="find-modal__tab find-modal__tab--active">
          아이디 찾기
        </button>
        <button type="button" className="find-modal__tab" onClick={onSwitchToPw}>
          비밀번호 찾기
        </button>
      </div>

      <p className="find-modal__description">
        가입 시 등록한 정보로 아이디를 찾을 수 있어요.
      </p>

      <div className="find-modal__options">
        <button type="button" className="find-modal__option" onClick={handlePhoneAuth}>
          <span className="find-modal__option-icon">
            <Smartphone size={20} />
          </span>
          <span className="find-modal__option-text">
            <span className="find-modal__option-title">휴대폰 인증</span>
            <span className="find-modal__option-sub">등록된 휴대폰으로 인증</span>
          </span>
          <ChevronRight size={18} className="find-modal__option-arrow" />
        </button>

        <button type="button" className="find-modal__option" onClick={handleEmailAuth}>
          <span className="find-modal__option-icon">
            <Mail size={20} />
          </span>
          <span className="find-modal__option-text">
            <span className="find-modal__option-title">이메일 인증</span>
            <span className="find-modal__option-sub">등록된 이메일로 인증</span>
          </span>
          <ChevronRight size={18} className="find-modal__option-arrow" />
        </button>
      </div>

      <p className="find-modal__note">
        가입 정보가 기억나지 않으시면{" "}
        <span className="find-modal__link">고객센터</span>로 문의해 주세요.
      </p>
    </Modal>
  );
}

export default FindId;
