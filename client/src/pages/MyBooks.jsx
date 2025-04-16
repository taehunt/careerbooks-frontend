import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_BASE_URL;

function MyBooks() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API}/api/books/my-books`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBooks(data));
  }, []);

  const isDownloadable = (purchasedAt) => {
    const deadline = new Date(purchasedAt);
    deadline.setFullYear(deadline.getFullYear() + 1);
    return new Date() <= deadline;
  };

  const getRemainingDays = (purchasedAt) => {
    const deadline = new Date(purchasedAt);
    deadline.setFullYear(deadline.getFullYear() + 1);
    const diff = deadline - new Date();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const handleDownload = (slug) => {
    const token = localStorage.getItem("token");
    const downloadUrl = `${API}/api/downloads/${slug}`;

    // 다운로드는 브라우저가 직접 열도록 처리 (CORS 회피)
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        📚 내가 구매한 전자책
      </h2>
      {books.length === 0 ? (
        <p className="text-center text-gray-500">구매한 책이 없습니다.</p>
      ) : (
        <ul className="space-y-6">
          {books.map((book) => (
            <li
              key={book.slug}
              className="bg-white border rounded-lg p-4 shadow flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold">{book.title}</h3>
                <p className="text-sm text-gray-600">
                  구매일: {new Date(book.purchasedAt).toLocaleDateString()}
                  <br />
                  다운로드 가능일: 구매일로부터 1년
                  <br />
                  남은 기간: {getRemainingDays(book.purchasedAt)}일
                </p>
              </div>
              <div>
                {isDownloadable(book.purchasedAt) ? (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleDownload(book.slug)}
                  >
                    다운로드
                  </button>
                ) : (
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                    disabled
                  >
                    다운로드 불가
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyBooks;
