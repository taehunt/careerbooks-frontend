import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const API = import.meta.env.VITE_API_BASE_URL;

function MyBooks() {
  const navigate = useNavigate();
  const { user, logout, isAuthChecked } = useContext(AuthContext); // ✅ isAuthChecked 추가
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthChecked) return; // ✅ 인증 확인 전에는 대기

    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");

    // ✅ user 정보까지 체크해서 인증 만료 방지
    if (!token || !user) {
      logout();
      navigate("/login");
      return;
    }

    fetch(`${API}/api/books/my-books`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 403 || res.status === 401) {
          throw new Error("접근 권한이 없습니다. 다시 로그인해주세요.");
        }
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("받은 데이터 형식이 잘못되었습니다.");
        }
        setBooks(data);
      })
      .catch((err) => {
        console.error("내 책 가져오기 오류:", err.message);
        logout();
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
      });
  }, [navigate, logout, user, isAuthChecked]);

  const isDownloadable = (purchasedAt) => {
    const deadline = new Date(purchasedAt);
    deadline.setFullYear(deadline.getFullYear() + 1);
    return new Date() <= deadline;
  };

  const getRemainingDays = (purchasedAt) => {
    const deadline = new Date(purchasedAt);
    deadline.setFullYear(deadline.getFullYear() + 1);
    const diff = deadline - new Date();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const handleDownload = (slug) => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    const downloadUrl = `${API}/api/downloads/${slug}`;

    const a = document.createElement("a");
    a.href = downloadUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isAuthChecked) {
    return (
      <div className="text-center mt-10 text-gray-500">
        로그인 상태 확인 중입니다...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        📚 내가 구매한 전자책
      </h2>

      {error ? (
        <p className="text-center text-red-500 mb-4">{error}</p>
      ) : books.length === 0 ? (
        <p className="text-center text-gray-500">구매한 책이 없습니다.</p>
      ) : (
        <ul className="space-y-6">
          {books.map((book) => {
            if (!book.slug || !book.purchasedAt) return null;
            return (
              <li
                key={book.slug}
                className="bg-white border rounded-lg p-4 shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">{book.title}</h3>
                  <p className="text-sm text-gray-600">
                    구매일: {new Date(book.purchasedAt).toLocaleDateString()}
                    <br />
                    다운로드 가능일: 구매일로부터 1년
                    <br />
                    남은 기간: {getRemainingDays(book.purchasedAt)}일
                  </p>
                </div>
                <div>
                  {isDownloadable(book.purchasedAt) ? (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => handleDownload(book.slug)}
                    >
                      다운로드
                    </button>
                  ) : (
                    <button
                      className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                      disabled
                    >
                      다운로드 불가
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default MyBooks;
