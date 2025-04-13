// client/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import logo from "../images/logo.png";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();          // 로그인 정보 초기화
    navigate('/');     // 홈으로 이동
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold text-blue-600">
        <Link to="/"><img src={logo} alr="로고" className='h-10'/></Link>
      </div>
      <div className="space-x-4 text-sm">
        <Link to="/" className="hover:text-blue-500 navMenu">홈</Link>
        <Link to="/books" className="hover:text-blue-500 navMenu">전자책</Link>
        {user ? (
          <>
            <Link to="/mybooks" className="hover:text-blue-500 navMenu">구매정보</Link>
            <button onClick={handleLogout} className="text-red-500 hover:underline navMenu">로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-blue-500 navMenu">로그인</Link>
            <Link to="/signup" className="hover:text-blue-500 navMenu">회원가입</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
