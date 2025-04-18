import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false); // ✅ 인증 완료 여부 상태 추가

  useEffect(() => {
    // ✅ 관리자 우선 확인 (sessionStorage)
    const adminData = sessionStorage.getItem('user');
    if (adminData) {
      setUser(JSON.parse(adminData));
      setIsAuthChecked(true);
      return;
    }

    // ✅ 일반 사용자 확인 (localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setIsAuthChecked(true); // ✅ 인증 확인 완료 표시
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    if (userData.role === 'admin') {
      sessionStorage.setItem('user', JSON.stringify(userData));
      sessionStorage.setItem('token', token);
    } else {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.clear();
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, isAuthChecked }}
    >
      {children}
    </AuthContext.Provider>
  );
}
