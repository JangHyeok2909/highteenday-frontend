import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

export interface User {
    name: string,
    nickname: string,
    email: string,
    profileUrl: string,
    userClass: number,
    userGrade: number,
    phoneNum: string,
    schoolName: string,
    provider: "LOCAL" | "GOOGLE" | "KAKAO" | "NAVER" | string;
  }
// 위에 값은 변경 가능 

type AuthContextType = {
  user: User | null;
  isLogin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>; 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate(); 
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      await axios.post("/api/user/login", {
         email: email, password: password 
        }, {
           withCredentials: true 
        }
      );
      await refresh();           
      navigate("/");      
  
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        console.error("Axios error", status, err.response?.data);
  
        if (status === 401) {
          alert("아이디 또는 비밀번호가 올바르지 않습니다.");
        } else {
          alert(`서버 오류 또는 네트워크 오류 (status: ${status ?? "네트워크"})`);
        }
      } else {
        console.error(err);
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/user/logout", {
        withCredentials: true,
      });      
    } catch (err) {
      console.log("로그아웃 실패", err);
    } finally {
      console.log("로그아웃 성공");
      setUser(null);
      window.location.reload();
    }
  }

  const refresh = async () => {
    try {
      const { data } = await axios.get<User>('/api/user/userInfo', {
        withCredentials: true
      });
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <AuthContext.Provider 
      value={{user, isLogin: !!user, login, logout, refresh}}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider 안에서만 사용 가능합니다.');
  return ctx;
}