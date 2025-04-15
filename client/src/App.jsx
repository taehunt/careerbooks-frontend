import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// 일반 페이지
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyBooks from "./pages/MyBooks";
import BookDetail from "./pages/BookDetail";
import BookList from "./pages/BookList";

// 기타 컴포넌트
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import RedirectIfAuth from "./components/RedirectIfAuth";
import RequirePurchase from "./components/RequirePurchase";
import PaymentSuccess from "./pages/PaymentSuccess";

// 관리자 페이지 (관리자만 접근)
import Admin from "./pages/Admin";

function App() {
  const { user } = useContext(AuthContext);

  // ✅ 관리자 보호 라우트
  const AdminRoute = ({ children }) => {
    if (!user || user.role !== "admin") {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <Navbar />
      <main className="mx-auto px-4 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BookList />} />
          <Route path="/books/:slug" element={<BookDetail />} />
          <Route
            path="/mybooks"
            element={
              <RequireAuth>
                <MyBooks />
              </RequireAuth>
            }
          />
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

          <Route
            path="/books/:slug"
            element={
              <RequirePurchase>
                <BookDetail />
              </RequirePurchase>
            }
          />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          {/* ✅ 관리자 페이지 보호 */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
