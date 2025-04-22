// 파일 경로: root/client/src/components/Navbar.jsx

import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../images/logo.png";

axios.defaults.withCredentials = true;

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [ebookOpen, setEbookOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 relative z-50">
      <div className="flex justify-between items-center">
        <Link to="/">
          <img src={logo} alt="로고" className="h-10" />
        </Link>

        {/* 햄버거 버튼 */}
        <button
          className="lg:hidden block text-gray-600 focus:outline-none z-50"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* 데스크탑 메뉴 */}
        <div className="hidden lg:flex lg:items-center space-x-4 text-sm">
          <Link to="/" className="hover:text-blue-500 navMenu block py-2">
            홈
          </Link>

          <Link to="/about" className="hover:text-blue-500 navMenu block py-2">
            소개
          </Link>

          {/* 전자책 hover 드롭다운 */}
          <div className="relative group">
            <div className="hover:text-blue-500 navMenu block py-2 cursor-pointer">
              전자책
            </div>
            <div className="absolute left-0 mt-0 w-48 bg-white border rounded shadow-lg z-10 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity duration-200">
              <Link
                to="/books?category=planning"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                웹기획
              </Link>
              <Link
                to="/books?category=design"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                웹디자인
              </Link>
              <Link
                to="/books?category=frontend"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                프론트엔드 개발
              </Link>
              <Link
                to="/books?category=backend"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                백엔드 개발
              </Link>
            </div>
          </div>

          {user ? (
            <>
              <Link
                to="/my-books"
                className="hover:text-blue-500 navMenu block py-2"
              >
                내 책보기
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="hover:text-blue-500 navMenu block py-2"
                >
                  관리자
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-red-500 hover:underline navMenu block py-2"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-500 navMenu block py-2"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="hover:text-blue-500 navMenu block py-2"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 모바일 전체 메뉴 */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setMenuOpen(false)}
          ></div>
          <div className="fixed top-0 right-0 w-3/4 h-full bg-white z-50 p-6 text-base space-y-4">
            <Link
              to="/"
              className="block py-2"
              onClick={() => setMenuOpen(false)}
            >
              홈
            </Link>

            <Link
              to="/about"
              className="block py-2"
              onClick={() => setMenuOpen(false)}
            >
              소개
            </Link>

            <div>
              <button
                onClick={() => setEbookOpen(!ebookOpen)}
                className="block w-full text-left py-2"
              >
                전자책
              </button>
              {ebookOpen && (
                <div className="ml-4 space-y-2">
                  <Link
                    to="/books?category=planning"
                    className="block"
                    onClick={() => setMenuOpen(false)}
                  >
                    웹기획
                  </Link>
                  <Link
                    to="/books?category=design"
                    className="block"
                    onClick={() => setMenuOpen(false)}
                  >
                    웹디자인
                  </Link>
                  <Link
                    to="/books?category=frontend"
                    className="block"
                    onClick={() => setMenuOpen(false)}
                  >
                    프론트엔드 개발
                  </Link>
                  <Link
                    to="/books?category=backend"
                    className="block"
                    onClick={() => setMenuOpen(false)}
                  >
                    백엔드 개발
                  </Link>
                </div>
              )}
            </div>

            {user ? (
              <>
                <Link
                  to="/my-books"
                  className="block py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  내 책
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    관리자
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="block py-2 text-red-500"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="block py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </nav>
  );
}

export default Navbar;
