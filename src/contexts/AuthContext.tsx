import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect
} from 'react';
import axios from 'axios';

export interface User {
  name: string;
  nickname: string;
  email: string;
  profileUrl: string;
  userClass: number;
  userGrade: number;
  phoneNum: string;
  schoolName: string;
  provider: 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'NAVER' | string;
}

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  login: (u: User) => void;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (u: User) => setUser(u);

  const logout = async () => {
    try {
      await axios.get('/api/user/logout', {
        withCredentials: true
      });
    } finally {
      setUser(null);
    }
  };

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
      value={{ user, isLoggedIn: !!user, login, logout, refresh }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider 안에서만 사용 가능합니다.');
  return ctx;
}
