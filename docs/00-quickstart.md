# 00. Quickstart — 클론에서 화면 확인까지

## 이 문서가 답하는 질문

- 로컬에서 프론트 개발 서버를 띄우려면 무엇이 필요한가?
- 왜 `npm ci`에 `--legacy-peer-deps`가 필요한가?
- `.env` 3종은 각각 무엇을 결정하며, API 요청은 어디로 가는가?
- 백엔드가 먼저 떠 있어야 하는 이유는 무엇인가?

## 3줄 요약

- `npm ci --legacy-peer-deps` 후 `npm start` 하면 3000 포트에 뜬다. 플레인 설치는 peer 충돌로 실패한다 ([FKI-03](KNOWN-ISSUES.md#fki-03-ci-빌드가-cifalse와---legacy-peer-deps에-의존)).
- 개발 모드의 API 요청은 상대 경로로 나가 `package.json`의 `proxy`가 `http://localhost:8080`(백엔드)으로 넘긴다. WebSocket은 프록시를 타지 않고 `localhost:8080/ws`로 직접 붙는다.
- 따라서 **백엔드를 먼저 8080에 띄워야** 로그인·데이터 조회가 된다 — 절차는 [백엔드 00-quickstart.md](../../highteenday-backend/docs/00-quickstart.md).

## 사전 요구사항

| 도구 | 버전 | 근거 |
|---|---|---|
| Node.js | 18 | `.github/workflows/deploy.yml · setup-node`가 18로 빌드·배포. `package.json`에 engines 필드는 없음 |
| npm | Node 18 동봉 버전 | 락파일 `lockfileVersion` 기준 npm 8 이상 |
| 백엔드 서버 | localhost:8080 | `package.json · proxy`, `src/contexts/WebSocketContext.jsx · WS_URL` |

## 절차

```bash
git clone <repo-url>
cd highteenday-frontend
npm ci --legacy-peer-deps   # 플레인 npm ci/install은 ERESOLVE로 실패 (FKI-03)
npm start                   # http://localhost:3000
```

- `--legacy-peer-deps`가 필요한 이유: `@toast-ui/react-editor@3.2.3`이 peer로 `react@^17`을 요구하는데 이 프로젝트는 react 19다. CI 워크플로도 같은 플래그를 쓴다 (`.github/workflows/deploy.yml`).
- `npm start`는 `react-scripts`가 아니라 **`react-app-rewired`**를 실행한다 (`package.json · scripts`). 오버라이드 내용은 `config-overrides.js` 하나 — `@toast-ui` 패키지의 깨진 소스맵 경고를 source-map-loader에서 제외하는 것뿐이다.
- 백엔드 없이 띄우면 화면은 뜨지만 로그인·목록 조회가 전부 실패한다. 백엔드 기동과 시드 계정(`test1@gmail.com / asd`)은 [백엔드 00-quickstart.md](../../highteenday-backend/docs/00-quickstart.md) 참고.

## .env 3종과 API 주소 결정

CRA는 `npm start`에서 `.env.development` > `.env`, `npm run build`에서 `.env.production` > `.env` 순으로 읽는다. 실제 내용 (2026-07-30 기준):

| 파일 | 내용 | 역할 |
|---|---|---|
| `.env` | `HOST=0.0.0.0`, `PORT=3000` 2회 중복, `DANGEROUSLY_DISABLE_HOST_CHECK=true`, `REACT_APP_API_BASE_URL=/api` | 공통 개발 서버 설정. 외부 기기 접속 허용(HOST/호스트체크 해제). `REACT_APP_API_BASE_URL=/api`는 아래 두 파일에 항상 덮여 **미사용** ([FKI-09](KNOWN-ISSUES.md#fki-09-env가-gitignore에-있는데-git이-추적-중--내용-결함)) |
| `.env.development` | `REACT_APP_API_BASE_URL=` (빈 값) | dev에서 axios baseURL을 `''`로 만들어 요청이 상대 경로로 나가게 함 → `package.json · proxy`(`http://localhost:8080`)가 백엔드로 중계 |
| `.env.production` | `REACT_APP_API_BASE_URL=https://api.highteenday.org` | 배포 빌드에서 API 절대 주소 |

- 이 값을 소비하는 곳은 한 곳뿐이다: `src/index.js`에서 `axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || ''`.
- WebSocket 주소는 env를 쓰지 않는다: `src/contexts/WebSocketContext.jsx · WS_URL`이 development면 `http://localhost:8080/ws`, 그 외엔 `/ws`로 하드코딩되어 있다. 즉 dev의 WS는 CRA 프록시를 우회해 백엔드에 직접 붙는다.
- `.env`가 `.gitignore`에 올라 있는데도 git이 추적 중인 상태다 — 비밀값을 넣으면 안 된다 ([FKI-09](KNOWN-ISSUES.md#fki-09-env가-gitignore에-있는데-git이-추적-중--내용-결함)).

## 테스트와 빌드

- `npm test`는 현재 **실행되지 않는다** — CRA 스텁 테스트가 react-router-dom v7을 해석하지 못해 스위트 자체가 FAIL이다 ([FKI-01](KNOWN-ISSUES.md#fki-01-npm-test가-실행조차-되지-않음)).
- `npm run build`는 성공하지만 ESLint 경고 4건과 함께 컴파일되며, CI에서는 경고가 에러로 승격되기 때문에 배포 워크플로가 `CI=false`로 빌드한다 ([FKI-03](KNOWN-ISSUES.md#fki-03-ci-빌드가-cifalse와---legacy-peer-deps에-의존)).
- 배포는 main 푸시 시 GitHub Actions가 빌드 후 S3 + CloudFront에 올린다 (`.github/workflows/deploy.yml`).

## 코드 좌표

| 개념 | 위치 |
|---|---|
| dev 프록시 대상 | `package.json · proxy` |
| start/build/test 스크립트 | `package.json · scripts` (react-app-rewired) |
| CRA 오버라이드 | `config-overrides.js · override` |
| axios baseURL 주입 | `src/index.js` |
| WS 주소 하드코딩 | `src/contexts/WebSocketContext.jsx · WS_URL` |
| CI 빌드·배포 | `.github/workflows/deploy.yml · deploy` |

## 알려진 문제·미확인 사항

- [FKI-01](KNOWN-ISSUES.md#fki-01-npm-test가-실행조차-되지-않음) npm test 실행 불가
- [FKI-03](KNOWN-ISSUES.md#fki-03-ci-빌드가-cifalse와---legacy-peer-deps에-의존) CI=false·--legacy-peer-deps 의존
- [FKI-09](KNOWN-ISSUES.md#fki-09-env가-gitignore에-있는데-git이-추적-중--내용-결함) .env 추적 상태와 죽은 값
- `[미확인: 플레인 npm ci의 성패 — npm install --dry-run의 ERESOLVE 실패로 미루어 실패로 추정되나, 로컬 node_modules를 지우면서까지 실측하지 않음]`
- `[미확인: 로컬에서 소셜 로그인 리다이렉트 동작 — 백엔드 OAuth 설정(frontend-url)에 의존]`

마지막 검증일: 2026-07-30
