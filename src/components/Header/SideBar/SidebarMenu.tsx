import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { Button } from "../../ui";
import "./SidebarMenu.css";

interface SidebarBoard {
  boardId: number;
  boardName: string;
}

interface MenuGroup {
  title: string;
  items: { name: string; link: string }[];
}

function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [boards, setBoards] = useState<SidebarBoard[]>([]);
  const { user, isLogin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getBoards = async () => {
      try {
        const res = await axios.get<SidebarBoard[]>("/api/boards", {
          withCredentials: true,
        });
        setBoards(res.data);
      } catch (err) {
        console.log("게시판 불러오기 실패", err);
      }
    };
    getBoards();
  }, []);

  const menuGroups: MenuGroup[] = [
    {
      title: "커뮤니티",
      items: boards.map((board) => ({
        name: board.boardName,
        link: `/board/${board.boardId}`,
      })),
    },
    {
      title: "학교 생활",
      items: [
        { name: "급식표", link: "/meal" },
        { name: "시간표", link: "/timetable" },
      ],
    },
    {
      title: "계정",
      items: [
        { name: "내 정보", link: "/mypage" },
        { name: "프로필 수정", link: "/profile/edit" },
      ],
    },
    {
      title: "약관",
      items: [
        { name: "이용약관", link: "/terms" },
        { name: "개인정보처리방침", link: "/privacy" },
      ],
    },
  ];

  const close = () => setIsOpen(false);

  return (
    <div className="sidebar">
      <button
        type="button"
        className="sidebar__trigger"
        onClick={() => setIsOpen(true)}
        aria-label="메뉴 열기"
      >
        <Menu size={24} />
      </button>

      {isOpen && <div className="sidebar__overlay" onClick={close} />}

      <aside className={`sidebar__drawer ${isOpen ? "sidebar__drawer--open" : ""}`}>
        <div className="sidebar__top">
          <span className="sidebar__brand">하이틴데이</span>
          <button
            type="button"
            className="sidebar__close"
            onClick={close}
            aria-label="메뉴 닫기"
          >
            <X size={22} />
          </button>
        </div>

        {/* 모바일 유저 섹션 */}
        <div className="sidebar__user">
          {isLogin && user ? (
            <>
              <div className="sidebar__user-name">{user.nickname}님</div>
              <div className="sidebar__user-actions">
                <Link to="/mypage" className="sidebar__user-link" onClick={close}>
                  내 정보
                </Link>
                <button
                  type="button"
                  className="sidebar__user-logout"
                  onClick={() => {
                    logout();
                    close();
                  }}
                >
                  로그아웃
                </button>
              </div>
            </>
          ) : (
            <Button
              fullWidth
              onClick={() => {
                navigate("/login");
                close();
              }}
            >
              로그인
            </Button>
          )}
        </div>

        <nav className="sidebar__nav">
          {menuGroups.map(
            (group) =>
              group.items.length > 0 && (
                <div key={group.title} className="sidebar__group">
                  <div className="sidebar__group-title">{group.title}</div>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item.link}>
                        <Link
                          to={item.link}
                          className="sidebar__item"
                          onClick={close}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
          )}
        </nav>
      </aside>
    </div>
  );
}

export default SidebarMenu;
