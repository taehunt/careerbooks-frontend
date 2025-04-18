// 파일 경로: root/client/src/pages/MyBooks.jsx

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

axios.defaults.withCredentials = true;  // ★ 추가된 부분

const API = import.meta.env.VITE_API_BASE_URL;

function MyBooks() {
  const navigate = useNavigate();
  const { user, logout, isAuthChecked } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthChecked) return;

    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");

    if (!token || !user) {
      logout();
      navigate("/login");
      return;
    }

    axios
      .get(`${API}/api/books/my-books`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (!Array.isArray(res.data)) {
          throw new Error("받은 데이터 형식이 잘못되었습니다.");
        }
        setBooks(res.data);
      })
      .catch((err) => {
        console.error("내 책 가져오기 오류:", err.message);
        setError("내 책을 불러오는 중 오류가 발생했습니다.");
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

  const handleDownload = async (slug) => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    try {
      const response = await axios.get(`${API}/api/downloads/${slug}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${slug}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("다운로드 실패");
    }
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
