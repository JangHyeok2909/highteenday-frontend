import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./UserInfo.css";
import defaultImg from "assets/default_profile_image.jpg";


export default function UserInfo() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await axios.get("/api/user/userInfo", {
          withCredentials: true,
          headers: { Accept: "application/json" },
        });
        if (!cancelled) {
          setUser(res.data || null);
        }
      } catch (e) {
        if (!cancelled) {
          setErr("사용자 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const nickname = user?.nickname || "익명";
  const school = user?.schoolName || "학교 정보 없음";
  const grade = Number.isFinite(user?.userGrade) ? `${user.userGrade}학년` : "";
  const klass = Number.isFinite(user?.userClass) ? `${user.userClass}반` : "";


  if (loading) {
    return (
      <div id="userinfo">
        <div>불러오는 중…</div>
      </div>
    );
  }
  if (err) {
    return (
      <div id="userinfo">
        <div>{err}</div>
      </div>
    );
  }

  return (
    <div id="userinfo">
      {/* 상단 제목 */}
      <div className="header">
        <h1>내 정보</h1>
      </div>

      {/* 계정 정보 카드 */}
      <section className="account-card" aria-label="계정 정보">
        <div className="account-avatar">
          <img
            src={user.profileUrl || defaultImg}
            alt="프로필"
            onError={(e)=>{
              e.currentTarget.src = defaultImg;
            }}
          />
        </div>

        <div className="account-meta">
          <div className="nickname">{nickname} 님</div>
          <div className="sub-info">
            <span className="school">{school}</span>
            {(grade || klass) && (
              <>
                <span className="dot">·</span>
                <span className="gradeclass">
                  {[grade, klass].filter(Boolean).join(" ")}
                </span>
              </>
            )}
          </div>
        </div>

        <button type="button" className="edit-btn">
          프로필 수정
        </button>
      </section>

      {/* 본문 3열 섹션 */}
      <section className="sections">
        {/* 활동 내역 */}
        <div className="section">
          <h2>활동 내역</h2>
          <ul className="linklist">
            <li>
              <Link className="link" to="/mypage/posts">
                작성한 게시글
              </Link>
            </li>
            <li>
              <Link className="link" to="/mypage/comments">
                작성한 댓글
              </Link>
            </li>
            <li>
              <Link className="link" to="/mypage/scraps">
                스크랩
              </Link>
            </li>
          </ul>
        </div>

        {/* 이용 안내 */}
        <div className="section">
          <h2>이용 안내</h2>
          <ul className="linklist">
            <li>
              <a className="link" href="#">
                서비스 이용약관
              </a>
            </li>
            <li>
              <a className="link" href="#">
                개인정보 처리 방침
              </a>
            </li>
          </ul>
        </div>

        {/* 서비스 */}
        <div className="section">
          <h2>서비스</h2>
          <ul className="linklist">
            <li>
              <a className="link" href="#">
                고객센터
              </a>
            </li>
            <li>
              <a className="link" href="#">
                챗봇
              </a>
            </li>
            <li>
              <a className="link" href="#">
                자주 물어보는 질문
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
