import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
import { useAuth } from "./AuthContext";

const WebSocketContext = createContext(undefined);

const WS_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:8080/ws"
  : "/ws";

// 토큰 갱신을 재시도마다(5초) 하면 refresh 토큰 회전이 과하게 돈다. 실패가 이어지는 동안엔
// 이 간격으로만 갱신한다.
const TOKEN_REFRESH_INTERVAL_MS = 60_000;

export function WebSocketProvider({ children }) {
  const { isLogin } = useAuth();
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  // 직전 연결 시도가 끊겼는지, 마지막으로 토큰을 갱신한 시각
  const reconnectingRef = useRef(false);
  const lastRefreshAtRef = useRef(0);

  useEffect(() => {
    if (!isLogin) {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      setConnected(false);
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,

      // accessToken은 30분짜리인데 소켓은 그보다 오래 열려 있는다. 핸드셰이크
      // (WebSocketAuthInterceptor)는 쿠키가 없으면 빈 200으로 조용히 거절하므로
      // axios의 401 기반 갱신 인터셉터가 이 실패를 영영 알지 못한다.
      // 그래서 재연결 직전에 여기서 직접 토큰을 갱신한다.
      beforeConnect: async () => {
        if (!reconnectingRef.current) return;

        const now = Date.now();
        if (now - lastRefreshAtRef.current < TOKEN_REFRESH_INTERVAL_MS) return;
        lastRefreshAtRef.current = now;

        try {
          await axios.post("/api/token/refresh", {}, { withCredentials: true });
        } catch {
          // refresh 토큰까지 만료됨. 재로그인이 필요하며 재시도는 계속된다.
        }
      },

      onConnect: () => {
        reconnectingRef.current = false;
        setConnected(true);
      },
      // onDisconnect는 서버가 DISCONNECT를 정상 처리했을 때만 불린다.
      // 소켓이 끊기거나 핸드셰이크가 거절되면(만료된 accessToken 등) 이 콜백은 오지 않으므로,
      // 소켓 레벨 이벤트에서도 상태를 내려야 "연결됐다고 착각한 채 전송이 사라지는" 상황을 막는다.
      onDisconnect: () => setConnected(false),
      onWebSocketClose: () => {
        reconnectingRef.current = true;
        setConnected(false);
      },
      onWebSocketError: () => {
        reconnectingRef.current = true;
        setConnected(false);
      },
      onStompError: (frame) => {
        // STOMP ERROR 프레임을 받으면 규약상 서버가 연결을 닫는다.
        setConnected(false);
        console.error("STOMP error:", frame.headers["message"]);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
      setConnected(false);
    };
  }, [isLogin]);

  // clientRef만 읽으므로 재생성할 이유가 없다. 참조가 고정돼야 이 값을
  // effect 의존성에 넣은 화면들이 불필요하게 재구독하지 않는다.
  const subscribe = useCallback((destination, callback) => {
    const client = clientRef.current;
    if (!client || !client.connected) return null;
    return client.subscribe(destination, (message) => {
      callback(JSON.parse(message.body));
    });
  }, []);

  // 전송 성공 여부를 돌려준다. false면 호출한 쪽이 사용자에게 알릴 수 있다.
  const publish = useCallback((destination, body) => {
    const client = clientRef.current;
    if (!client || !client.connected) return false;
    client.publish({ destination, body: JSON.stringify(body) });
    return true;
  }, []);

  const value = useMemo(
    () => ({ connected, subscribe, publish }),
    [connected, subscribe, publish]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocket must be used inside WebSocketProvider");
  return ctx;
}
