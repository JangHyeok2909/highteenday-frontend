# 00. Quickstart — 클론에서 화면 확인까지

## 이 문서가 답하는 질문

- 로컬에서 프론트 개발 서버를 띄우려면 무엇이 필요한가?
- 왜 `npm ci`에 `--legacy-peer-deps`가 필요한가?
- local / dev / prod 실행 환경은 어떻게 고르며, API 요청은 어디로 가는가?
- 백엔드가 먼저 떠 있어야 하는 이유는 무엇인가?

## 3줄 요약

- `npm ci --legacy-peer-deps` 후 `npm start`(= `start:local`) 하면 3000 포트에 뜬다. 플레인 설치는 peer 충돌로 실패한다 ([FKI-03](KNOWN-ISSUES.md#fki-03-ci-빌드가-cifalse와---legacy-peer-deps에-의존)).
- local 환경의 API 요청은 상대 경로로 나가 `package.json`의 `proxy`가 `http://localhost:8080`(백엔드)으로 넘긴다. WebSocket은 프록시를 타지 않고 `localhost:8080/ws`로 직접 붙는다. dev/prod를 보려면 `start:dev` / `start:prod`를 쓴다.
- 따라서 **백엔드를 먼저 8080에 띄워야** 로그인·데이터 조회가 된다 — 절차는 [백엔드 00-quickstart.md](../../highteenday-backend/docs/00-quickstart.md).

## 사전 요구사항

| 도구 | 버전 | 근거 |
|---|---|---|
| Node.js | 18 | `.github/workflows/deploy.yml · setup-node`가 18로 빌드·배포. `package.json`에 engines 필드는 없음 |
| npm | Node 18 동봉 버전 | 락파일 `lockfileVersion` 기준 npm 8 이상 |
| 백엔드 서버 | localhost:8080 | `package.json · proxy`, `env/.env.local · REACT_APP_WS_URL` |

## 절차

```bash
git clone <repo-url>
cd highteenday-frontend
npm ci --legacy-peer-deps   # 플레인 npm ci/install은 ERESOLVE로 실패 (FKI-03)
npm run start:local         # http://localhost:3000 (npm start 와 동일)
```

- `--legacy-peer-deps`가 필요한 이유: `@toast-ui/react-editor@3.2.3`이 peer로 `react@^17`을 요구하는데 이 프로젝트는 react 19다. CI 워크플로도 같은 플래그를 쓴다 (`.github/workflows/deploy.yml`).
- `npm start`는 `react-scripts`가 아니라 **`react-app-rewired`**를 실행한다 (`package.json · scripts`). 오버라이드 내용은 `config-overrides.js` 하나 — `@toast-ui` 패키지의 깨진 소스맵 경고를 source-map-loader에서 제외하는 것뿐이다.
- 백엔드 없이 띄우면 화면은 뜨지만 로그인·목록 조회가 전부 실패한다. 백엔드 기동과 시드 계정(`test1@gmail.com / asd`)은 [백엔드 00-quickstart.md](../../highteenday-backend/docs/00-quickstart.md) 참고.

## 실행 환경 3종(local / dev / prod)과 API 주소 결정

실행 환경은 **스크립트 이름으로 고른다.** 환경별 값은 `env/.env.<환경>` 한 곳에만 있다.

| 명령 | 환경 | API baseURL | WebSocket |
|---|---|---|---|
| `npm run start:local` (= `npm start`) | local | `''` (상대 경로 → CRA proxy 경유) | `http://localhost:8080/ws` |
| `npm run start:dev` | dev | `https://dev-api.highteenday.org` | `https://dev-api.highteenday.org/ws` |
| `npm run start:prod` | prod | `https://api.highteenday.org` | `https://api.highteenday.org/ws` |
| `npm run build:local` / `build:dev` / `build:prod` (= `npm run build`) | 동일 | 위와 같음 | 위와 같음 |

### 왜 런처 스크립트가 있는가

CRA는 `NODE_ENV`(development / production / test) 값으로만 env 파일을 고르기 때문에 `.env.development`·`.env.production` 두 갈래밖에 표현할 수 없다. `scripts/with-env.js`가 `env/.env.<환경>`을 먼저 읽어 자식 프로세스의 env에 심고 `react-app-rewired`를 실행한다. `react-scripts/config/env.js`의 dotenv는 *이미 설정된 변수를 덮지 않으므로* 여기서 심은 값이 최종값이 된다.

우선순위 (앞이 강함): **실제 셸 환경변수** > `env/.env.<환경>.local` (개인 오버라이드, git 무시) > `env/.env.<환경>` (공용, git 추적).

### 환경 변수

| 변수 | 용도 |
|---|---|
| `REACT_APP_ENV` | `local` \| `dev` \| `prod`. 앱이 자기 환경을 식별할 때 |
| `REACT_APP_API_BASE_URL` | axios `defaults.baseURL`. local만 빈 값 |
| `REACT_APP_SERVER_ORIGIN` | 백엔드 절대 origin. OAuth 리다이렉트처럼 **브라우저가 백엔드로 직접 페이지 이동**할 때 필요 (CRA proxy는 `Accept: text/html` 요청을 중계하지 않아 상대 경로로는 안 된다) |
| `REACT_APP_WS_URL` | SockJS 접속 주소. proxy·CDN을 타지 않아 모든 환경에서 절대 주소 |

- 이 값들을 읽는 곳은 `src/config/env.js` 한 곳뿐이다. 컴포넌트에서 `process.env`를 직접 읽지 않는다.
- 소비처: `src/index.js`(axios baseURL), `src/contexts/WebSocketContext.jsx`(WS_URL), `src/components/LoginPage/LoginButton/LoginButton.jsx`(OAuth 링크).
- 값은 빌드 시 CRA DefinePlugin이 문자열로 **인라인**한다 — 런타임에 바꿀 수 없고, 환경을 바꾸려면 다시 빌드해야 한다.
- `npm run start:dev` / `start:prod`는 프론트와 백엔드가 서로 다른 origin이므로 CRA proxy가 아니라 실제 CORS를 탄다. 백엔드의 `app.cors.allowed-origins`에 `http://localhost:3000`이 있어야 로그인이 된다. prod는 highteenday.org 도메인만 허용하므로 `start:prod`는 CORS로 막히는 것이 정상이다.

## 테스트와 빌드

- `npm test`는 현재 **실행되지 않는다** — CRA 스텁 테스트가 react-router-dom v7을 해석하지 못해 스위트 자체가 FAIL이다 ([FKI-01](KNOWN-ISSUES.md#fki-01-npm-test가-실행조차-되지-않음)).
- `npm run build`는 성공하지만 ESLint 경고 4건과 함께 컴파일되며, CI에서는 경고가 에러로 승격되기 때문에 배포 워크플로가 `CI=false`로 빌드한다 ([FKI-03](KNOWN-ISSUES.md#fki-03-ci-빌드가-cifalse와---legacy-peer-deps에-의존)).
- 배포는 main 푸시 시 GitHub Actions가 빌드 후 S3 + CloudFront에 올린다 (`.github/workflows/deploy.yml`).

## 코드 좌표

| 개념 | 위치 |
|---|---|
| local 프록시 대상 | `package.json · proxy` |
| start/build 스크립트 | `package.json · scripts` |
| 환경별 런처 | `scripts/with-env.js` |
| 환경별 값 정의 | `env/.env.local`, `env/.env.dev`, `env/.env.prod` |
| 앱에서 환경 값 읽기 | `src/config/env.js` |
| CRA 오버라이드 | `config-overrides.js · override` |
| axios baseURL 주입 | `src/index.js` |
| WS 주소 | `src/config/env.js · WS_URL` |
| CI 빌드·배포 | `.github/workflows/deploy.yml · deploy` |

## 알려진 문제·미확인 사항

- [FKI-01](KNOWN-ISSUES.md#fki-01-npm-test가-실행조차-되지-않음) npm test 실행 불가
- [FKI-03](KNOWN-ISSUES.md#fki-03-ci-빌드가-cifalse와---legacy-peer-deps에-의존) CI=false·--legacy-peer-deps 의존
- `[미확인: 플레인 npm ci의 성패 — npm install --dry-run의 ERESOLVE 실패로 미루어 실패로 추정되나, 로컬 node_modules를 지우면서까지 실측하지 않음]`
- `[미확인: 로컬에서 소셜 로그인 리다이렉트 동작 — 백엔드 OAuth 설정(frontend-url)에 의존]`
- `[미확인: dev 환경 백엔드 주소 — env/.env.dev 는 https://dev-api.highteenday.org 로 가정. 실제 개발 서버가 뜨면 이 파일 한 줄만 고치면 된다]`

마지막 검증일: 2026-07-30
