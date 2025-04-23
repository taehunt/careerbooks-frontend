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

  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsersForEmail, setSelectedUsersForEmail] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [editRowId, setEditRowId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [form, setForm] = useState({
    title: "",
    slug: "",
    originalPrice: "",
    price: "",
    titleIndex: "",
    category: "frontend",
    fileName: "",
    kmongUrl: "",
  });

  const [bookCollapse, setBookCollapse] = useState(true);
  const [userCollapse, setUserCollapse] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [manualEmails, setManualEmails] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showDescModal, setShowDescModal] = useState(false);
  const [descSlug, setDescSlug] = useState("");
  const [descContent, setDescContent] = useState("");
  const [descLoading, setDescLoading] = useState(false);

  const [targetBook, setTargetBook] = useState(null);
  const [targetUserEmail, setTargetUserEmail] = useState("");
  const [manualEmail, setManualEmail] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const [serviceDetail, setServiceDetail] = useState("");

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
      .get(`${API}/api/books`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.books;
        setBooks(data.sort((a, b) => a.titleIndex - b.titleIndex));
      })
      .catch((err) => {
        console.error("📘 전자책 목록 불러오기 실패", err);
        alert("전자책 목록을 불러오는 중 오류가 발생했습니다.");
      });

    axios
      .get(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch((err) => {
        console.error("👥 회원 목록 불러오기 실패", err);
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        logout();
        navigate("/login");
      });
  }, [user, isAuthChecked, logout, navigate]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = users.filter(
      (u) =>
        u.userId.toLowerCase().includes(query) ||
        u.nickname?.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
  };

  const toggleUserSelection = (user) => {
    setSelectedUsersForEmail((prev) => {
      const exists = prev.find((u) => u._id === user._id);
      if (exists) {
        const updated = prev.filter((u) => u._id !== user._id);
        const newEmails = { ...manualEmails };
        delete newEmails[user._id];
        setManualEmails(newEmails);
        return updated;
      } else {
        setManualEmails((prevEmails) => ({
          ...prevEmails,
          [user._id]: user.email || "",
        }));
        return [...prev, user];
      }
    });
  };

  const sendBulkEmail = async () => {
    try {
      const payload = selectedUsersForEmail.map((user) => ({
        userId: user._id,
        email: manualEmails[user._id] || user.email,
      }));
      await axios.post(`${API}/api/email/send-bulk`, payload);
      alert("✅ 이메일이 발송되었습니다.");
      setShowEmailModal(false);
      setSelectedUsersForEmail([]);
      setManualEmails({});
    } catch (err) {
      console.error("이메일 발송 실패", err);
      alert("❌ 이메일 발송 실패");
    }
  };

  const uploadBook = async () => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
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
        fileName: "",
        kmongUrl: "",
      });
      await refreshBooks();
    } catch (err) {
      console.error("등록 실패:", err);
      alert(err.response?.data?.message || "등록 중 오류 발생");
    }
  };

  const saveEdit = async (id) => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    try {
      await axios.put(
        `${API}/api/admin/books/${id}`,
        {
          ...editForm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  useEffect(() => {
    if (!descSlug) return;

    setDescLoading(true);
    axios
      .get(`${API}/api/books/${descSlug}/description`)
      .then((res) => setDescContent(res.data.description || ""))
      .catch((err) => console.error("설명 불러오기 실패", err))
      .finally(() => setDescLoading(false));
  }, [descSlug]);

  const handleDescSave = async () => {
    try {
      const token =
        sessionStorage.getItem("token") || localStorage.getItem("token");
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

  const sendZipByEmail = async () => {
    try {
      await axios.post(`${API}/api/email/send`, {
        userId: selectedUser._id,
        slug: selectedBook.slug,
        to: manualEmail,
      });
      alert("✅ 이메일이 전송되었습니다.");
      setShowEmailModal(false);
    } catch (err) {
      console.error("이메일 전송 실패:", err);
      alert("❌ 이메일 전송 실패");
    }
  };

  const refreshBooks = async () => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");

    const res = await axios.get(`${API}/api/books`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = Array.isArray(res.data) ? res.data : res.data.books;
    setBooks(data.sort((a, b) => a.titleIndex - b.titleIndex));
  };

  const currentBooks = books.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(books.length / itemsPerPage);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const tableContainerStyle = {
    minHeight: `${itemsPerPage * 40}px`,
  };

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
            <div>
              <h2 className="text-xl font-semibold mb-2">📘 전자책 목록</h2>
              <div style={tableContainerStyle}>
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
                      <th className="p-2 border">ZIP</th>
                      <th className="p-2 border">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentBooks.map((book) => (
                      <tr key={book._id}>
                        <td className="border p-2">
                          {editRowId === book._id ? (
                            <input
                              type="number"
                              className="w-16 border px-1"
                              value={editForm.titleIndex}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  titleIndex: e.target.value,
                                })
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
                                setEditForm({
                                  ...editForm,
                                  title: e.target.value,
                                })
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
                                setEditForm({
                                  ...editForm,
                                  category: e.target.value,
                                })
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
                                setEditForm({
                                  ...editForm,
                                  price: e.target.value,
                                })
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
                                setEditForm({
                                  ...editForm,
                                  originalPrice: e.target.value,
                                })
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
                                setEditForm({
                                  ...editForm,
                                  kmongUrl: e.target.value,
                                })
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
                        <td className="border p-2">
                          {editRowId === book._id ? (
                            <input
                              type="text"
                              className="w-full border px-1"
                              value={editForm.fileName}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  fileName: e.target.value,
                                })
                              }
                            />
                          ) : book.fileName ? (
                            <span className="text-green-600 font-bold">✔</span>
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
                                    fileName: book.fileName || "",
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
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => handlePageChange(n)}
                      className={`px-3 py-1 rounded border ${
                        currentPage === n
                          ? "bg-blue-500 text-white"
                          : "bg-white"
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* 전자책 설명 수정 버튼 */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                📥 전자책 설명 수정
              </h2>
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

        {/* 메일 발송 섹션 */}
        <section className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">✉️ 이메일 대량 발송</h2>
          <button
            onClick={() => setShowEmailModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm"
          >
            📧 이메일 발송
          </button>
        </section>
      </section>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-3xl space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>📧 이메일로 ZIP 파일 발송</span>
            </h2>

            <p className="text-sm text-gray-600">
              전자책을 선택하고 회원 이메일을 입력한 후 발송하세요. ZIP 첨부
              대신 다운로드 링크와 감사 메시지가 전송됩니다.
            </p>

            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-medium">전자책 선택</span>
                <select
                  value={selectedBook?.slug || ""}
                  onChange={(e) => {
                    const selected = books.find(
                      (b) => b.slug === e.target.value
                    );
                    setSelectedBook(selected);
                  }}
                  className="w-full border p-2 rounded mt-1"
                >
                  <option value="">📘 전자책을 선택하세요</option>
                  {books.map((book) => (
                    <option key={book.slug} value={book.slug}>
                      {book.titleIndex}. {book.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium">회원 검색</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="회원 ID 또는 닉네임 검색"
                  className="w-full border p-2 rounded mt-1"
                />
              </label>

              <div className="border rounded p-2 max-h-40 overflow-auto">
                {filteredUsers.map((user) => (
                  <label
                    key={user._id}
                    className="flex items-center space-x-2 py-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsersForEmail.some(
                        (u) => u._id === user._id
                      )}
                      onChange={() => toggleUserSelection(user)}
                    />
                    <span>
                      {user.userId} ({user.nickname})
                    </span>
                  </label>
                ))}
              </div>

              {selectedUsersForEmail.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-semibold">📬 수신 이메일 입력</h3>
                  {selectedUsersForEmail.map((user) => (
                    <div key={user._id} className="flex items-center space-x-2">
                      <span className="w-32 text-sm truncate">
                        {user.userId}
                      </span>
                      <input
                        type="email"
                        placeholder="이메일 입력"
                        value={manualEmails[user._id] || ""}
                        onChange={(e) =>
                          setManualEmails({
                            ...manualEmails,
                            [user._id]: e.target.value,
                          })
                        }
                        className="flex-1 border p-2 rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 border rounded"
              >
                취소
              </button>
              <button
                onClick={async () => {
                  if (!selectedBook) return alert("전자책을 선택해주세요");
                  const payload = selectedUsersForEmail.map((user) => ({
                    userId: user._id,
                    slug: selectedBook.slug,
                    to: manualEmails[user._id],
                  }));
                  try {
                    await axios.post(`${API}/api/email/send-bulk`, payload);
                    alert("✅ 이메일이 발송되었습니다.");
                    setShowEmailModal(false);
                    setSelectedUsersForEmail([]);
                    setManualEmails({});
                    setSelectedBook(null);
                  } catch (err) {
                    console.error("이메일 발송 실패", err);
                    alert("❌ 이메일 발송 실패");
                  }
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              >
                발송
              </button>
            </div>
          </div>
        </div>
      )}

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
                  <th className="p-2 border">전자책 선택</th>
                  <th className="p-2 border">구매 확정</th>
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
                    <td className="border p-2">
                      <select
                        className="border px-2 py-1 rounded"
                        value={u.selectedBookSlug || ""}
                        onChange={(e) => {
                          const updated = users.map((usr) =>
                            usr._id === u._id
                              ? { ...usr, selectedBookSlug: e.target.value }
                              : usr
                          );
                          setUsers(updated);
                        }}
                      >
                        <option value="">선택</option>
                        {books.map((b) => (
                          <option key={b.slug} value={b.slug}>
                            {b.titleIndex}. {b.title}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={async () => {
                          const token =
                            sessionStorage.getItem("token") ||
                            localStorage.getItem("token");

                          const selectedBook = u.selectedBookSlug;
                          if (!selectedBook) return alert("책을 선택해주세요");

                          try {
                            await axios.post(
                              `${API}/api/admin/confirm-purchase`,
                              {
                                userId: u._id,
                                slug: selectedBook,
                              },
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );
                            alert("✅ 구매 확정 완료");
                          } catch (err) {
                            console.error(err);
                            alert(
                              err.response?.data?.message ||
                                "구매 확정 중 오류 발생"
                            );
                          }
                        }}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                      >
                        확정
                      </button>
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
          <div className="bg-white p-6 rounded-lg w-full max-w-xl max-h-[90vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4">전자책 설명 수정</h2>

            <select
              value={descSlug}
              onChange={async (e) => {
                const newSlug = e.target.value;
                setDescSlug(newSlug);
                setDescLoading(true);

                try {
                  const [bookRes, serviceRes] = await Promise.all([
                    axios.get(`${API}/api/books/${newSlug}`),
                    axios.get(`${API}/api/books/${newSlug}/service`),
                  ]);
                  setDescContent(bookRes.data.description || "");
                  setServiceDetail(serviceRes.data.serviceDetail || "");
                } catch (err) {
                  console.error("설명 불러오기 실패:", err);
                } finally {
                  setDescLoading(false);
                }
              }}
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
              <>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  📌 부제목 (1줄 요약)
                </label>
                <input
                  value={descContent}
                  onChange={(e) => setDescContent(e.target.value)}
                  className="w-full border p-2 rounded mb-4"
                />

                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  📖 서비스 설명 (HTML/Markdown 가능)
                </label>
                <textarea
                  value={serviceDetail}
                  onChange={(e) => setServiceDetail(e.target.value)}
                  rows={10}
                  className="w-full border p-2 rounded mb-4"
                />
              </>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDescModal(false)}
                className="px-4 py-2 border rounded"
              >
                취소
              </button>
              <button
                onClick={async () => {
                  const token =
                    sessionStorage.getItem("token") ||
                    localStorage.getItem("token");
                  try {
                    await axios.put(
                      `${API}/api/books/${descSlug}`,
                      { description: descContent },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );

                    await axios.put(
                      `${API}/api/books/${descSlug}/service`,
                      { serviceDetail },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );

                    alert("✅ 설명이 저장되었습니다.");
                    setShowDescModal(false);
                    setDescSlug("");
                    setDescContent("");
                    setServiceDetail("");
                  } catch (err) {
                    console.error("저장 실패", err);
                    alert("설명 저장 중 오류 발생");
                  }
                }}
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
