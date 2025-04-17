import { useEffect, useState } from "react";
import axios from "axios";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";

const API = import.meta.env.VITE_API_BASE_URL;

function EditBookDescription() {
  const [books, setBooks] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const mdParser = new MarkdownIt();

  useEffect(() => {
    axios
      .get(`${API}/api/books`)
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("책 목록 불러오기 실패:", err));
  }, []);

  useEffect(() => {
    if (selectedSlug) {
      setLoading(true);
      axios
        .get(`${API}/api/books/${selectedSlug}/description`)
        .then((res) => setDescription(res.data.description || ""))
        .catch(() => setDescription(""))
        .finally(() => setLoading(false));
    }
  }, [selectedSlug]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("로그인 필요");

      await axios.put(
        `${API}/api/books/${selectedSlug}/description`,
        { description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("저장되었습니다.");
    } catch (err) {
      console.error("저장 오류:", err);
      alert("저장 실패");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">📘 전자책 설명 수정</h1>

      <div className="mb-6">
        <label className="block mb-2 font-medium">전자책 선택</label>
        <select
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">--- 전자책 선택 ---</option>
          {books.map((book) => (
            <option key={book.slug} value={book.slug}>
              {book.titleIndex}. {book.title}
            </option>
          ))}
        </select>
      </div>

      {selectedSlug && (
        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-500">불러오는 중...</p>
          ) : (
            <>
              <MdEditor
                value={description}
                renderHTML={(text) => mdParser.render(text)}
                onChange={({ text }) => {
                  console.log("저장되는 text:", text); // ✅ 이거로 줄바꿈 있는지 확인
                  setDescription(text); // 꼭 text! html 아님!
                }}
              />
              <div className="text-right mt-4">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  저장하기
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default EditBookDescription;
