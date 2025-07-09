import React from 'react';

function Comment({ comment, replies, onReply }) {
  const kst = new Date(new Date(comment.createdAt).getTime() + 9 * 60 * 60 * 1000)
              .toLocaleString('ko-KR', { hour12: false });

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ borderBottom: '1px solid #ddd', paddingBottom: 8 }}>
        <p style={{ margin: 0, fontWeight: 600 }}>
          {comment.anonymous ? '익명' : comment.author}
        </p>
        <p style={{ whiteSpace: 'pre-line', margin: '4px 0' }}>{comment.content}</p>
        <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{kst}</p>
        <button style={{ fontSize: 12, marginTop: 4 }} onClick={() => onReply(comment.id)}>
          답글
        </button>
      </div>

      {replies.map(r => (
        <div
          key={r.id}
          style={{
            marginTop: 12,
            marginLeft: 28,
            padding: 12,
            background: '#f5f7fa',
            borderRadius: 6
          }}
        >
          <p style={{ margin: 0, fontWeight: 600 }}>↳ {r.anonymous ? '익명' : r.author}</p>
          <p style={{ whiteSpace: 'pre-line', margin: '4px 0' }}>{r.content}</p>
          <p style={{ fontSize: 12, color: '#888', margin: 0 }}>
            {new Date(new Date(r.createdAt).getTime() + 9 * 60 * 60 * 1000)
              .toLocaleString('ko-KR', { hour12: false })}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Comment;
