import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

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
  const [customDescription, setCustomDescription] = useState("");
  const [reviewIndex, setReviewIndex] = useState(0);

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
      .catch(() => setNotFound(true));
  }, [slug]);

  useEffect(() => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) return setHasAccess(false);

    axios
      .get(`${API}/api/books/${slug}/access`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setHasAccess(res.data.allowed))
      .catch(() => setHasAccess(false));
  }, [slug]);

  const handleDownload = () => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");

    const a = document.createElement("a");
    a.href = `${API}/api/downloads/${slug}?token=${token}`;
    a.setAttribute("download", `${slug}.zip`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const categoryLabels = {
    frontend: "프론트엔드 개발",
    backend: "백엔드 개발",
    planner: "웹기획",
    designer: "웹디자인",
  };

  const reviews = [
    "처음엔 반신반의했는데, 지금은 회사 붙었습니다.",
    "진짜 생초보도 이해할 수 있게 풀어줘서 좋아요!",
    "기초부터 포트폴리오까지 있어 이직 준비에 최고였습니다.",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!isAuthChecked) {
    return <div className="text-center mt-10 text-gray-500">로그인 상태 확인 중입니다...</div>;
  }

  return notFound ? (
    <p className="text-center mt-10 text-red-500 font-semibold">존재하지 않는 책입니다.</p>
  ) : book ? (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* 타이핑 애니메이션 헤더 */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl font-extrabold text-center text-indigo-600"
      >
        진짜 생초보를 위한 프론트엔드 전자책, 여기서 시작됩니다.
      </motion.h1>

      {/* 배너 이미지 영역 (예: 소개 배경) */}
      <div className="rounded-xl overflow-hidden shadow-md">
        <img src="https://pub-bb775a03143c476396cd5c6200cab293.r2.dev/ssp_banner.png" alt="배너 이미지" className="w-full h-auto" />
      </div>

      {/* 스크롤 고정 가격정보 (모바일 하단 fixed) */}
      <div className="fixed bottom-0 inset-x-0 bg-white border-t shadow-md p-4 z-50 lg:hidden">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">얼리버드 특가</p>
            <p className="text-lg font-bold text-red-600">₩{book.price.toLocaleString()}</p>
          </div>
          <button className="bg-yellow-500 text-white font-bold py-2 px-6 rounded">구매하기</button>
        </div>
      </div>

      {/* PG 연동 전용 버튼 */}
      <div className="hidden lg:block text-right">
        {/*
        {!hasAccess ? (
          <button onClick={handlePurchase} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow">
            홈페이지 결제 진행
          </button>
        ) : (
          <button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded shadow">
            다운로드
          </button>
        )}
        */}
      </div>

      {/* 서비스 설명 - md 기반 */}
      <div className="prose max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeRaw]}
        >
          {customDescription}
        </ReactMarkdown>
      </div>

      {/* 후기 슬라이더 */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold mb-4">📣 실제 수강 후기</h2>
        <motion.div
          key={reviewIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-50 border rounded-xl p-6 text-center text-gray-800 shadow"
        >
          {reviews[reviewIndex]}
        </motion.div>
      </div>
    </div>
  ) : (
    <p className="text-center mt-10">책 정보를 불러오는 중입니다...</p>
  );
}

export default BookDetail;
