

// props에 isBoardPage 추가
function BoardSection({ boardName, posts = [], isBoardPage = false }) {
  return (
    <div>
      <h2>{boardName}</h2>

      {/* 게시글 목록은 board 페이지일 때만 보여줌 */}
      {isBoardPage && (
        <ul>
          {posts.length === 0 ? (
            <li>게시글이 없습니다.</li>
          ) : (
            posts.slice(0, 4).map((post, index) => (
              <li key={index}>
                <span>{post.title}</span>
                <span>{post.viewCount} 조회</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
export default BoardSection;