import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./SidebarMenu.css";
import Menubar from "../../../Icons/Menubar";
import Arrow_Left_Icon from "../../../Icons/Arrow_Left_Icon";
import "../../../Default.css"

function SidebarMenu({size, color}) {

    const [isOpen, setIsOpen] = useState(false);
    const [boards, setBoards] = useState([]);

    // board 이름 들고오는 api 란
    useEffect(() => {

    }, []);

    const staticMenu = [
        {
            title: "급식 · 시간표",
            type: "group",
            items: [
                { name: "급식표", link: "/#" },
                { name: "시간표", link: "/#" },
            ]
        },
        {
            title: "계정 정보",
            type: "group",
            items: [
                { name: "아이디 변경", link: "/#" },
                { name: "비밀번호 변경", link: "/#" },
                { name: "이메일 변경" , link: "/#" }, // 삭제 - 이메일 변경 안됨
                { name: "학적 처리 내역", link: "/#" } // 이건 뭐징
            ]
        },
        {
            title: "이용 약관",
            type: "single",
            link: "/#"
        },
        {
            title: "1:1 문의",
            type: "single",
            link: "/#"
        },
        {
            title: "고객센터",
            type: "single",
            link: "/#"
        },
    ];

    const communitySection = {
        title: "커뮤니티",
        type: "group",
        items: [
            { name: "test1", link: "/#" },
            { name: "test2", link: "/#" }
        ]
    }
    
    //  나중에 위에 대신 넣어야 할 값
    // {
    //     title: "커뮤니티",
    //     type: "group",
    //     items: boards.map(board => ({
    //         name: board.name,
    //         link: `/boards/${board.id}`
    //     })),
    // };

    const menuData = [communitySection, ...staticMenu];

    return(
        <div id="Sidebar-menu">
            <div className="side-open-button" onClick={() => setIsOpen(true)} >
                <Menubar color={color} size={size} />
            </div>

            {/* 뒷 배경을 투명한 회색 으로 바꾸는거 */}
            {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} />}

            
            <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
                <div className="sidebar-content ">
                    <div className="sidebar-back-button inline-block" onClick={() => setIsOpen(false)}>
                        <Arrow_Left_Icon size={size} color={color} strokeWidth={1.5} />
                    </div>
                    <div className="menu-content inline-block">

                        <ul>
                            {menuData.map((section, idx) => (
                                section.type === "group" ? (
                                <li key={idx}>
                                    <div className="menu-section-title">
                                        {section.title}
                                    </div>
                                    {section.items && (
                                        <ul>
                                            {section.items.map((item, idx2) => (
                                                <li className="menu-item" key={idx2}>
                                                    <Link to={item.link}>{item.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                                ) : (
                                    <li key={idx} className="menu-section-title">
                                        <Link to={section.link}>{section.title}</Link>
                                    </li>
                                )
                                
                            ))}
                        </ul>

                    </div>
                </div>


            </div>
        </div>
    );
}

export default SidebarMenu; 