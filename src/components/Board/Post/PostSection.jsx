import React from "react"
import PostDetail from "./PostDetail";
import CommentSection from "./Comment/CommentSection";

function PostSection() {

    return (
        <div id="post-section">
            <PostDetail />
            <CommentSection />
        </div>
    );
}
export default PostSection;