# HighTeenDay Frontend — 문서 인덱스

신입 개발자가 혼자 읽고 프론트엔드 전체를 이해하는 것을 목표로 하는 온보딩 문서 체계다.
[백엔드 문서 체계](../../highteenday-backend/docs/INDEX.md)와 같은 규칙을 따른다:
모든 서술은 실제 코드를 읽고 검증한 것만 담고, 확인하지 못한 것은 `[미확인]`으로 표시하며,
결함은 본문에 쓰지 않고 [KNOWN-ISSUES.md](KNOWN-ISSUES.md)(FKI-nn)에만 기록한다.

## 권장 읽기 순서

| 순서 | 문서 | 얻는 것 |
|---|---|---|
| 1 | [00-quickstart.md](00-quickstart.md) | npm ci부터 npm start까지, .env 3종과 프록시, 백엔드 선행 기동 |
| 2 | [architecture.md](architecture.md) | 라우팅 전수, Context 4종, API 호출·스타일링·폼 검증 현황 |
| 3 | [auth-websocket.md](auth-websocket.md) | 401 토큰 갱신 인터셉터, WebSocket 선제 갱신·재연결, 채팅 구독 설계 — 이 저장소의 핵심 자산 |
| 4 | [KNOWN-ISSUES.md](KNOWN-ISSUES.md) | 확인된 결함 10건 — 손대기 전에 반드시 훑을 것 |

백엔드를 처음 접한다면 [백엔드 00-quickstart.md](../../highteenday-backend/docs/00-quickstart.md)를 먼저 끝내는 것이 좋다 — 프론트는 백엔드가 8080에 떠 있어야 의미 있게 돈다.

## 백엔드 문서와의 짝

| 프론트 문서 | 맞물리는 백엔드 문서 |
|---|---|
| 00-quickstart.md | [백엔드 00-quickstart.md](../../highteenday-backend/docs/00-quickstart.md) — 서버 기동·시드 계정 |
| auth-websocket.md | [백엔드 04-request-flow.md](../../highteenday-backend/docs/04-request-flow.md) — 요청·WebSocket이 서버를 통과하는 구간 |
| KNOWN-ISSUES.md (FKI-nn) | [백엔드 KNOWN-ISSUES.md](../../highteenday-backend/docs/KNOWN-ISSUES.md) (KI-nn) |
| [GROUP_CHAT.md](GROUP_CHAT.md) (기존 문서) | 백엔드 `docs/domains/chat.md` (Phase 3 예정) — 그때까지는 백엔드 `docs/GROUP_CHAT.md` |

## 문서 체계 규칙

- 코드 좌표는 `파일경로 · 컴포넌트/함수명` 형식이며 행 번호는 쓰지 않는다.
- 같은 사실은 한 문서에만 있고 다른 문서는 링크한다. 결함의 단일 출처는 [KNOWN-ISSUES.md](KNOWN-ISSUES.md)다.
- 각 문서 하단의 "마지막 검증일"은 서술을 실제 코드와 대조한 날짜다.
- 기존 문서 [GROUP_CHAT.md](GROUP_CHAT.md)(단체 채팅 도입 시 변경 기록)는 보존하며, 상단에 현행 문서로의 안내만 추가되어 있다.

마지막 검증일: 2026-07-30
