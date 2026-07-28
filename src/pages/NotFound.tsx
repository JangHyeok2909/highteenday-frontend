import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button, EmptyState } from "../components/ui";

function NotFound() {
  return (
    <div className="default-root-value">
      <Helmet>
        <title>페이지를 찾을 수 없습니다 | 하이틴데이</title>
      </Helmet>
      <EmptyState
        icon={<Compass size={40} />}
        message={
          <>
            <strong>404 - 페이지를 찾을 수 없습니다</strong>
            <br />
            요청하신 주소는 존재하지 않거나 이동되었어요.
          </>
        }
        action={
          <Link to="/">
            <Button>홈으로 돌아가기</Button>
          </Link>
        }
      />
    </div>
  );
}

export default NotFound;
