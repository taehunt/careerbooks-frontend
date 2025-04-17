import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 1️⃣ 관리자 우선 확인 (sessionStorage)
    const adminData = sessionStorage.getItem('user');
    if (adminData) {
      setUser(JSON.parse(adminData));
      return;
    }

    // 2️⃣ 일반 사용자 확인 (localStorage)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
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
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
