// 파일 경로: root/client/src/pages/BookList.jsx

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;  // ★ 추가된 부분

const API = import.meta.env.VITE_API_BASE_URL;

function BookList() {
  const [books, setBooks] = useState([]);
  const location = useLocation();

  const categoryLabels = {
    frontend: "프론트엔드 개발",
    backend: "백엔드 개발",
    planning: "웹기획",   // Admin 쪽 value="planning" 대응
    planner: "웹기획",    // Home 쪽 value="planner" 대응
    design: "웹디자인",
  };

  const getCategoryFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get("category");
  };

  const category = getCategoryFromURL();

  useEffect(() => {
    const url = category
      ? `${API}/api/books?category=${category}`
      : `${API}/api/books`;

    axios
      .get(url)
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("도서 목록 불러오기 실패:", err));
  }, [category]);

  return (
    <div className="space-y-8">
      {/* ✅ 상단 경로 라벨 (링크 포함) */}
      <div className="text-sm text-blue-600 mb-4 space-x-1">
        <Link to="/" className="hover:underline">홈</Link>
        <span>&gt;</span>
        <Link to="/books" className="hover:underline">전자책 목록</Link>
        {category && (
          <>
            <span>&gt;</span>
            <Link to={`/books?category=${category}`} className="hover:underline">
              {categoryLabels[category] || category}
            </Link>
          </>
        )}
      </div>

      <h1 className="text-3xl font-bold text-gray-800">전자책 목록</h1>
      {books.length === 0 ? (
        <p className="text-gray-500">등록된 전자책이 없습니다.</p>
      ) : (
        books.map((book) => (
          <div
            key={book.slug}
            className="bg-white shadow rounded-lg p-6 transition hover:shadow-lg hover:-translate-y-1"
          >
            <h2 className="text-xl font-semibold text-blue-600">
              {book.titleIndex}. {book.title}
            </h2>
            <p className="text-gray-700 mt-2">{book.description}</p>

            {/* 가격 표시 영역 */}
            <p className="font-semibold text-blue-600 mb-6 text-lg">
              {book.originalPrice && book.originalPrice > book.price ? (
                <>
                  <span className="line-through text-gray-400 mr-2 text-base">
                    {book.originalPrice.toLocaleString()}원
                  </span>
                  <span className="text-red-600 font-bold">
                    {book.price.toLocaleString()}원
                  </span>
                  <span className="ml-2 text-sm text-green-600">
                    (
                    {Math.round(
                      ((book.originalPrice - book.price) / book.originalPrice) * 100
                    )}
                    % 할인)
                  </span>
                </>
              ) : (
                <>{book.price.toLocaleString()}원</>
              )}
            </p>

            <Link
              to={`/books/${book.slug}`}
              className="inline-block mt-4 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
            >
              자세히 보기
            </Link>
          </div>
        ))
      )}
    </div>
  );
}

export default BookList;
