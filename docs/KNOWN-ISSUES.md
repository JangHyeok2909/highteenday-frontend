# KNOWN-ISSUES — 프론트엔드 확인된 결함 목록

온보딩 문서 작성 과정에서 실제 코드를 읽고 실행해 확인한 결함·불일치의 단일 목록이다.
다른 문서는 결함을 본문에 서술하지 않고 이 파일의 항목 번호(FKI-nn)로 링크한다.
백엔드 결함은 `highteenday-backend/docs/KNOWN-ISSUES.md`(KI-nn)가 따로 관리한다.

## 빌드·테스트·CI

### FKI-01. npm test가 실행조차 되지 않음
- 위치: `src/App.test.js` — CRA 생성 시 만들어진 스텁 테스트("learn react" 링크 존재 검사)가 유일한 테스트인데, 이마저 실행되지 않는다.
- 원인: `react-router-dom` v7은 `exports` 맵 중심으로 배포되는데 CRA(react-scripts 5)에 내장된 구형 jest resolver가 진입점을 찾지 못한다. 테스트가 실행되더라도 현재 App에는 "learn react" 텍스트가 없어 실패한다.
- 결과: `CI=true npm test -- --watchAll=false` 실행 시 `Cannot find module 'react-router-dom' from 'src/App.js'`로 테스트 스위트 자체가 FAIL (2026-07-30 실측).
- 확인 방법: 저장소 루트에서 `CI=true npm test -- --watchAll=false`.

### FKI-02. `package-lock 2.json` 중복 락파일이 커밋되어 있음
- 위치: 저장소 루트 `package-lock 2.json` (약 674KB, git 추적 중 — `git ls-files`로 확인).
- 결과: npm은 이 파일을 사용하지 않으므로 순수한 혼동 요소다. 실제 락파일(`package-lock.json`)과 내용이 다르면 어느 쪽이 진실인지 판단할 수 없게 된다.
- 확인 방법: `git ls-files | grep package-lock`.

### FKI-03. CI 빌드가 CI=false와 --legacy-peer-deps에 의존
- 위치: `.github/workflows/deploy.yml` — `npm ci --legacy-peer-deps` 및 `CI=false npm run build`.
- 원인 1 (`--legacy-peer-deps`): `@toast-ui/react-editor@3.2.3`이 peer로 `react@^17.0.1`을 요구하는데 프로젝트는 react 19다. 플레인 `npm install`은 ERESOLVE로 실패한다 (`npm install --dry-run`으로 실측).
- 원인 2 (`CI=false`): `npm run build`가 ESLint 경고 4건과 함께 컴파일된다 (2026-07-30 실측 — `FriendList.jsx`·`MonthlyMealCalendar.jsx`·`PasswordChangePage.jsx`의 no-unused-vars 3건 + `ChatContext.jsx`의 exhaustive-deps 1건, FKI-08 참고). CI 환경에서는 경고가 에러로 승격되므로 `CI=false` 없이는 배포 빌드가 실패한다.
- 부수 사실: 워크플로에 테스트 단계가 아예 없다 (FKI-01과 맞물려 있음).
- 확인 방법: `npm run build` 출력에서 "Compiled with warnings." 확인.

## 코드 위생

### FKI-04. 어디서도 import되지 않는 죽은 파일 19개
- 전수 확인 방법: src 아래 모든 js/jsx/tsx의 import 구문을 대조 (경로 별칭 `components/...`와 `.jsx` 확장자 포함 import까지 검사). 아래 목록은 2026-07-30 기준 어떤 파일도 import하지 않는 파일이다.
  - `src/components/Icons/Arrow_Right_Icon.jsx`
  - `src/components/Icons/BookMark_icon.jsx`
  - `src/components/Icons/Search_Icon.jsx`
  - `src/components/Icons/UserAddIcon.jsx`
  - `src/components/LoginRelated/Register.jsx`
  - `src/components/MainPage/Body/UserSection/UserInfo/UserInfo.jsx`
  - `src/components/MealCalendarPage/MealTabs.jsx`
  - `src/components/MyPage/MyActivity.jsx`
  - `src/components/MyPage/MyCommentsPage.jsx`
  - `src/components/MyPage/UserProfilePage.jsx`
  - `src/components/MyPage/activaties/MyActivity.jsx`
  - `src/components/MyPage/activaties/MyPostsPage.jsx`
  - `src/components/MyPage/activaties/MyScrapsPage.jsx`
  - `src/components/RegisterRelated/Profile/NicknameChange.jsx`
  - `src/components/RegisterRelated/Profile/PassChange.jsx`
  - `src/components/RegisterRelated/Profile/ProfileChange.jsx`
  - `src/components/RegisterRelated/Profile/SchoolChange.jsx`
  - `src/pages/TermsToggleItem.jsx`
  - `src/pages/UserInfoPage.jsx`
- 중복 쌍 주의: `MyActivity.jsx`는 `MyPage/`와 `MyPage/activaties/`에 두 벌 있고 둘 다 죽어 있다. `MyCommentsPage.jsx`도 두 벌인데 **`activaties/` 쪽만** `src/App.js`가 사용하고 `MyPage/` 쪽은 죽은 복사본이다. 파일명이 같아 열 때마다 어느 쪽인지 확인해야 한다.
- 결과: 죽은 파일 다수가 axios 호출·검증 로직을 담고 있어, 수정 시 "고쳤는데 반영이 안 된다"는 함정이 된다.

### FKI-05. 오타 디렉토리명 activaties, MainHader
- 위치: `src/components/MyPage/activaties/` (activities의 오타), `src/components/Header/MainHader/` (MainHeader의 오타 — 실제 헤더 컴포넌트 `Header.jsx`가 여기 산다).
- 결과: `src/App.js`가 `./components/MyPage/activaties/MyCommentsPage`를 import하고 있어 오타가 실사용 경로에 고정되어 있다. 검색·자동완성에서 파일을 못 찾는 원인이 된다.
- 확인 방법: `ls src/components/MyPage`, `ls src/components/Header`.

### FKI-06. public/index.html이 CRA 기본값과 플레이스홀더 메타로 방치
- 위치: `public/index.html`.
- 내용: `<html lang="en">` (한국어 서비스인데 en), `<meta name="description" content="Web site created using create-react-app">` (CRA 기본값 그대로), `<meta name="privacy" content="/개인정보약관 경로/">`·`<meta name="terms" content="/이용약관 경로/">` (한글 플레이스홀더가 실제 값처럼 커밋됨).
- 결과: 검색엔진·스크린리더에 잘못된 언어와 무의미한 설명이 노출된다.
- `[미확인: <meta name="oauth-network-verification">의 용도와 값의 유효성 — 코드에서 참조처를 찾지 못함]`

### FKI-07. 동작하지 않는 Tailwind·shadcn 잔재
- 사실 관계 (전부 실측):
  - `tailwindcss` 의존성과 `tailwind.config.*` 파일이 저장소에 없다.
  - 그런데 `src/components/MealCalendarPage/DailyMealView.jsx · DailyMealView`가 `p-4`, `text-lg font-semibold`, `text-gray-600` 등 Tailwind 유틸리티 클래스를 사용한다 — 이 클래스들은 어떤 CSS로도 정의되지 않아 **스타일이 전혀 적용되지 않는다**.
  - shadcn 설정 파일 `component.json`이 `tailwind.css: "src/styles/globals.css"`를 가리키지만 `src/styles/` 디렉토리 자체가 없다. 별칭 `@/components` 등도 `tsconfig.json`(baseUrl=src, `@` 별칭 없음)과 불일치.
  - `tailwind-merge`, `tw-animate-css`, `class-variance-authority` 패키지가 설치되어 있으나 src에서 사용처 0건.
- 결과: 급식 일별 화면이 무스타일로 렌더되고, shadcn CLI로 컴포넌트를 추가하려 하면 실패한다.
- 확인 방법: `grep -rn "tailwind" package.json`, `ls src/styles`, DailyMealView를 브라우저에서 확인.

## 런타임 구조

### FKI-08. ChatContext — 재구독 누락 가능성 + provider value 미메모이제이션
- 위치: `src/contexts/ChatContext.jsx · ChatProvider`.
- 문제 1: 전 채팅방 글로벌 구독 effect의 의존성 배열이 `[connected, chatRooms.length, subscribe]`다. 방 **개수는 그대로인 채 구성만 바뀌면**(예: 방 하나 나가고 하나 새로 참가해 목록이 교체) effect가 재실행되지 않아 새 방 구독이 누락된다. effect 본문이 `chatRooms`를 읽으므로 CRA 빌드도 `React Hook useEffect has a missing dependency: 'chatRooms'` 경고를 낸다 (FKI-03의 경고 4건 중 하나).
- 문제 2: provider의 `value`가 매 렌더마다 새 객체 리터럴로 만들어진다 (`WebSocketContext.jsx`는 `useMemo`를 쓰는 것과 대조적). ChatProvider가 리렌더될 때마다 `useChat()` 소비자 전체가 리렌더된다.
- 확인 방법: `npm run build` 경고 확인, `ChatContext.jsx`의 `<ChatContext.Provider value={{...}}>` 확인.

### ~~FKI-09. .env가 .gitignore에 있는데 git이 추적 중 + 내용 결함~~ (해결됨)
- **2026-07-30 해결.** 루트 `.env`·`.env.development`·`.env.production`을 `git rm` 하고 환경별 설정을 `env/.env.{local,dev,prod}`로 옮겼다. 중복 `PORT=3000`과 죽은 값 `REACT_APP_API_BASE_URL=/api`도 함께 사라졌다.
- 현재 규칙: `.gitignore`가 루트 `.env*`를 전부 무시하고, `env/.env.{local,dev,prod}`만 부정 패턴으로 추적한다. 개인 오버라이드 `env/.env.*.local`은 무시된다.
- 주의: `env/.env.*`는 **추적되는 공용 파일**이므로 여전히 비밀값을 넣으면 안 된다. 비밀값은 셸 환경변수나 `env/.env.<환경>.local`로 주입한다 (둘 다 공용 파일보다 우선한다).
- 확인 방법: `git ls-files | grep env`, `git check-ignore -v env/.env.dev.local`.

### FKI-10. ErrorBoundary 부재 + console.log 잔존
- ErrorBoundary: src 전체에서 `ErrorBoundary`·`componentDidCatch` 0건 (grep 실측). 렌더 중 예외가 나면 React 19 기본 동작대로 루트 전체가 언마운트되어 흰 화면이 된다.
- console.log: 주석 1건(`src/index.js`)을 제외하고 약 20건이 8개 파일에 남아 있다 — 최다는 죽은 파일 `LoginRelated/Register.jsx`(9건)이고, 실사용 파일 중에는 `RegisterRelated/Account/CreateAccount.jsx`(3건), `Find/FindId.jsx`(2건), `RegisterRelated/Profile/ProfileUploader.jsx`(2건) 등. `console.error`는 67건으로 사실상 에러 표준 출력이 콘솔이다.
- 확인 방법: `grep -rn "console.log" src --include="*.js*"`.

마지막 검증일: 2026-07-30
