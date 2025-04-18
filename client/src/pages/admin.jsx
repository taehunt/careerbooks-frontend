import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const API = import.meta.env.VITE_API_BASE_URL;

function Admin() {
  const navigate = useNavigate();
  const { user, logout, isAuthChecked } = useContext(AuthContext);

  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [form, setForm] = useState({
    title: "",
    slug: "",
    originalPrice: "",
    price: "",
    titleIndex: "",
    category: "frontend",
    file: null,
    kmongUrl: "",
  });

  const [bookCollapse, setBookCollapse] = useState(true);
  const [userCollapse, setUserCollapse] = useState(false);

  useEffect(() => {
    if (!isAuthChecked) return;

    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");

    if (!token || !user || user.role !== "admin") {
      alert("관리자만 접근할 수 있습니다.");
      logout();
      navigate("/login");
      return;
    }

    axios
      .get(`${API}/api/books`)
      .then((res) =>
        setBooks(res.data.sort((a, b) => a.titleIndex - b.titleIndex))
      )
      .catch((err) => console.error("📘 전자책 목록 불러오기 실패", err));

    axios
      .get(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const result = Array.isArray(res.data)
          ? res.data
          : res.data?.users || [];
        setUsers(result);
      })
      .catch((err) => {
        console.error("👥 회원 목록 불러오기 실패", err);
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        logout();
        navigate("/login");
      });
  }, [user, isAuthChecked, logout, navigate]);

  const refreshBooks = async () => {
    const res = await axios.get(`${API}/api/books`);
    setBooks(res.data.sort((a, b) => a.titleIndex - b.titleIndex));
  };

  const uploadBook = async () => {
    if (!form.file) return alert("파일을 선택해주세요.");

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));

    try {
      await axios.post(`${API}/api/admin/books`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("📘 전자책 업로드 완료!");
      setForm({
        title: "",
        slug: "",
        originalPrice: "",
        price: "",
        titleIndex: "",
        category: "frontend",
        file: null,
        kmongUrl: "",
      });
      await refreshBooks();
    } catch (err) {
      console.error("업로드 실패:", err);
      alert(err.response?.data?.message || "업로드 중 오류 발생");
    }
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${API}/api/admin/books/${id}`, editForm);
      await refreshBooks();
      setEditRowId(null);
      setEditForm({});
    } catch (err) {
      alert(err.response?.data?.message || "수정 실패");
    }
  };

  const deleteBook = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${API}/api/admin/books/${id}`);
      await refreshBooks();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  if (!isAuthChecked) {
    return (
      <div className="text-center mt-10 text-gray-500">
        로그인 상태 확인 중입니다...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>

      {/* 📚 Collapse 영역 */}
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
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Index</th>
                    <th className="p-2 border">제목</th>
                    <th className="p-2 border">Slug</th>
                    <th className="p-2 border">카테고리</th>
                    <th className="p-2 border">가격</th>
                    <th className="p-2 border">정가</th>
                    <th className="p-2 border">크몽</th>
                    <th className="p-2 border">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book._id}>
                      <td className="border p-2">
                        {editRowId === book._id ? (
                          <input
                            type="number"
                            value={editForm.titleIndex}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                titleIndex: e.target.value,
                              })
                            }
                            className="w-16 border px-1"
                          />
                        ) : (
                          book.titleIndex
                        )}
                      </td>
                      <td className="border p-2">
                        {editRowId === book._id ? (
                          <input
                            type="text"
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                title: e.target.value,
                              })
                            }
                            className="w-full border px-1"
                          />
                        ) : (
                          book.title
                        )}
                      </td>
                      <td className="border p-2">{book.slug}</td>
                      <td className="border p-2">
                        {editRowId === book._id ? (
                          <select
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                category: e.target.value,
                              })
                            }
                            className="border px-1"
                          >
                            <option value="frontend">프론트엔드</option>
                            <option value="backend">백엔드</option>
                            <option value="design">웹디자인</option>
                            <option value="planning">웹기획</option>
                          </select>
                        ) : (
                          book.category
                        )}
                      </td>
                      <td className="border p-2">
                        {editRowId === book._id ? (
                          <input
                            type="number"
                            value={editForm.price}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                price: e.target.value,
                              })
                            }
                            className="w-20 border px-1"
                          />
                        ) : (
                          book.price
                        )}
                      </td>
                      <td className="border p-2">
                        {editRowId === book._id ? (
                          <input
                            type="number"
                            value={editForm.originalPrice}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                originalPrice: e.target.value,
                              })
                            }
                            className="w-20 border px-1"
                          />
                        ) : (
                          book.originalPrice
                        )}
                      </td>
                      <td className="border p-2">
                        {editRowId === book._id ? (
                          <input
                            type="text"
                            value={editForm.kmongUrl}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                kmongUrl: e.target.value,
                              })
                            }
                            className="w-full border px-1"
                          />
                        ) : book.kmongUrl ? (
                          <a
                            href={book.kmongUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            링크
                          </a>
                        ) : null}
                      </td>
                      <td className="border p-2 space-x-2">
                        {editRowId === book._id ? (
                          <>
                            <button
                              onClick={() => saveEdit(book._id)}
                              className="text-green-600 hover:underline"
                            >
                              저장
                            </button>
                            <button
                              onClick={() => {
                                setEditRowId(null);
                                setEditForm({});
                              }}
                              className="text-gray-600 hover:underline"
                            >
                              취소
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditRowId(book._id);
                                setEditForm({
                                  title: book.title,
                                  titleIndex: book.titleIndex,
                                  category: book.category,
                                  price: book.price,
                                  originalPrice: book.originalPrice,
                                  kmongUrl: book.kmongUrl || "",
                                });
                              }}
                              className="text-green-600 hover:underline"
                            >
                              수정
                            </button>
                            <Link
                              to={`/admin/books/edit?slug=${book.slug}`}
                              className="text-blue-600 hover:underline"
                            >
                              설명 수정
                            </Link>
                            <button
                              onClick={() => deleteBook(book._id)}
                              className="text-red-600 hover:underline"
                            >
                              삭제
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📝 설명 수정 바로가기 */}
            <div>
              <h2 className="text-xl font-semibold mb-2">📝 전자책 설명 수정</h2>
              <p className="mb-4 text-gray-600">
                각 전자책의 서비스 설명(마크다운)을 수정하려면 아래 버튼을 눌러 이동하세요.
              </p>
              <Link
                to="/admin/books/edit"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                설명 수정 페이지로 이동
              </Link>
            </div>

            {/* 📥 전자책 등록 */}
            <div>
              <h2 className="text-xl font-semibold mb-2">📥 전자책 등록</h2>
              <div className="space-y-2">
                {["titleIndex", "title", "originalPrice", "price", "slug"].map(
                  (key) => (
                    <input
                      key={key}
                      type={
                        key.includes("Price") || key === "titleIndex"
                          ? "number"
                          : "text"
                      }
                      placeholder={key}
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      className="border p-2 w-full"
                    />
                  )
                )}
                <input
                  type="text"
                  placeholder="kmongUrl"
                  value={form.kmongUrl}
                  onChange={(e) =>
                    setForm({ ...form, kmongUrl: e.target.value })
                  }
                  className="border p-2 w-full"
                />
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="border p-2 w-full"
                >
                  <option value="frontend">프론트엔드</option>
                  <option value="backend">백엔드</option>
                  <option value="design">웹디자인</option>
                  <option value="planning">웹기획</option>
                </select>
                <input
                  type="file"
                  onChange={(e) =>
                    setForm({ ...form, file: e.target.files[0] })
                  }
                  className="w-full"
                />
                <button
                  onClick={uploadBook}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  등록하기
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 👥 Collapse 영역 */}
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
                    <td className="border p-2">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
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
