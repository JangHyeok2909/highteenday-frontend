import React from "react"
import PostDetail from "./Post_Inner/PostDetail";
import CommentSection from "../Comment/CommentSection";
import Header from "../Header/Header";

function PostSection() {

    return (
        <div id="post-section" className="default-root-value">
            <div className="header">
                <Header isMainPage={false} />
            </div>
            <div className="post-container">
                <PostDetail />
                <CommentSection />
            </div>
        </div>
    );
}
export default PostSection;