// 파일 경로: root/client/src/pages/admin.jsx

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

axios.defaults.withCredentials = true;
const API = import.meta.env.VITE_API_BASE_URL;

export default function Admin() {
  const navigate = useNavigate();
  const { user, logout, isAuthChecked } = useContext(AuthContext);

  // 전자책 & 회원 데이터
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);

  // 편집 / 등록 폼 상태
  const [editRowId, setEditRowId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [form, setForm] = useState({
    title: "",
    slug: "",
    originalPrice: "",
    price: "",
    titleIndex: "",
    category: "frontend",
    zipUrl: "",
    kmongUrl: "",
  });

  // Collapse 토글
  const [bookCollapse, setBookCollapse] = useState(true);
  const [userCollapse, setUserCollapse] = useState(false);

  // 설명 수정 모달 상태
  const [showDescModal, setShowDescModal] = useState(false);
  const [descSlug, setDescSlug] = useState("");
  const [descContent, setDescContent] = useState("");
  const [descLoading, setDescLoading] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    if (!isAuthChecked) return;
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");

    // 관리자 체크
    if (!token || !user || user.role !== "admin") {
      alert("관리자만 접근할 수 있습니다.");
      logout();
      navigate("/login");
      return;
    }

    // 전자책 목록
    axios
      .get(`${API}/api/books?page=1&limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.books || res.data;
        setBooks(data.sort((a, b) => a.titleIndex - b.titleIndex));
      })
      .catch((err) => {
        console.error("📘 전자책 목록 불러오기 실패", err);
        alert("전자책 목록을 불러오는 중 오류가 발생했습니다.");
      });

    // 회원 목록
    axios
      .get(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("👥 회원 목록 불러오기 실패", err);
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        logout();
        navigate("/login");
      });
  }, [user, isAuthChecked, logout, navigate]);

  // 전자책 목록 리프레시
  const refreshBooks = async () => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const res = await axios.get(`${API}/api/books?page=1&limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.data.books || res.data;
    setBooks(data.sort((a, b) => a.titleIndex - b.titleIndex));
  };

  // 전자책 등록
  const uploadBook = async () => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!form.zipUrl) {
      alert("ZIP 파일의 Cloudflare URL을 입력해주세요.");
      return;
    }
    try {
      await axios.post(`${API}/api/admin/books`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("📘 전자책 등록 완료!");
      setForm({
        title: "",
        slug: "",
        originalPrice: "",
        price: "",
        titleIndex: "",
        category: "frontend",
        zipUrl: "",
        kmongUrl: "",
      });
      await refreshBooks();
    } catch (err) {
      console.error("등록 실패:", err);
      alert(err.response?.data?.message || "등록 중 오류 발생");
    }
  };

  // 전자책 수정 저장
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

  // 전자책 삭제
  const deleteBook = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${API}/api/admin/books/${id}`);
      await refreshBooks();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  // 설명 편집 모달 오픈 시 설명 불러오기
  useEffect(() => {
    if (showDescModal && descSlug) {
      setDescLoading(true);
      axios
        .get(`${API}/api/books/${descSlug}/description`)
        .then((res) => setDescContent(res.data.description || ""))
        .catch((err) => console.error("설명 불러오기 실패", err))
        .finally(() => setDescLoading(false));
    }
  }, [showDescModal, descSlug]);

  // 설명 저장
  const handleDescSave = async () => {
    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      await axios.put(
        `${API}/api/books/${descSlug}/description`,
        { description: descContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ 설명이 저장되었습니다.");
      setShowDescModal(false);
      setDescSlug("");
      setDescContent("");
    } catch (err) {
      console.error("설명 저장 실패", err);
      alert("설명 저장 중 오류가 발생했습니다.");
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

      {/* 전자책 관리 섹션 */}
      <section>
        <button
          onClick={() => setBookCollapse(!bookCollapse)}
          className="text-lg font-semibold bg-blue-100 px-4 py-2 rounded w-full text-left mb-4"
        >
          📚 전자책 관리 {bookCollapse ? "▲" : "▼"}
        </button>

        {bookCollapse && (
          <div className="space-y-12">
            {/* 전자책 목록 테이블 */}
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
                            className="w-16 border px-1"
                            value={editForm.titleIndex}
                            onChange={(e) =>
                              setEditForm({ ...editForm, titleIndex: e.target.value })
                            }
                          />
                        ) : (
                          book.titleIndex
                        )}
                      </td>
                      <td className="border p-2">
                        {editRowId === book._id ? (
                          <input
                            type="text"
                            className="w-full border px-1"
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm({ ...editForm, title: e.target.value })
                            }
                          />
                        ) : (
                          book.title
                        )}
                      </td>
                      <td className="border p-2">{book.slug}</td>
                      <td className="border p-2">
                        {editRowId === book._id ? (
                          <select
                            className="border px-1"
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({ ...editForm, category: e.target.value })
                            }
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
                            className="w-20 border px-1"
                            value={editForm.price}
                            onChange={(e) =>
                              setEditForm({ ...editForm, price: e.target.value })
                            }
                          />
                        ) : (
                          book.price
                        )}
                      </td>
                      <td className="border p-2">
                        {editRowId === book._id ? (
                          <input
                            type="number"
                            className="w-20 border px-1"
                            value={editForm.originalPrice}
                            onChange={(e) =>
                              setEditForm({ ...editForm, originalPrice: e.target.value })
                            }
                          />
                        ) : (
                          book.originalPrice
                        )}
                      </td>
                      <td className="border p-2">
                        {editRowId === book._id ? (
                          <input
                            type="text"
                            className="w-full border px-1"
                            value={editForm.kmongUrl}
                            onChange={(e) =>
                              setEditForm({ ...editForm, kmongUrl: e.target.value })
                            }
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
                        ) : (
                          "-"
                        )}
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

            {/* 전자책 설명 수정 버튼 */}
            <div>
              <h2 className="text-xl font-semibold mb-2">📥 전자책 설명 수정</h2>
              <div className="text-center">
                <button
                  onClick={() => setShowDescModal(true)}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                >
                  📄 설명 수정
                </button>
              </div>
            </div>

            {/* 전자책 등록 */}
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
                  placeholder="Cloudflare ZIP 파일 URL"
                  value={form.zipUrl}
                  onChange={(e) => setForm({ ...form, zipUrl: e.target.value })}
                  className="border p-2 w-full"
                />
                <input
                  type="text"
                  placeholder="kmongUrl"  
                  value={form.kmongUrl}  
                  onChange={(e) => setForm({ ...form, kmongUrl: e.target.value })}  
                  className="border p-2 w-full"  
                />
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

      {/* 회원 관리 섹션 */}
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

      {/* 설명 수정 모달 */}
      {showDescModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-xl max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">전자책 설명 수정</h2>

            <select
              value={descSlug}
              onChange={(e) => setDescSlug(e.target.value)}
              className="w-full mb-4 border p-2 rounded"
            >
              <option value="">— 전자책 선택 —</option>
              {books.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.titleIndex}. {b.title}
                </option>
              ))}
            </select>

            {descLoading ? (
              <p>로딩 중…</p>
            ) : (
              <textarea
                value={descContent}
                onChange={(e) => setDescContent(e.target.value)}
                rows={10}
                className="w-full border p-2 rounded mb-4 whitespace-pre-wrap"
              />
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDescModal(false)}
                className="px-4 py-2 border rounded"
              >
                취소
              </button>
              <button
                onClick={handleDescSave}
                disabled={!descSlug}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded disabled:opacity-50"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
