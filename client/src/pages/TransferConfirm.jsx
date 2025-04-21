import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

export default function TransferConfirm() {
  const location = useLocation();
  const slugFromUrl = new URLSearchParams(location.search).get("slug") || "";

  const [form, setForm] = useState({
    depositor: "",
    email: "",
    slug: slugFromUrl,  // ✅ 초기 slug 세팅
    memo: "",
  });

  const [books, setBooks] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/books`).then((res) => {
      setBooks(res.data);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/purchase-requests`, form);
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-gray-800">무통장 입금 정보 제출</h2>

      {submitted ? (
        <p className="text-green-600 font-semibold">
          제출이 완료되었습니다. 확인 후 발송드리겠습니다.
        </p>
      ) : (
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
          <select
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">전자책 선택</option>
            {books.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.titleIndex}. {b.title}
              </option>
            ))}
          </select>
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
      )}
    </div>
  );
}
