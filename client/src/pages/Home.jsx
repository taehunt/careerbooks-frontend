// 파일 경로: root/client/src/pages/Home.jsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import MainSlider from "../components/MainSlider";

axios.defaults.withCredentials = true;

const API = import.meta.env.VITE_API_BASE_URL;
const UPLOADS = import.meta.env.VITE_UPLOADS_URL;

// 🔥 추가: 썸네일 전용 컴포넌트
function BookThumbnail({ book }) {
  const [thumbSrc, setThumbSrc] = useState(`${UPLOADS}/${book.slug}_sum.png`);

  useEffect(() => {
    const img = new Image();
    img.src = `${UPLOADS}/${book.slug}_sum.png`;
    img.onload = () => setThumbSrc(img.src); // png 존재하면 사용
    img.onerror = () => setThumbSrc(`${UPLOADS}/${book.slug}_sum.gif`); // 없으면 gif로 fallback
  }, [book.slug]);

  return (
    <img
      src={thumbSrc}
	  loading="lazy"
      alt={`${book.title} 미리보기`}
      className="w-full h-48 object-cover rounded-md mb-4 transition duration-300 hover:brightness-105"
    />
  );
}

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
      {/* ✅ 랜딩 헤드라인 */}
      <div className="bg-blue-50 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          비전공자도 가능한 실전 웹 개발 전자책
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          개발 1도 몰라도 OK! 따라만 하면 포트폴리오 완성까지<br className="hidden sm:inline" />
          커리어 전환, 이직, 사이드 프로젝트까지 한 번에!
        </p>
        <Link
          to="/books"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition transform hover:scale-105"
        >
          전자책 둘러보기
        </Link>
      </div>

      {/* ✅ 메인 슬라이드 영역 */}
      <MainSlider />

      {/* 🔥 광고 유입용 CTA 배너 */}
      <div className="bg-yellow-100 border border-yellow-300 text-center text-sm text-gray-800 px-4 py-3 rounded-md shadow mt-6 mx-4 max-w-6xl mx-auto">
        🎯 <span className="font-semibold text-red-600">총집합 패키지 50% 할인 중!</span> 생초보도 홈페이지 개발 OK! 지금 시작해보세요.
      </div>

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
              {/* ✅ 썸네일 교체 */}
              <BookThumbnail book={book} />

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

      {/* ✅ 무료 전자책 섹션 (PC/모바일용) */}
      <div className="hidden md:block bg-white border rounded-xl shadow p-6 text-center hover:shadow-lg transition">
        <p className="text-lg text-gray-700 mb-4">
          프론트엔드 개발 비전공자를 위한 입문서! 아래 버튼을 눌러 무료 전자책을 받아보세요.
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
