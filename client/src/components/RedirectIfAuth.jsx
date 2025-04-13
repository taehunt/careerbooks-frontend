// client/src/components/RedirectIfAuth.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function RedirectIfAuth({ children }) {
  const { user } = useContext(AuthContext);

  if (user) {
    // 이미 로그인된 상태라면 홈으로 리디렉트
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RedirectIfAuth;
