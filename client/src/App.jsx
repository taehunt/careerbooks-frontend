// 파일 경로: root/client/src/App.jsx

import axios from "axios";
axios.defaults.withCredentials = true;

import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// 일반 페이지
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyBooks from "./pages/MyBooks";
import BookDetail from "./pages/BookDetail";
import BookList from "./pages/BookList";
import BookCategories from "./pages/BookCategories";
import PaymentSuccess from "./pages/PaymentSuccess";
import TransferConfirm from "./pages/TransferConfirm";

// 관리자 페이지
import Admin from "./pages/admin";
import EditBookDescription from "./pages/admin/EditBookDescription";

// 컴포넌트
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import RedirectIfAuth from "./components/RedirectIfAuth";
import AdminRoute from "./components/AdminRoute";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer";

function App() {
  const { isAuthChecked } = useContext(AuthContext);

  if (!isAuthChecked) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        인증 확인 중...
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="mx-auto px-4 py-10 min-h-screen bg-gray-100 text-gray-800 font-sans">
        <Routes>
          {/* 일반 유저 접근 */}
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/categories" element={<BookCategories />} />
          <Route path="/books/:slug" element={<BookDetail />} />

          {/* 인증 필요 */}
          <Route
            path="/my-books"
            element={
              <RequireAuth>
                <MyBooks />
              </RequireAuth>
            }
          />

          {/* 인증 시 접근 불가 */}
          <Route
            path="/login"
            element={
              <RedirectIfAuth>
                <Login />
              </RedirectIfAuth>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectIfAuth>
                <Signup />
              </RedirectIfAuth>
            }
          />

          <Route path="/payment/success" element={<PaymentSuccess />} />
		  <Route path="/transfer-confirm" element={<TransferConfirm />} />

          {/* 관리자 전용 라우트 */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books/edit"
            element={
              <AdminRoute>
                <EditBookDescription />
              </AdminRoute>
            }
          />
          {/* 없는 경로는 홈으로 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
	  <Footer />
    </>
  );
}

export default App;
