import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

function BookCategories() {
  const [books, setBooks] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    axios
      .get(`${API}/api/books`)
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("전자책 목록 불러오기 실패", err));
  }, []);

  const grouped = books.reduce((acc, book) => {
    if (!acc[book.category]) acc[book.category] = [];
    acc[book.category].push(book);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    setExpanded((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const categoryNames = {
    frontend: "프론트엔드 개발",
    backend: "백엔드 개발",
    planning: "웹기획",
    design: "웹디자인",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📚 카테고리별 전자책</h1>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-6 border rounded bg-white shadow-sm">
          <div
            onClick={() => toggleCategory(category)}
            className="px-4 py-3 bg-gray-100 cursor-pointer font-semibold text-lg flex justify-between items-center"
          >
            <span>{categoryNames[category] || category}</span>
            <span>{expanded[category] ? "▲" : "▼"}</span>
          </div>

          {expanded[category] && (
            <ul className="divide-y">
              {items.map((book) => (
                <li key={book._id} className="px-4 py-3 hover:bg-gray-50">
                  <Link
                    to={`/books/${book.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {book.titleIndex}. {book.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {books.length === 0 && (
        <p className="text-gray-500 text-center mt-10">등록된 전자책이 없습니다.</p>
      )}
    </div>
  );
}

export default BookCategories;
