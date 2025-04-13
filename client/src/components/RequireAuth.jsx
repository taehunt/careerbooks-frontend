import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    // 로그인하지 않은 경우 로그인 페이지로 리디렉트
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireAuth;
