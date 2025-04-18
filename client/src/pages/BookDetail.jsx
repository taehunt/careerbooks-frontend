import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { AuthContext } from "../context/AuthContext"; // ✅ AuthContext 추가

const API = import.meta.env.VITE_API_BASE_URL;
const UPLOADS = import.meta.env.VITE_UPLOADS_URL;

function BookDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { user, isAuthChecked } = useContext(AuthContext); // ✅ 인증 확인

  const [book, setBook] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [customDescription, setCustomDescription] = useState("");
  const [purchaseMethod, setPurchaseMethod] = useState("site");

  useEffect(() => {
    if (slug) {
      axios
        .get(`${API}/api/books/${slug}/description`)
        .then((res) => setCustomDescription(res.data.description || ""))
        .catch(() => setCustomDescription(""));
    }
  }, [slug]);

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
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
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

  const handleDownload = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const a = document.createElement("a");
    a.href = `${API}/api/downloads/${slug}`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePurchase = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `${API}/api/books/${slug}/purchase`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
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

  // ✅ 인증 확인 전엔 아무것도 안 보여줌
  if (!isAuthChecked) {
    return (
      <div className="text-center mt-10 text-gray-500">
        로그인 상태 확인 중입니다...
      </div>
    );
  }

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
                    ({Math.round(
                      ((book.originalPrice - book.price) / book.originalPrice) * 100
                    )}% 할인)
                  </span>
                </>
              ) : (
                <>{book.price.toLocaleString()}원</>
              )}
            </div>
          </div>

          {/* 구매 / 다운로드 버튼 */}
          <div className="text-center">
            {!hasAccess ? (
              <>
                <div className="flex justify-center space-x-2 mb-4">
                  <button
                    onClick={() => setPurchaseMethod("site")}
                    className={`px-4 py-2 rounded ${
                      purchaseMethod === "site"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    홈페이지 구매
                  </button>
                  <button
                    onClick={() => setPurchaseMethod("kmong")}
                    className={`px-4 py-2 rounded ${
                      purchaseMethod === "kmong"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    크몽 구매
                  </button>
                </div>
                {purchaseMethod === "site" ? (
                  <button
                    onClick={handlePurchase}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
                  >
                    홈페이지 결제 진행
                  </button>
                ) : (
                  <a
                    href={book.kmongUrl || "https://kmong.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded shadow inline-block"
                  >
                    크몽 페이지로 이동
                  </a>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
                >
                  다운로드
                </button>
                {typeof window !== "undefined" &&
                  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && (
                    <p className="mt-3 text-sm text-gray-500 leading-snug">
                      모바일에서는 파일이 <span className="text-blue-600 font-semibold">새 창</span>
                      으로 열립니다. <br />
                      열린 창에서 <span className="text-blue-600 font-semibold">공유 버튼</span>
                      을 눌러 저장하세요 😊
                    </p>
                  )}
              </>
            )}
          </div>

          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 border-l-4 border-blue-500 pl-4">
              💡 서비스 설명
            </h3>
            <div className="text-sm text-gray-800 leading-relaxed space-y-4 whitespace-pre-wrap break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                  li: ({ node, ...props }) => (
                    <li className="list-disc ml-5" {...props} />
                  ),
                }}
              >
                {customDescription}
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
        </>
      ) : (
        <p className="text-center mt-10">책 정보를 불러오는 중입니다...</p>
      )}
    </div>
  );
}

export default BookDetail;
