import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

const CATEGORY_LABELS = {
  planning: "웹기획",
  design: "웹디자인",
  frontend: "프론트엔드 개발",
  backend: "백엔드 개발",
};

function BookCategories() {
  const [booksByCategory, setBooksByCategory] = useState({});
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${API}/api/books`);
        const grouped = res.data.reduce((acc, book) => {
          if (!acc[book.category]) acc[book.category] = [];
          acc[book.category].push(book);
          return acc;
        }, {});
        setBooksByCategory(grouped);
      } catch (err) {
        console.error("카테고리별 도서 불러오기 실패:", err);
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">📂 전자책 카테고리</h1>
      <div className="space-y-4">
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
          const books = booksByCategory[key] || [];
          if (books.length === 0) return null;

          const isOpen = openCategory === key;

          return (
            <div key={key} className="border rounded-lg shadow bg-white">
              <button
                onClick={() => setOpenCategory(isOpen ? null : key)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-lg text-gray-800 hover:bg-gray-50"
              >
                {label}
                <span className="text-sm text-gray-500">
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>
              {isOpen && (
                <ul className="border-t p-4 space-y-2">
                  {books.map((book) => (
                    <li key={book.slug}>
                      <Link
                        to={`/books/${book.slug}`}
                        className="text-blue-600 hover:underline"
                      >
                        📘 {book.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BookCategories;
