import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function TransferConfirm() {
  const [form, setForm] = useState({
    depositor: "",
    email: "",
    slug: "", // URL에서 받아서 세팅
    memo: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const slugParam = searchParams.get("slug");
    if (slugParam) {
      setForm((prev) => ({ ...prev, slug: slugParam }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/purchase-requests`, form);
      setSubmitted(true);
    } catch (err) {
      alert("제출 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow space-y-4 bg-white">
      <h2 className="text-xl font-bold text-gray-800">무통장 입금 정보 제출</h2>

      {submitted ? (
        <p className="text-green-600 font-semibold">
          ✅ 제출이 완료되었습니다. 확인 후 전자책을 발송해드릴게요!
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
      )}
    </div>
  );
}
