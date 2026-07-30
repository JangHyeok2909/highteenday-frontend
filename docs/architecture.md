# Architecture — 라우팅, Context, API 호출, 스타일링

## 이 문서가 답하는 질문

- 어떤 URL이 어떤 컴포넌트를 렌더하며, 인증 가드는 어디에 있는가?
- 전역 상태를 쥔 Context 4종은 각각 무엇을 제공하는가?
- API 호출 코드는 어디에 모여 있고, 어디에 흩어져 있는가?
- 스타일과 폼 검증은 어떤 방식이 혼재하는가?

## 3줄 요약

- 라우팅은 `src/App.js` 한 파일에 30개 Route가 평면으로 나열되며, **라우트 차원의 인증 가드(ProtectedRoute류)는 존재하지 않는다** — 모든 경로가 비로그인으로도 렌더된다.
- 전역 상태는 Context 4종(Auth → WebSocket → Notification → Chat 순 중첩, `src/index.js`)이 전부이고 별도 상태 라이브러리는 없다.
- API 호출은 중앙 모듈이 인터셉터(`utils/setupAxios.js`) 하나뿐이고, 43개 화면 파일이 axios를 직접 import해 `withCredentials: true`를 요청마다 수동 반복한다(98회).

## 라우팅 — src/App.js 전수

`BrowserRouter`는 `src/index.js`에 있고, `App`은 `<Routes>` 평면 목록이다. 인증 가드 열이 전부 "없음"인 것은 오기가 아니라 실측 결과다: `ProtectedRoute`·`PrivateRoute`·`RequireAuth`에 해당하는 코드가 저장소에 없다 (grep 0건). 대신 일부 컴포넌트가 **행동 시점**(댓글 작성, 사이드바 메뉴 등)에 `navigate("/login")`으로 보낸다 — `CommentRelated/CreateComment.jsx`, `Header/MainHader/Header.jsx`, `Post/Post_Inner/PostDetail.jsx` 등 7개 파일.

| 경로 | 컴포넌트 (import 원본) | 인증 가드 |
|---|---|---|
| `/` | MainPage — `components/MainPage/MainPage` | 없음 |
| `/login` | LoginPage — `components/LoginPage/LoginPage` | 없음 |
| `/register` | CreateAccountPage — `components/RegisterRelated/Account/CreateAccountPage` | 없음 |
| `/register/school` | SchoolRegisterPage — `components/RegisterRelated/School/SchoolRegisterPage` | 없음 |
| `/register/profile` | RegisterProfilePage — `components/RegisterRelated/Profile/RegisterProfilePage` | 없음 |
| `/profile/edit` | ProfileEditPage — `components/MyPage/ProfileEditPage` | 없음 |
| `/profile/edit/image` | ProfileImageChangePage — `components/MyPage/ProfileImageChangePage` | 없음 |
| `/profile/edit/school` | SchoolChangePage — `components/MyPage/SchoolChangePage` | 없음 |
| `/profile/edit/password` | PasswordChangePage — `components/MyPage/PasswordChangePage` | 없음 |
| `/profile/edit/nickname` | NicknameChangePage — `components/MyPage/NicknameChangePage` | 없음 |
| `/profile/edit/phone` | PhoneChangePage — `components/MyPage/PhoneChangePage` | 없음 |
| `/board-overview` | BoardOverview — 실체는 `components/MainPage/Body/BoardSection/BoardSection` (주석: "나중에 삭제") | 없음 |
| `/board/:boardId` | BoardPage — `components/Board/BoardPage` | 없음 |
| `/board/post/:postId` | PostSection — `components/Post/PostSection` | 없음 |
| `/post/write` | WritePostPage — `components/Post/Post_Inner/WritePostPage` | 없음 |
| `/post/edit/:postId` | WritePostPage (동일 컴포넌트 재사용) | 없음 |
| `/mypage` | Mypage — `components/MyPage/MyPage` | 없음 |
| `/mypage/posts` | MyPostLikeActivity type="posts" — `components/MyPage/MyPostLikeActivity` | 없음 |
| `/mypage/comments` | MyCommentsPage — `components/MyPage/activaties/MyCommentsPage` (오타 디렉토리, [FKI-05](KNOWN-ISSUES.md#fki-05-오타-디렉토리명-activaties-mainhader)) | 없음 |
| `/mypage/scraps` | MyPostLikeActivity type="scraps" | 없음 |
| `/friend` | FriendList — `components/Friend/FriendList` | 없음 |
| `/chat` | ChatRoomList — `components/Chat/ChatRoomList` | 없음 |
| `/chat/:roomId` | ChatRoom — `components/Chat/ChatRoom` | 없음 |
| `/timetable` | TimetablePage — `components/TimetableRelated/TimetablePage` | 없음 |
| `/meal` | MealPage — `components/MealCalendarPage/MealPage` | 없음 |
| `/welcome` | WelcomePage — `pages/WelcomePage` | 없음 |
| `/FormRegisterPage` | AgreeTermsPage — `components/RegisterRelated/AgreeTerms/AgreeTermsPage` | 없음 |
| `/privacy` | Privacy — `pages/Privacy` | 없음 |
| `/terms` | Terms — `pages/Terms` | 없음 |
| `*` | NotFound — `pages/NotFound` | 없음 |
| `/#` | element 없는 빈 Route (효과 없음, 잔재) | — |

## Context 4종 — 제공 값 실측

중첩 순서는 `src/index.js` 기준 `AuthProvider > WebSocketProvider > NotificationProvider > ChatProvider`. 안쪽 Provider가 바깥 훅을 소비하는 의존 방향이다.

### AuthContext — `src/contexts/AuthContext.tsx · AuthProvider`

유일한 TypeScript 파일. 제공 값: `user`(User 또는 null), `isLogin`(`!!user`), `isLoading`, `login(email, password)`, `logout()`, `refresh()`.

- 마운트 시 `refresh()`가 `GET /api/user/userInfo`로 세션(쿠키) 유효성을 확인해 `user`를 채운다. 토큰 자체를 저장하지 않는다 — 인증 상태의 근거는 HttpOnly 쿠키이고 프론트는 userInfo 성공 여부로만 판단한다.
- `login`은 `POST /api/user/login` 후 `refresh()`, 성공 시 `/`로 이동. 실패 시 `alert`로 서버 메시지를 그대로 표출한다.
- `logout`은 `POST /api/user/logout` 후 `window.location.reload()`로 전체 상태를 초기화한다.

### WebSocketContext — `src/contexts/WebSocketContext.jsx · WebSocketProvider`

STOMP over SockJS 클라이언트의 단일 소유자. 제공 값: `connected`(boolean), `subscribe(destination, callback)`, `publish(destination, body)` — `useMemo`로 참조 고정. 연결 수명은 `isLogin`에 묶여 있다(로그아웃 시 deactivate). 인증·재연결 설계는 [auth-websocket.md](auth-websocket.md)가 단일 출처다.

### NotificationContext — `src/contexts/NotificationContext.jsx · NotificationProvider`

실시간 알림. 제공 값: `unreadCount`, `notifications`, `hasMore`, `isLoading`, `error`, `panelOpen`, `setPanelOpen`, `fetchNotifications`, `loadMore`, `markAsRead`, `markAllAsRead`, `deleteNotification`, `deleteAllRead`.

- 연결되면 `/user/queue/notifications`를 구독한다 (세션별 개인 큐 — 백엔드 [04-request-flow.md](../../highteenday-backend/docs/04-request-flow.md)의 목적지 규칙 참고).
- 읽음 처리·삭제는 전부 **낙관적 갱신 + 실패 시 롤백** 패턴이다 (`markAsRead` 등에서 상태 선반영 후 API 실패 시 복원).

### ChatContext — `src/contexts/ChatContext.jsx · ChatProvider`

채팅방 목록·안읽음 총계·방 구독 관리. 제공 값: `chatRooms`, `totalUnreadCount`, `fetchChatRooms`, `subscribe`(방 구독, 내부명 `subscribeChatRoom`), `unsubscribe`, `sendMessage`, `markAsRead`, `setActiveRoom`, `createGroupRoom`, `inviteMembers`, `leaveRoom`, `kickMember`, `updateRoomName`, `fetchMembers`.

구독 구조와 멱등성 설계는 [auth-websocket.md](auth-websocket.md) 참고. 재구독 누락 가능성과 value 미메모이제이션은 [FKI-08](KNOWN-ISSUES.md#fki-08-chatcontext--재구독-누락-가능성--provider-value-미메모이제이션).

## API 호출 구조 — 중앙화 현황

- **전역 설정은 두 줄뿐이다**: `src/index.js`가 `axios.defaults.baseURL`을 env에서 주입하고 `setupAxiosInterceptors()`를 건다.
- **중앙 모듈은 `src/utils/setupAxios.js` 하나** — 401 토큰 갱신 응답 인터셉터다 (상세는 [auth-websocket.md](auth-websocket.md)). 도메인별 API 모듈(예: friendApi, postApi)은 **존재하지 않는다**. 온보딩 시점에 `utils/friendApi.js`가 있다는 구전이 있었으나 실측 결과 해당 파일은 없고 친구 API도 `Friend/FriendList.jsx` 등이 직접 호출한다.
- 실측 수치 (2026-07-30): axios를 import하는 파일 49개 = 화면 컴포넌트·페이지 43 + contexts 4 + `index.js` + `setupAxios.js`. 즉 사실상 **모든 화면이 axios를 직접 호출**한다.
- `withCredentials: true`가 46개 파일에서 98회 수동 반복된다. 쿠키 인증이므로 전 요청에 필요하지만 `axios.defaults.withCredentials = true` 같은 전역 기본값은 설정되어 있지 않다 — 새 호출을 쓸 때 한 번이라도 빠뜨리면 그 요청만 익명으로 나간다는 뜻이다. (급식 조회처럼 공개 API는 일부러 뺀 곳도 있어 기계적으로 통일할 수는 없다 — `MealCalendarPage/DailyMealView.jsx · fetchDailyMeal`.)

## 스타일링 현황 — 4가지 방식 혼재

| 방식 | 규모 | 위치 |
|---|---|---|
| plain CSS (컴포넌트 옆 `.css` import) | 61개 파일 — 지배적 방식 | src 전역 |
| CSS Modules | 2개뿐 | `components/MealCalendarPage/MealPage.module.css`, `components/ReactionButtons/ReactionButtons.module.css` |
| 인라인 style 객체 | Timetable 폴더에 집중 | `TimetableRelated/TimetableTemplateList.jsx`(31곳), `SubjectList.jsx`(25곳), `TimetablePage.jsx`(18곳), `TimetableGrid.jsx`(11곳) |
| Tailwind 클래스 | 1개 파일이 사용하나 **동작하지 않음** | `MealCalendarPage/DailyMealView.jsx` — [FKI-07](KNOWN-ISSUES.md#fki-07-동작하지-않는-tailwindshadcn-잔재) |

plain CSS는 전역 네임스페이스라 클래스명 충돌 방지 규칙이 따로 없다. 공용 리셋류는 `components/Default.css`를 각 화면이 직접 import하는 방식이다 (`Chat/ChatRoom.jsx` 등).

## 폼 검증 — utils/validationSchemas.js

`react-hook-form` + `@hookform/resolvers` + `yup` 조합이고, **필드 단위 yup 스키마가 `src/utils/validationSchemas.js`에 중앙화**되어 있다: `nameField`, `nicknameField`, `phoneField`, `emailField`, `passwordField`, `confirmPasswordField`, `birthField`(15~30세 검증), `gradeField`, `genderField`, 보조 함수 `filterHangul`. 각 화면은 이 필드들을 조합해 `yup.object`를 만든다 — 사용처는 `RegisterRelated/Account/CreateAccount.jsx`, `MyPage/NicknameChangePage.jsx`, `MyPage/PasswordChangePage.jsx`, `MyPage/PhoneChangePage.jsx` (그 외 2곳은 죽은 파일, [FKI-04](KNOWN-ISSUES.md#fki-04-어디서도-import되지-않는-죽은-파일-19개)).

## 코드 좌표

| 개념 | 위치 |
|---|---|
| 전체 라우트 | `src/App.js · App` |
| Provider 중첩 | `src/index.js` |
| 인증 상태·login/logout | `src/contexts/AuthContext.tsx · AuthProvider` |
| STOMP 클라이언트 소유 | `src/contexts/WebSocketContext.jsx · WebSocketProvider` |
| 알림 구독·낙관적 갱신 | `src/contexts/NotificationContext.jsx · NotificationProvider` |
| 채팅방 목록·구독 관리 | `src/contexts/ChatContext.jsx · ChatProvider` |
| 401 갱신 인터셉터 | `src/utils/setupAxios.js · setupAxiosInterceptors` |
| yup 필드 스키마 | `src/utils/validationSchemas.js` |
| 날짜 포맷 유틸 | `src/utils/dateFormat.js` |

## 알려진 문제·미확인 사항

- [FKI-04](KNOWN-ISSUES.md#fki-04-어디서도-import되지-않는-죽은-파일-19개) 죽은 파일 19개 (MyPage 중복 쌍 포함)
- [FKI-05](KNOWN-ISSUES.md#fki-05-오타-디렉토리명-activaties-mainhader) activaties·MainHader 오타 디렉토리
- [FKI-07](KNOWN-ISSUES.md#fki-07-동작하지-않는-tailwindshadcn-잔재) Tailwind·shadcn 잔재
- [FKI-08](KNOWN-ISSUES.md#fki-08-chatcontext--재구독-누락-가능성--provider-value-미메모이제이션) ChatContext 재구독·value 문제
- [FKI-10](KNOWN-ISSUES.md#fki-10-errorboundary-부재--consolelog-잔존) ErrorBoundary 부재
- `[미확인: 비로그인 상태로 /mypage 등 보호성 화면에 직접 진입했을 때 화면별 실제 표시 — 라우트 가드가 없다는 사실만 확인했고 전 화면을 브라우저로 실측하지는 않음]`

마지막 검증일: 2026-07-30
