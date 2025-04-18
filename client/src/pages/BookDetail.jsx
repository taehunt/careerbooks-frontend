import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
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
  const [customDescription, setCustomDescription] = useState("");

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

  const handleDownload = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
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
    } catch {
      alert("구매 오류");
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
    <div className="max-w-3xl mx-auto">
      {notFound ? (
        <p className="text-center mt-10 text-red-500 font-semibold">
          존재하지 않는 책입니다.
        </p>
      ) : book ? (
        <>
          {/* ...상단 정보/구매 버튼/서비스 설명 부분은 기존과 동일... */}

          {/* 미리보기 이미지 섹션 */}
          <div className="mb-10">
            <h3 className="flex justify-between items-center text-xl font-semibold text-gray-800 mb-3 border-l-4 border-green-500 pl-4">
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
                    className="w-full border rounded shadow hover:shadow-lg transition"
                  />
                ))}
              </div>
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