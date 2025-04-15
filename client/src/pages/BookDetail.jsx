import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;
const UPLOADS = import.meta.env.VITE_UPLOADS_URL;

function BookDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setNotFound(false);
    axios
      .get(`${API}/api/books/${slug}`)
      .then((res) => setBook(res.data))
      .catch((err) => {
        console.error("책 정보 불러오기 실패", err);
        setNotFound(true);
      });
  }, [slug]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setHasAccess(false);
      return;
    }
    axios
      .get(`${API}/api/books/${slug}/access`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHasAccess(res.data.allowed))
      .catch((err) => {
        console.error(err);
        setHasAccess(false);
      });
  }, [slug]);

  const handleDownload = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      const response = await fetch(`${API}/api/downloads/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("다운로드 실패");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = book.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("다운로드 오류");
      console.error(err);
    }
  };

  const handlePurchase = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `${API}/api/books/${slug}/purchase`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("구매 완료");
      setHasAccess(true);
    } catch (err) {
      alert("구매 오류");
      console.error(err);
    }
  };

  const categoryLabels = {
    frontend: "프론트엔드 개발",
    backend: "백엔드 개발",
    planner: "웹기획",
    designer: "웹디자인",
  };

  return (
    <div className="max-w-3xl mx-auto">
      {notFound ? (
        <p className="text-center mt-10 text-red-500 font-semibold">
          존재하지 않는 책입니다.
        </p>
      ) : book ? (
        <>
          <div className="text-sm text-blue-600 mb-2 space-x-1">
            <Link to="/" className="hover:underline">홈</Link>
            <span>&gt;</span>
            <Link to="/books" className="hover:underline">전자책 목록</Link>
            <span>&gt;</span>
            <Link to={`/books?category=${book.category}`} className="hover:underline">
              {categoryLabels[book.category] || book.category}
            </Link>
          </div>

          <div className="mt-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
              📘 {book.titleIndex}. {book.title}
            </h2>
            <p className="text-gray-600 text-lg mb-2">{book.description}</p>
            <div className="text-xl font-semibold text-blue-600 mb-4">
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
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-blue-500 pl-4">
              💡 서비스 설명
            </h3>
            <div className="text-gray-700 leading-relaxed">
              <p>📌 이런 분들에게 꼭 추천드립니다</p>
              <ul className="list-disc list-inside my-4">
                <li>비전공자지만 웹 개발을 시작하고 싶은 분</li>
                <li>실전 프로젝트로 포트폴리오를 만들고 싶은 분</li>
                <li>HTML, CSS, React, Express, MongoDB까지 실제 서비스 흐름을 익히고 싶은 분</li>
                <li>이직, 부업, 창업 등 실용적인 웹 제작 경험이 필요한 분</li>
              </ul>
              <p>
                이 전자책은 단순한 이론서가 아닙니다.
                <br />
                실전 중심으로 구성되어 있어 실제 서비스처럼 기획하고, 만들고,
                배포할 수 있는 방법을 알려드립니다.
                <br />
                지금 시작하지 않으면, 내일도 똑같은 자리에 머물러 있을지도
                모릅니다.
              </p>
              <p className="mt-4 font-bold text-blue-600">이 기회를 잡아보세요!</p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-green-500 pl-4 flex justify-between items-center">
              <span>📖 미리보기 이미지</span>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showPreview ? "닫기 ▲" : "열기 ▼"}
              </button>
            </h3>

            <div
              className={`grid gap-4 transition-all duration-500 overflow-hidden ${
                showPreview ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {Array.from({ length: 5 }).map((_, idx) => (
                <img
                  key={idx}
                  src={`${UPLOADS}/${slug}_preview0${idx + 1}.png`}
                  alt={`미리보기 ${idx + 1}`}
                  className="w-full border rounded shadow hover:shadow-lg transition"
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            {hasAccess ? (
              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
              >
                다운로드
              </button>
            ) : (
              <button
                onClick={handlePurchase}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
              >
                구매하기
              </button>
            )}
          </div>
        </>
      ) : (
        <p className="text-center mt-10">책 정보를 불러오는 중입니다...</p>
      )}
    </div>
  );
}

export default BookDetail;
