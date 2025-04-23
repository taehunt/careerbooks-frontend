// 파일 경로: root/client/src/pages/BookDetail.jsx

import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { AuthContext } from "../context/AuthContext";

axios.defaults.withCredentials = true;

const API = import.meta.env.VITE_API_BASE_URL;
const UPLOADS = import.meta.env.VITE_UPLOADS_URL;

function BookDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { user, isAuthChecked } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activePreview, setActivePreview] = useState(null);

  useEffect(() => {
    setNotFound(false);
    axios
      .get(`${API}/api/books/${slug}`)
      .then((res) => setBook(res.data))
      .catch(() => setNotFound(true));
  }, [slug]);

  useEffect(() => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) {
      setHasAccess(false);
      return;
    }

    axios
      .get(`${API}/api/books/${slug}/access`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHasAccess(res.data.allowed))
      .catch(() => setHasAccess(false));
  }, [slug]);

  const handleDownload = async () => {
    try {
      const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");
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
    } catch (err) {
      alert("다운로드에 실패했습니다.");
    }
  };

  const categoryLabels = {
    frontend: "프론트엔드 개발",
    backend: "백엔드 개발",
    planner: "웹기획",
    designer: "웹디자인",
  };

  if (!isAuthChecked) {
    return (
      <div className="text-center mt-10 text-gray-500">
        로그인 상태 확인 중입니다...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 relative">
      {notFound ? (
        <p className="text-center mt-10 text-red-500 font-semibold">
          존재하지 않는 책입니다.
        </p>
      ) : book ? (
        <>
          <div>
            <div className="text-sm text-blue-600 mb-2 space-x-1">
              <Link to="/" className="hover:underline">
                홈
              </Link>
              <span>&gt;</span>
              <Link to="/books" className="hover:underline">
                전자책 목록
              </Link>
              <span>&gt;</span>
              <Link
                to={`/books?category=${book.category}`}
                className="hover:underline"
              >
                {categoryLabels[book.category] || book.category}
              </Link>
            </div>

            <div className="mt-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                📘 {book.titleIndex}. {book.title}
              </h2>
              <p className="text-gray-600 text-lg mb-2">{book.description}</p>
            </div>

            <div className="text-left mt-4">
              <div className="flex flex-wrap gap-2">
                {book.titleIndex === 0 ? (
                  <button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = `${API}/api/downloads/frontend00`;
                      a.setAttribute("download", "frontend00.zip");
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow"
                  >
                    무료 다운로드
                  </button>
                ) : hasAccess ? (
                  <button
                    onClick={handleDownload}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow"
                  >
                    다운로드
                  </button>
                ) : (
                  <>
                    <a
                      href={book.kmongUrl || "https://kmong.com"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded shadow"
                    >
                      크몽에서 구매하기
                    </a>
                    <Link
                      to={`/transfer-confirm?slug=${book.slug}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow"
                    >
                      홈페이지 구매
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="mt-10 mb-10">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-blue-500 pl-4">
                💡 서비스 설명
              </h3>
              <div className="text-sm text-gray-800 break-words">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="mb-2" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="list-disc ml-5" {...props} />
                    ),
                  }}
                >
                  {book.serviceDetail || ""}
                </ReactMarkdown>
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
              {showPreview && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <img
                      key={idx}
                      src={`${UPLOADS}/${slug}_preview0${idx + 1}.png`}
                      alt={`미리보기 ${idx + 1}`}
                      className="w-full border rounded shadow cursor-pointer"
                      onClick={() => setActivePreview(idx)}
                    />
                  ))}
                </div>
              )}
            </div>

            {activePreview !== null && (
              <div
                className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                onClick={() => setActivePreview(null)}
              >
                <img
                  src={`${UPLOADS}/${slug}_preview0${activePreview + 1}.png`}
                  alt={`확대 미리보기 ${activePreview + 1}`}
                  className="max-w-full max-h-full rounded-lg"
                />
              </div>
            )}
          </div>

          <aside className="hidden lg:block sticky top-24 self-start h-fit">
            <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-6 shadow space-y-3 w-full">
              <h3 className="text-lg font-bold text-gray-800">
                🎁 얼리버드 혜택
              </h3>

              <iframe
                src="https://pub-bb775a03143c476396cd5c6200cab293.r2.dev/timer.html"
                width="100%"
                height="40"
                className="border-none"
                title="얼리버드 타이머"
              />

              <p className="text-gray-700 text-sm">
                정가{" "}
                <span className="line-through text-gray-400">
                  {book.originalPrice?.toLocaleString()}원
                </span>{" "}
                →{" "}
                <span className="text-red-600 font-semibold">
                  {book.price?.toLocaleString()}원
                </span>
              </p>

              {/* ✅ titleIndex가 0이 아닐 때만 크몽 버튼 표시 */}
              {book.titleIndex !== 0 && (
                <a
                  href={book.kmongUrl || "https://kmong.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded text-center"
                >
                  크몽에서 구매하기
                </a>
              )}

              <Link
                to={`/transfer-confirm?slug=${book.slug}`}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center"
              >
                홈페이지 구매
              </Link>
            </div>
          </aside>
        </>
      ) : (
        <p className="text-center mt-10">책 정보를 불러오는 중입니다...</p>
      )}
    </div>
  );
}

export default BookDetail;
