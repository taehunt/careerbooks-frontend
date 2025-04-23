// 파일 경로: root/client/src/pages/Home.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MainSlider from "../components/MainSlider";

axios.defaults.withCredentials = true;

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
    <div className="bg-white text-gray-800">

      {/* ✅ Hero 헤드라인 영역 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 py-24 px-6 text-center">
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-600 mb-4">
            비전공자도 가능한 실전 웹 개발 전자책
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-8">
            개발 1도 몰라도 OK! 따라만 하면 포트폴리오 완성까지<br className="hidden sm:block" />
            커리어 전환, 이직, 사이드 프로젝트까지 한 번에!
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/books"
              className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-blue-700 transition"
            >
              전자책 둘러보기
            </Link>
            <a
              href={`${API}/api/downloads/frontend00`}
              className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition"
            >
              무료 전자책 받기
            </a>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full opacity-30 animate-pulse blur-3xl"></div>
      </div>

      {/* ✅ 슬라이더 */}
      <MainSlider />

      {/* ✅ 할인 CTA 배너 */}
      <div className="bg-yellow-100 border border-yellow-300 text-center text-sm text-gray-800 px-4 py-3 rounded-md shadow mt-6 mx-4 max-w-6xl mx-auto">
        🎯 <span className="font-semibold text-red-600">총집합 패키지 50% 할인 중!</span> 생초보도 홈페이지 개발 OK! 지금 시작해보세요.
      </div>

      {/* ✅ 인기 전자책 섹션 */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">🔥 지금 인기있는 전자책</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {popularBooks.map((book, index) => (
            <div
              key={book.slug}
              className="bg-white border rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1"
            >
              <img
                src={`${UPLOADS}/${book.slug}_preview01.png`}
                alt={`${book.title} 미리보기`}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-blue-700">
                  {index + 1}. {book.title}
                </h3>
                <p className="text-sm text-gray-600">{book.description}</p>
                <p className="font-semibold text-blue-600 text-lg">
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
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  자세히 보기
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ 전자책 카테고리 */}
      <section className="bg-gray-50 py-20 px-6">
        <h2 className="text-2xl font-bold text-center mb-8">📂 전자책 카테고리</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { label: "웹기획", value: "planner" },
            { label: "웹디자인", value: "designer" },
            { label: "프론트엔드 개발자", value: "frontend" },
            { label: "백엔드 개발자", value: "backend" },
          ].map((category) => (
            <Link
              key={category.value}
              to={`/books?category=${category.value}`}
              className="bg-white border border-blue-200 px-5 py-2 rounded-full shadow-sm text-sm text-gray-700 hover:bg-blue-100 transition"
            >
              #{category.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ✅ 무료 전자책 CTA (PC) */}
      <div className="hidden md:block bg-white max-w-4xl mx-auto rounded-xl shadow p-8 text-center">
        <p className="text-lg text-gray-700 mb-4">
          프론트엔드 개발 비전공자를 위한 입문서! 지금 무료로 받아보세요.
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
          className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          무료 전자책 받기
        </button>
      </div>

      {/* ✅ 무료 전자책 CTA (모바일) */}
      <div className="block md:hidden bg-white border rounded-xl shadow p-4 text-center mt-6 mx-4">
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
          className="w-full bg-green-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          무료 전자책 받기
        </button>
      </div>

      {/* ✅ 마지막 CTA */}
      <div className="bg-blue-50 py-20 px-6 text-center mt-16">
        <h2 className="text-2xl font-bold mb-3">🚀 비전공자도 가능한 실전 개발 스킬</h2>
        <p className="text-gray-600 mb-6">
          커리어 전환, 사이드 프로젝트, 이직까지 CareerBooks에서 시작하세요.
        </p>
        <Link
          to="/books"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          전자책 둘러보기
        </Link>
      </div>
    </div>
  );
}

export default Home;
