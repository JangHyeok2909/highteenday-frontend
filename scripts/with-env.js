#!/usr/bin/env node
/**
 * 실행 환경(local | dev | prod)을 지정해 CRA를 띄우는 런처.
 *
 * 왜 필요한가:
 *   CRA(react-scripts)는 NODE_ENV(development / production / test) 값으로만 env 파일을
 *   고른다. 그래서 `.env.development`, `.env.production` 두 갈래밖에 표현할 수 없고
 *   local / dev / prod 3분기를 만들 수 없다.
 *
 * 어떻게 동작하는가:
 *   여기서 env/.env.<target> 을 먼저 읽어 자식 프로세스의 env 에 심어둔다.
 *   react-scripts/config/env.js 의 dotenv는 "이미 설정된 변수는 절대 덮지 않는다"는
 *   규칙을 지키므로, 여기서 심은 값이 항상 최종값이 된다.
 *
 * 우선순위 (앞이 강함):
 *   1. 실제 셸 환경변수 (CI에서 주입하는 값 등)
 *   2. env/.env.<target>.local   ← 개인 오버라이드, git 추적 안 함
 *   3. env/.env.<target>         ← 공용 설정, git 추적함
 *
 * 사용법:
 *   node scripts/with-env.js <local|dev|prod> <start|build|test> [추가 인자...]
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// dotenv는 react-scripts가 이미 의존하는 패키지다. 별도 설치 없이 쓸 수 있고,
// CRA가 env 파일을 읽을 때와 완전히 같은 파싱 규칙을 적용한다는 장점이 있다.
const dotenv = require('dotenv');

const TARGETS = ['local', 'dev', 'prod'];
const COMMANDS = ['start', 'build', 'test'];

const [target, command, ...passthrough] = process.argv.slice(2);

function fail(message) {
  console.error(`\n[with-env] ${message}\n`);
  console.error('사용법: node scripts/with-env.js <local|dev|prod> <start|build|test>\n');
  process.exit(1);
}

if (!TARGETS.includes(target)) {
  fail(`알 수 없는 실행 환경: ${target || '(없음)'} — ${TARGETS.join(' | ')} 중 하나여야 한다.`);
}
if (!COMMANDS.includes(command)) {
  fail(`알 수 없는 명령: ${command || '(없음)'} — ${COMMANDS.join(' | ')} 중 하나여야 한다.`);
}

const root = path.resolve(__dirname, '..');
const envDir = path.join(root, 'env');

// .local 을 먼저 읽어 공용 파일보다 우선권을 준다.
const envFiles = [
  path.join(envDir, `.env.${target}.local`),
  path.join(envDir, `.env.${target}`),
];

const env = { ...process.env };
const loaded = [];

for (const file of envFiles) {
  if (!fs.existsSync(file)) continue;
  const parsed = dotenv.parse(fs.readFileSync(file));
  for (const [key, value] of Object.entries(parsed)) {
    // 이미 값이 있으면 건너뛴다 → 위에 적은 우선순위가 그대로 지켜진다.
    if (env[key] === undefined) env[key] = value;
  }
  loaded.push(path.relative(root, file).replace(/\\/g, '/'));
}

if (loaded.length === 0) {
  // 설정 없이 조용히 실행되면 어느 백엔드를 보고 있는지 알 수 없어 디버깅이 어렵다.
  fail(`env 파일을 찾지 못했다: env/.env.${target}`);
}

// 앱 코드가 자기 실행 환경을 알 수 있게 한다 (src/config/env.js 에서 읽는다).
if (env.REACT_APP_ENV === undefined) env.REACT_APP_ENV = target;

console.log(`\n[with-env] env=${target}  command=${command}  files=${loaded.join(', ')}`);
console.log(`[with-env] API_BASE_URL=${env.REACT_APP_API_BASE_URL || '(빈 값 → CRA proxy 경유)'}`);
console.log(`[with-env] WS_URL=${env.REACT_APP_WS_URL || '(미설정)'}\n`);

// bin/react-app-rewired 대신 스크립트를 node로 직접 실행한다.
// Windows에서 .cmd 를 spawn 하려면 shell:true 가 필요해지는데(인자 인용 문제로 이어진다),
// 이렇게 하면 셸 없이 어느 플랫폼에서든 동일하게 동작한다.
const scriptPath = require.resolve(`react-app-rewired/scripts/${command}`);

const child = spawn(process.execPath, [scriptPath, ...passthrough], {
  stdio: 'inherit',
  cwd: root,
  env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code === null ? 1 : code);
});

child.on('error', (err) => {
  console.error(`[with-env] 실행 실패: ${err.message}`);
  process.exit(1);
});
