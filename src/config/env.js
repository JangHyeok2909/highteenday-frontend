/**
 * 실행 환경별 설정을 읽는 단일 지점.
 *
 * 값은 env/.env.<local|dev|prod> 에서 오고, scripts/with-env.js 가 실행 시점에
 * 골라 심는다. 빌드 때 CRA(DefinePlugin)가 문자열로 인라인하므로 런타임에는
 * 바뀌지 않는다. 새 환경 변수가 필요하면 여기에 추가하고, 컴포넌트에서
 * process.env 를 직접 읽지 않는다.
 */

/** 'local' | 'dev' | 'prod' */
export const APP_ENV = process.env.REACT_APP_ENV || 'local';

/**
 * axios baseURL.
 * local 에서는 빈 문자열이라 요청이 상대 경로로 나가고 package.json 의 proxy 가
 * 백엔드로 중계한다. dev/prod 는 절대 주소다.
 */
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

/**
 * 백엔드 절대 origin.
 * 브라우저가 백엔드로 직접 페이지 이동을 해야 하는 OAuth 리다이렉트에 쓴다.
 * CRA proxy 는 Accept: text/html 요청을 중계하지 않으므로 상대 경로로는 안 된다.
 */
export const SERVER_ORIGIN = process.env.REACT_APP_SERVER_ORIGIN || '';

/** SockJS 접속 주소. proxy·CDN 을 타지 않으므로 모든 환경에서 절대 주소다. */
export const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8080/ws';

export const isLocal = APP_ENV === 'local';
export const isDev = APP_ENV === 'dev';
export const isProd = APP_ENV === 'prod';
