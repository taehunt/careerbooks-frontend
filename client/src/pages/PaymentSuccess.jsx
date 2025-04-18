// 파일 경로: root/client/src/pages/PaymentSuccess.jsx

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

axios.defaults.withCredentials = true;  // ★ 추가된 부분

const API = import.meta.env.VITE_API_BASE_URL;

function PaymentSuccess() {
  const [params] = useSearchParams();
  const slug = params.get("slug");
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;

    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    axios
      .post(
        `${API}/api/books/${slug}/purchase`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("구매가 완료되었습니다!");
        navigate(`/books/${slug}`);
      })
      .catch(() => {
        alert("구매 처리 중 오류 발생");
      });
  }, [slug, navigate]);

  return (
    <div className="text-center mt-20 text-xl font-semibold">
      구매 처리 중입니다... 잠시만 기다려주세요.
    </div>
  );
}

export default PaymentSuccess;
