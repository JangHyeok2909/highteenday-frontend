import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchSection.css";
import Search_Icon from "../../../Icons/Search_Icon";
import "../../../Default.css"

function SearchSection() {

    const [value, setValue] = useState("");

    // 엔터키로 검색
    const handleButtonDown = () => {
        
    }

    // 돋보기로 검색
    const handleKeyDown = () => {
        
    }

    return (
        <div id="searchSection">
            <div className="search-bar">
                <input 
                    type="text" 
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleButtonDown} className="search-button">
                    <Search_Icon size={18} />
                </button>
            </div>
        </div>
    );
}

export default SearchSection;