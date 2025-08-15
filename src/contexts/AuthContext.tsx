import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from "axios";


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
  isLoggenIn: boolean;
  logout: () => Promise<void>;
  login: (u: User) => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (u: User) => setUser(u);
  const logout = async () => { 
    try {
      await axios.get("/api/user/logout", {
        withCredentials: true
      });
    } finally{
      setUser(null);
    }
  };

  const refresh = async () => {
    try {
      const { data } = await axios.get<User>("/api/user/userInfo", {
        withCredentials: true,
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
      value={{user, isLoggenIn: !!user, login, logout, refresh}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(){
  const ctx = useContext(AuthContext);
  if(!ctx) throw new Error("AuthProvider ㅇㅇ");
  return ctx;
}