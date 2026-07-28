import React, { useState } from "react";
import { Lock } from "lucide-react";
import { Button, Input, Modal } from "../ui";
import "./Find.css";

interface FindPwProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToId: () => void;
}

function FindPw({ isOpen, onClose, onSwitchToId }: FindPwProps) {
  const [email, setEmail] = useState("");

  const handleFindPassword = () => {
    console.log("찾기 버튼 클릭", email);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width={420}>
      <div className="find-modal__tabs">
        <button type="button" className="find-modal__tab" onClick={onSwitchToId}>
          아이디 찾기
        </button>
        <button type="button" className="find-modal__tab find-modal__tab--active">
          비밀번호 찾기
        </button>
      </div>

      <div className="find-modal__pw-head">
        <span className="find-modal__pw-icon">
          <Lock size={22} />
        </span>
        <h3 className="find-modal__pw-title">비밀번호를 잊으셨나요?</h3>
        <p className="find-modal__pw-description">
          가입 시 등록한 이메일 주소를 입력하면
          <br />
          비밀번호 재설정 링크를 보내드릴게요.
        </p>
      </div>

      <div className="find-modal__field">
        <label className="find-modal__field-label" htmlFor="find-pw-email">
          이메일 주소
        </label>
        <Input
          id="find-pw-email"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <Button fullWidth size="lg" onClick={handleFindPassword} disabled={!email}>
        비밀번호 재설정 메일 보내기
      </Button>

      <p className="find-modal__note">
        이메일이 기억나지 않으시면{" "}
        <span className="find-modal__link">고객센터</span>로 문의해 주세요.
      </p>
    </Modal>
  );
}

export default FindPw;
