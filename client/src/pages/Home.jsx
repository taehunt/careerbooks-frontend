// 파일 경로: root/client/src/pages/Home.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MainSlider from "../components/MainSlider";

axios.defaults.withCredentials = true;  // ★ 추가된 부분

const API = import.meta.env.VITE_API_BASE_URL;
const UPLOADS = import.meta.env.VITE_UPLOADS_URL;

function Home() {
  const [books, setBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/api/books/popular`)
      .then((res) => setPopularBooks(res.data))
      .catch((err) => console.error("인기 도서 불러오기 실패:", err));
  }, []);

  useEffect(() => {
    axios
      .get(`${API}/api/books`)
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("도서 목록 불러오기 실패:", err));
  }, []);

  return (
    <div className="bg-white">
      {/* ✅ 메인 슬라이드 영역 */}
      <MainSlider />

      {/* 인기 전자책 섹션 */}
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          🔥 지금 인기있는 전자책
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularBooks.map((book, index) => (
            <div
              key={book.slug}
              className="border rounded-xl p-6 shadow hover:shadow-xl transition transform hover:-translate-y-1 bg-white"
            >
              <img
                src={`${UPLOADS}/${book.slug}_preview01.png`}
                alt={`${book.title} 미리보기`}
                className="w-full h-48 object-cover rounded-md mb-4 transition duration-300 hover:brightness-105"
              />
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                {index + 1}. {book.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{book.description}</p>
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
                        ((book.originalPrice - book.price) /
                          book.originalPrice) *
                          100
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
                className="inline-block text-sm text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
              >
                자세히 보기
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ 전자책 카테고리 분류 */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          📂 전자책 카테고리
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { label: "웹기획", value: "planner" },
            { label: "웹디자인", value: "designer" },
            { label: "프론트엔드 개발자", value: "frontend" },
            { label: "백엔드 개발자", value: "backend" },
          ].map((category) => (
            <Link
              key={category.value}
              to={`/books?category=${category.value}`}
              className="bg-white px-4 py-2 border rounded-full shadow text-sm font-medium text-gray-700 hover:bg-blue-100 transition transform hover:scale-105"
            >
              #{category.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ✅ 무료 전자책 섹션 (PC용) */}
      <div className="hidden md:block bg-white border rounded-xl shadow p-6 text-center hover:shadow-lg transition">
        <p className="text-lg text-gray-700 mb-4">
          프론트엔드 개발 비전공자를 위한 입문서! 아래 버튼을 눌러 무료 전자책을
          받아보세요.
        </p>
        <button
          onClick={() => {
            const a = document.createElement("a");
            a.href = `${API}/api/downloads/frontend00`;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
          className="inline-block text-white bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition transform hover:scale-105"
        >
          무료 전자책 받기
        </button>
      </div>

      {/* ✅ 무료 전자책 섹션 (모바일용) */}
      <div className="block md:hidden bg-white border rounded-xl shadow p-4 text-center hover:shadow-lg transition">
        <button
          onClick={() => {
            const a = document.createElement("a");
            a.href = `${API}/api/downloads/frontend00`;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }}
          className="w-full text-white bg-green-500 hover:bg-green-600 px-4 py-3 rounded-lg font-semibold transition"
        >
          무료 전자책 받기
        </button>
      </div>

      {/* ✅ CTA 영역 */}
      <div className="bg-blue-50 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🚀 비전공자도 가능한 실전 개발 스킬
        </h2>
        <p className="text-gray-600 mb-6">
          커리어 전환, 사이드 프로젝트, 이직까지 CareerBooks에서 시작하세요.
        </p>
        <Link
          to="/books"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition transform hover:scale-105"
        >
          전자책 둘러보기
        </Link>
      </div>
    </div>
  );
}

export default Home;
