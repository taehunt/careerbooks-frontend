import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;
const API = import.meta.env.VITE_API_BASE_URL;
const UPLOADS = import.meta.env.VITE_UPLOADS_URL;

// 썸네일 전용 컴포넌트
function BookThumbnail({ book }) {
  const [thumbSrc, setThumbSrc] = useState(`${UPLOADS}/${book.slug}_sum.png`);

  useEffect(() => {
    const img = new Image();
    img.src = `${UPLOADS}/${book.slug}_sum.png`;
    img.onload = () => setThumbSrc(img.src);
    img.onerror = () => setThumbSrc(`${UPLOADS}/${book.slug}_sum.gif`);
  }, [book.slug]);

  return (
    <img
      src={thumbSrc}
      alt={`${book.title} 썸네일`}
      className="w-full h-44 object-cover rounded-t-2xl"
    />
  );
}

export default function BookList() {
  const [books, setBooks] = useState([]);
  const location = useLocation();

  const categoryLabels = {
    frontend: "프론트엔드 개발",
    backend: "백엔드 개발",
    planning: "웹기획",
    planner: "웹기획",
    design: "웹디자인",
  };

  const getCategoryFromURL = () => {
    const params = new URLSearchParams(location.search);
    return params.get("category");
  };

  const category = getCategoryFromURL();

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);

    axios
      .get(`${API}/api/books?${params.toString()}`)
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("도서 목록 불러오기 실패:", err));
  }, [category]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      {/* 상단 경로 */}
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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <div
              key={book.slug}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-100"
            >
              <BookThumbnail book={book} /> {/* ✅ 썸네일 컴포넌트 사용 */}

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-blue-600 line-clamp-2">
                    {book.titleIndex}. {book.title}
                  </h2>
                  {book.titleIndex === 0 && (
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                      무료
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 h-10 line-clamp-2">
                  {book.description}
                </p>

                <div className="text-lg font-bold text-blue-600">
                  {book.originalPrice && book.originalPrice > book.price ? (
                    <>
                      <span className="line-through text-gray-400 mr-2 text-base">
                        {book.originalPrice.toLocaleString()}원
                      </span>
                      <span className="text-red-600 font-bold">
                        {book.price.toLocaleString()}원
                      </span>
                      <span className="ml-2 text-sm text-green-600">
                        ({Math.round(
                          ((book.originalPrice - book.price) / book.originalPrice) * 100
                        )}% 할인)
                      </span>
                    </>
                  ) : (
                    <>{book.price.toLocaleString()}원</>
                  )}
                </div>

                <Link
                  to={`/books/${book.slug}`}
                  className="block w-full text-center mt-4 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                >
                  자세히 보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
