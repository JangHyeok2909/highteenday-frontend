# 단체 채팅방 — 프론트엔드

기존 1:1 채팅 UI에 단체 채팅방을 추가했습니다.
백엔드 스키마·API 설계는 `highteenday-backend/docs/GROUP_CHAT.md`를 참고하세요.

작업 브랜치: `feature/chat-websocket`

---

## 1. API 계약 변경 (깨지는 변경)

`ChatRoomDto`에서 `otherUserId` / `otherUserNickname` / `otherUserProfileUrl`이 **제거**됐습니다.

```js
// 변경 전
{ roomId, roomName, lastMessage, lastMessageAt, unreadCount,
  otherUserId, otherUserNickname, otherUserProfileUrl }

// 변경 후
{ roomId, roomName, category, lastMessage, lastMessageAt,
  unreadCount, memberCount, myRole, notificationEnabled, members: [...] }
```

핵심은 **`roomName`이 1:1 방에서도 항상 채워져 온다는 것**입니다. 서버가 PRIVATE 방일 때
상대 닉네임으로 조립해 내려줍니다. 그래서 화면에서 `category` 분기 없이 `roomName`만 렌더하면 됩니다.

`members`는 목록 화면에서 아바타 표시용으로 **나를 제외한 최대 4명**만 옵니다.
전체 멤버가 필요하면 `GET /api/chat/rooms/{id}/members`를 쓰세요.

메시지에는 `type`(`TEXT`/`IMAGE`/`SYSTEM`), `clientMsgId`, `unreadCount`가 추가됐습니다.

---

## 2. 미읽음 수 계산 — 서버와 같은 규칙을 클라이언트에서

1:1일 때는 "상대가 읽었나?"만 보면 됐지만(0 또는 1), 단체방은 메시지마다 안 읽은 인원 수가 필요합니다.

`ChatRoom.jsx`는 참여자별 읽음 위치(`members[].lastReadMsgId`)를 상태로 들고,
**서버와 동일한 규칙**으로 직접 계산합니다.

```js
const readPositions = members.map((m) => m.lastReadMsgId ?? 0);
const unreadCount = readPositions.filter((pos) => pos < msg.messageId).length;
```

이 값이 실시간으로 유지되는 경로는 두 가지입니다.

1. 진입 시 `GET /rooms/{id}/members`로 전원의 `lastReadMsgId`를 받음
2. 이후 `/topic/chat/room/{id}/read` 이벤트가 올 때마다 **해당 사용자 항목만** 갱신

```js
setMembers((prev) => prev.map((m) =>
  m.userId === event.userId ? { ...m, lastReadMsgId: event.lastReadMsgId } : m
));
```

전체를 다시 불러오지 않으므로 읽음 이벤트가 잦아도 네트워크 비용이 늘지 않습니다.

발신자는 서버가 전송 시점에 읽음 위치를 전진시키므로 자기 메시지 집계에서 자동으로 빠집니다.
프론트에서 별도 처리가 필요 없습니다.

---

## 3. 메시지 전송 멱등성

WebSocket 재연결 시 같은 메시지가 두 번 저장되는 것을 막기 위해 전송할 때마다
클라이언트가 UUID를 붙입니다.

```js
// ChatContext.jsx
publish("/app/chat/send", { roomId, content, imageUrl, clientMsgId: newClientMsgId() });
```

`crypto.randomUUID()`가 없는 환경을 위한 폴백이 들어 있습니다.
수신 쪽에서도 같은 `messageId`가 중복 도착하면 무시합니다.

```js
setMessages((prev) => {
  if (prev.some((m) => m.messageId === msg.messageId)) return prev;
  return [...prev, msg];
});
```

---

## 4. 컴포넌트

### 신규

| 파일 | 역할 |
|---|---|
| `Chat/GroupAvatar.jsx` | 1:1은 프로필 1개, 단체방은 최대 4명 2x2 격자 |
| `Chat/CreateGroupModal.jsx` | 친구 다중 선택 + 방 이름 입력 |
| `Chat/InviteMembersModal.jsx` | 기존 멤버를 제외한 친구 초대. 스타일은 CreateGroupModal과 공유 |
| `Chat/ChatMemberList.jsx` | 사이드 패널. 멤버 목록·역할 배지·강퇴·나가기 |

### 수정

| 파일 | 변경 |
|---|---|
| `contexts/ChatContext.jsx` | `clientMsgId` 발급, `markAsRead(roomId, lastMsgId)`, 단체방 API 6종 추가, SYSTEM 메시지를 안읽음에서 제외 |
| `Chat/ChatRoom.jsx` | 멤버 상태·읽음 위치 계산, `/members` 토픽 구독, 헤더 인원수, 멤버 패널/초대 모달 연결 |
| `Chat/ChatRoomList.jsx` | `otherUserNickname` → `roomName`, 그룹 아바타, 인원수 배지, 방 만들기 버튼 |
| `Chat/ChatMessage.jsx` | `SYSTEM` 타입은 가운데 한 줄로 렌더, 연속 발언 시 프로필/닉네임 생략(`showSender`) |

CSS는 `GroupAvatar.css`, `CreateGroupModal.css`, `ChatMemberList.css`가 신규이고
`ChatRoomList.css`, `ChatRoom.css`, `ChatMessage.css`에 클래스를 덧붙였습니다.

라우팅(`/chat`, `/chat/:roomId`)은 기존 그대로입니다.

---

## 5. 의존성

`@stomp/stompjs`, `sockjs-client`는 이 브랜치 `package.json`에 이미 선언돼 있었지만
`node_modules`가 다른 브랜치 기준이라 설치돼 있지 않았습니다.
브랜치를 옮겨온 직후라면 `npm install --legacy-peer-deps`를 한 번 실행해야 빌드됩니다.

**새로 추가한 의존성은 없습니다.**

---

## 6. 검증 상태

- `CI=false npx react-app-rewired build` 성공 (CI 워크플로와 동일한 조건)
- 남은 ESLint 경고 6건은 모두 이번 작업 이전부터 있던 것입니다
  (`FriendList`, `MonthlyMealCalendar`, `PasswordChangePage`, `WebSocketContext`,
  `ChatContext`의 `exhaustive-deps`). 새로 추가된 경고는 없습니다.
- **브라우저 실행 테스트는 하지 않았습니다.** 백엔드 연동이 필요한 시나리오
  (방 생성 → 초대 → 대화 → 미읽음 숫자 감소 → 강퇴 → 나가기)는 아직 확인되지 않았습니다.

---

## 7. 남은 작업

1. **커서 페이징 연동** — 백엔드는 `?cursor=&size=`를 지원하지만 프론트는 첫 페이지만 불러옵니다.
   위로 스크롤할 때 가장 오래된 `messageId`를 커서로 넘기는 처리가 필요합니다.
2. **`ChatContext`의 방별 구독을 per-user queue로 전환** — 지금은 내 방마다 STOMP 구독을 겁니다
   (`globalSubsRef`). 방이 늘수록 구독이 선형 증가합니다.
   `feature/realtime-notification`에 이미 있는 per-user queue 패턴을 재사용해
   목록 갱신용 요약 이벤트를 개인 큐 하나로 받고, 상세 화면에서만 방 토픽을 구독하는 편이 낫습니다.
3. **방 이름 변경 UI** — API(`PATCH /rooms/{id}`)와 `updateRoomName()`은 준비돼 있으나
   화면에서 부르는 곳이 없습니다.
4. **알림 on/off UI** — 마찬가지로 API와 필드(`notificationEnabled`)만 있고 화면이 없습니다.
5. **관리자 임명 UI** — `PATCH /rooms/{id}/members/{userId}/role` 미연동.

---

## 참고

TypeScript 마이그레이션 브랜치(`redesign/typescript-migration`)와는 별개입니다.
그 브랜치는 `components/Default.css`를 삭제하고 `Header/MainHader` → `MainHeader`로 옮겼기 때문에,
두 브랜치를 합칠 때 이 채팅 파일들의 import 2줄을 고치고 `.tsx`로 포팅해야 합니다.
