import React, { useState } from "react";
import "./SearchSection.css";
import Search_Icon from "../../../Icons/Search_Icon";
import "../../../Default.css"

function SearchSection() {

    const [value, setValue] = useState("");

    // 돋보기로 검색
    const handleSearch = (e) => {
        e.preventDefault();
        if(!value.trim()) return alert("검색어를 입력해주세요");
        console.log("검색 기능 호출");
    };

    return (
        <div id="searchSection">
            <div className="search-container">
                <form className="search-bar" onSubmit={handleSearch}>
                    <input 
                        type="text" 
                        value={value}
                        placeholder="검색어를 입력하세요"
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <button type="submit" className="search-button">
                        <Search_Icon size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SearchSection;