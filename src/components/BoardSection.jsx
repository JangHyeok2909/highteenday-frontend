export default function BoardSection({ boardName, posts = [] }) {
  return (
    <div>
      <h2 className="font-bold text-red-500 mb-2">{boardName}</h2>
      <ul className="text-sm space-y-1">
        {posts.length === 0 ? (
          <li className="text-gray-400">게시글이 없습니다.</li>
        ) : (
          posts.slice(0, 4).map((post, index) => (
            <li key={index} className="flex justify-between truncate">
              <span className="truncate w-2/3">{post.title}</span>
              <span className="text-gray-500 text-xs">+{post.viewCount} 조회</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
