import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const API = import.meta.env.VITE_API_BASE_URL;

export default function TransferConfirm() {
  const [params] = useSearchParams();
  const { user, isAuthChecked } = useContext(AuthContext);

  const slug = params.get("slug") || "";

  const [form, setForm] = useState({
    depositor: "",
    email: "",
    slug: "",
    memo: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [alreadyOwned, setAlreadyOwned] = useState(false);
  const [book, setBook] = useState(null);

  const BANK_INFO = {
    bankName: "IBK기업은행",
    account: "688-014027-01-011",
    holder: "장태훈",
  };

  useEffect(() => {
    setForm((prev) => ({ ...prev, slug }));

    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token || !user || !slug) return;

    axios
      .get(`${API}/api/books/${slug}/access`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.allowed) setAlreadyOwned(true);
      })
      .catch(() => {});
  }, [slug, user]);

  // 📌 책 정보 불러오기
  useEffect(() => {
    if (!slug) return;

    axios.get(`${API}/api/books/${slug}`)
      .then(res => setBook(res.data))
      .catch(() => {});
  }, [slug]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    try {
      await axios.post(`${API}/api/purchase-requests`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmitted(true);
    } catch (err) {
      alert("제출 중 오류가 발생했습니다.");
    }
  };

  if (!isAuthChecked) {
    return (
      <div className="text-center mt-10 text-gray-500">로그인 확인 중...</div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-gray-800">무통장 입금 정보 제출</h2>

      {alreadyOwned ? (
        <p className="text-red-600 font-semibold">
          이미 보유한 전자책입니다. 중복 구매는 불가능합니다.
        </p>
      ) : submitted ? (
        <p className="text-green-600 font-semibold">
          제출이 완료되었습니다. 확인 후 발송드리겠습니다.
        </p>
      ) : (
        <>
          <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 text-sm text-gray-800 rounded">
            <p className="font-semibold mb-1">💳 입금 계좌 정보</p>
            <p>은행명 : <span className="font-bold">{BANK_INFO.bankName}</span></p>
            <p>계좌번호 : <span className="font-bold">{BANK_INFO.account}</span></p>
            <p>예금주 : <span className="font-bold">{BANK_INFO.holder}</span></p>
            <p>금액 : <span className="font-bold">
              {book ? `${book.price.toLocaleString()}원` : "로딩 중..."}</span></p>
            <p className="mt-2 text-gray-600">
              입금 후 아래 양식에 맞게 정보를 제출해주세요.<br />
              입금확인 후 아래 이메일로 전자책이 발송됩니다 :)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              name="depositor"
              value={form.depositor}
              onChange={handleChange}
              placeholder="입금자명"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일 주소"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="slug"
              value={form.slug}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-600"
            />
            <textarea
              name="memo"
              value={form.memo}
              onChange={handleChange}
              placeholder="기타 메모 (선택)"
              className="w-full border px-3 py-2 rounded"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
            >
              제출하기
            </button>
          </form>
        </>
      )}
    </div>
  );
}
