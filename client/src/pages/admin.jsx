/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE_URL;

function Admin() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    originalPrice: "",
    price: "",
    titleIndex: "",
    category: "frontend",
    file: null,
  });

  const [bookCollapse, setBookCollapse] = useState(true);
  const [userCollapse, setUserCollapse] = useState(false);

  const booksPerPage = 10;
  const currentPage = 1;
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  useEffect(() => {
    axios
      .get(`${API}/api/books`)
      .then((res) => setBooks(res.data.sort((a, b) => a.titleIndex - b.titleIndex)))
      .catch((err) => console.error("전자책 목록 불러오기 실패", err));

    axios
      .get(`${API}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : res.data?.users || []))
      .catch((err) => {
        console.error("회원 목록 불러오기 실패", err);
        setUsers([]);
      });
  }, []);

  const uploadBook = async () => {
    if (!form.file) return alert("파일을 선택해주세요.");

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));

    try {
      await axios.post(`${API}/api/admin/books`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("전자책 업로드 완료!");
      setForm({
        title: "",
        slug: "",
        description: "",
        originalPrice: "",
        price: "",
        titleIndex: "",
        category: "frontend",
        file: null,
      });
    } catch (err) {
      console.error("업로드 실패", err);
      alert(err.response?.data?.message || "업로드 중 오류 발생");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>

      {/* 📚 전자책 관리 */}
      <section>
        <button
          onClick={() => setBookCollapse(!bookCollapse)}
          className="text-lg font-semibold bg-blue-100 px-4 py-2 rounded w-full text-left mb-4"
        >
          📚 전자책 관리 {bookCollapse ? "▲" : "▼"}
        </button>

        {bookCollapse && (
          <div className="space-y-12">
            {/* 📘 전자책 목록 */}
            <div>
              <h2 className="text-xl font-semibold mb-2">📘 전자책 목록</h2>
              <table className="w-full border text-sm table-fixed">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Index</th>
                    <th className="p-2 border">제목</th>
                    <th className="p-2 border">Slug</th>
                    <th className="p-2 border">카테고리</th>
                    <th className="p-2 border">가격</th>
                    <th className="p-2 border">정가</th>
                    <th className="p-2 border">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBooks.map((book) => (
                    <tr key={book._id}>
                      <td className="border p-2 text-center">{book.titleIndex}</td>
                      <td className="border p-2">{book.title}</td>
                      <td className="border p-2">{book.slug}</td>
                      <td className="border p-2">{book.category}</td>
                      <td className="border p-2 text-right">{book.price.toLocaleString()}원</td>
                      <td className="border p-2 text-right">{book.originalPrice.toLocaleString()}원</td>
                      <td className="border p-2 text-center">
                        <Link to={`/admin/books/edit?slug=${book.slug}`} className="text-blue-600 hover:underline text-sm">
                          설명 수정
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📚 전자책 등록 */}
            <div>
              <h2 className="text-xl font-semibold mb-2">📚 전자책 등록</h2>
              <div className="space-y-2">
                {[
                  "titleIndex",
                  "title",
                  "description",
                  "originalPrice",
                  "price",
                  "slug",
                ].map((key) => (
                  <input
                    key={key}
                    type={key.includes("Price") || key === "titleIndex" ? "number" : "text"}
                    placeholder={key}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="border p-2 w-full"
                  />
                ))}
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="border p-2 w-full"
                >
                  <option value="frontend">프론트엔드</option>
                  <option value="backend">백엔드</option>
                  <option value="design">웹디자인</option>
                  <option value="planning">웹기획</option>
                </select>
                <input
                  type="file"
                  onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                  className="w-full"
                />
                <button onClick={uploadBook} className="bg-green-600 text-white px-4 py-2 rounded">
                  등록하기
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 👥 회원 관리 */}
      <section>
        <button
          onClick={() => setUserCollapse(!userCollapse)}
          className="text-lg font-semibold bg-blue-100 px-4 py-2 rounded w-full text-left"
        >
          👥 회원 관리 {userCollapse ? "▲" : "▼"}
        </button>
        {userCollapse && (
          <div className="mt-4">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">ID</th>
                  <th className="p-2 border">닉네임</th>
                  <th className="p-2 border">권한</th>
                  <th className="p-2 border">가입일</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={i}>
                    <td className="border p-2">{u.userId}</td>
                    <td className="border p-2">{u.nickname}</td>
                    <td className="border p-2">{u.role || "user"}</td>
                    <td className="border p-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Admin;
