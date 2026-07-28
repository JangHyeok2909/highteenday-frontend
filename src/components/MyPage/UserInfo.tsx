import React from "react";
import { Link } from "react-router-dom";
import { FileText, MessageSquare, Bookmark, ChevronRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Avatar, Button, Card, Spinner } from "../ui";
import "./UserInfo.css";

export default function UserInfo() {
  const { user, isLoading: loading } = useAuth();

  if (loading) {
    return (
      <div className="userinfo__loading">
        <Spinner size={28} />
      </div>
    );
  }
  if (!user) {
    return (
      <p className="userinfo__error">사용자 정보를 불러오지 못했습니다.</p>
    );
  }

  const nickname = user.nickname || "익명";
  const school = user.schoolName || "학교 정보 없음";
  const grade = Number.isFinite(user.userGrade) ? `${user.userGrade}학년` : "";
  const userClass = Number.isFinite(user.userClass)
    ? `${user.userClass}반`
    : "";

  return (
    <div className="userinfo">
      <h1 className="userinfo__title">내 정보</h1>

      <Card className="userinfo__account">
        <Avatar src={user.profileUrl} alt="프로필" size={64} />

        <div className="userinfo__meta">
          <div className="userinfo__nickname">{nickname} 님</div>
          <div className="userinfo__sub">
            <span>{school}</span>
            {(grade || userClass) && (
              <>
                <span aria-hidden="true">·</span>
                <span>{[grade, userClass].filter(Boolean).join(" ")}</span>
              </>
            )}
          </div>
        </div>

        <Link to="/profile/edit">
          <Button variant="secondary" size="sm">
            프로필 수정
          </Button>
        </Link>
      </Card>

      <Card className="userinfo__section" title="활동 내역">
        <ul className="userinfo__links">
          <li>
            <Link className="userinfo__link" to="/mypage/posts">
              <FileText size={16} />
              작성한 게시글
              <ChevronRight size={16} className="userinfo__link-arrow" />
            </Link>
          </li>
          <li>
            <Link className="userinfo__link" to="/mypage/comments">
              <MessageSquare size={16} />
              작성한 댓글
              <ChevronRight size={16} className="userinfo__link-arrow" />
            </Link>
          </li>
          <li>
            <Link className="userinfo__link" to="/mypage/scraps">
              <Bookmark size={16} />
              스크랩
              <ChevronRight size={16} className="userinfo__link-arrow" />
            </Link>
          </li>
        </ul>
      </Card>

      <Card className="userinfo__section" title="이용 안내">
        <ul className="userinfo__links">
          <li>
            <Link className="userinfo__link" to="/terms">
              서비스 이용약관
              <ChevronRight size={16} className="userinfo__link-arrow" />
            </Link>
          </li>
          <li>
            <Link className="userinfo__link" to="/privacy">
              개인정보 처리 방침
              <ChevronRight size={16} className="userinfo__link-arrow" />
            </Link>
          </li>
        </ul>
      </Card>
    </div>
  );
}
