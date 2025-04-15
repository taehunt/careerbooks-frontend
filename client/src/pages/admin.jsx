import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

function Admin() {
  const [newSlide, setNewSlide] = useState({
    title: "",
    subtitle: "",
    image: "",
    button1: "",
    button1Url: "",
    button2: "",
    button2Url: "",
    bgColor: "#ffffff",
    textAlign: "left",
    fontSize: "24px",
  });

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

  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [editRowId, setEditRowId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  // ✅ 전자책 목록 불러오기
  useEffect(() => {
    axios
      .get(`${API}/api/books`)
      .then((res) => {
        const sorted = res.data.sort((a, b) => a.titleIndex - b.titleIndex);
        setBooks(sorted);
      })
      .catch((err) => {
        console.error("전자책 목록 불러오기 실패", err);
      });
  }, []);

  // ✅ 전자책 등록
  const uploadBook = async () => {
    if (!form.file) {
      alert("파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );

    try {
      await axios.post(`${API}/api/admin/books`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("전자책 업로드 완료!");
      setForm({
        title: "",
        slug: "",
        description: "",
        price: "",
        originalPrice: "",
        titleIndex: "",
        category: "frontend",
        file: null,
      });
    } catch (err) {
      console.error("업로드 실패", err);
      alert(err.response?.data?.message || "업로드 중 오류 발생");
    }
  };

  // ✅ 회원 목록 불러오기
  useEffect(() => {
    axios
      .get(`${API}/api/admin/users`, { withCredentials: true })
      .then((res) => {
        if (Array.isArray(res.data)) setUsers(res.data);
        else if (res.data?.users) setUsers(res.data.users);
        else setUsers([]);
      })
      .catch((err) => {
        console.error("회원 목록 불러오기 실패", err);
        setUsers([]);
      });
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-12">
      <h1 className="text-3xl font-bold">관리자 페이지</h1>

      {/* 📘 전자책 목록 출력 */}
      <section>
        <h2 className="text-xl font-semibold mb-2">📘 등록된 전자책 목록</h2>
        <table className="w-full border text-sm table-fixed">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 w-[60px] border">Index</th>
              <th className="p-2 w-auto border">제목</th>
              <th className="p-2 w-[90px] border hidden sm:table-cell">Slug</th>
              <th className="p-2 w-[70px] border">카테고리</th>
              <th className="p-2 w-[80px] border">가격</th>
              <th className="p-2 w-[90px] border hidden sm:table-cell">정가</th>
              <th className="p-2 w-[70px] border">관리</th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book) => (
              <tr key={book._id}>
                <td className="border p-2 text-center">
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
                      className="border px-2 py-1 w-20 text-center"
                    />
                  ) : (
                    book.titleIndex
                  )}
                </td>
                <td className="border p-2 max-w-auto truncate">
                  {editRowId === book._id ? (
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="border px-2 py-1 w-full"
                    />
                  ) : (
                    book.title
                  )}
                </td>
                <td className="border p-2 text-center hidden sm:table-cell">
                  {book.slug}
                </td>
                <td className="border p-2 text-center">
                  {editRowId === book._id ? (
                    <select
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({ ...editForm, category: e.target.value })
                      }
                      className="border px-2 py-1 w-32"
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
                <td className="border p-2 text-right">
                  {editRowId === book._id ? (
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: e.target.value })
                      }
                      className="border px-2 py-1 w-20 text-right"
                    />
                  ) : (
                    `${book.price?.toLocaleString()}원`
                  )}
                </td>
                <td className="border p-2 text-right hidden sm:table-cell">
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
                      className="border px-2 py-1 w-20 text-right"
                    />
                  ) : (
                    `${book.originalPrice?.toLocaleString()}원`
                  )}
                </td>
                <td className="border p-2 text-center space-x-1">
                  {editRowId === book._id ? (
                    <>
                      <button
                        onClick={async () => {
                          try {
                            await axios.put(
                              `${API}/api/admin/books/${book._id}`,
                              editForm
                            );
                            const res = await axios.get(`${API}/api/books`);
                            setBooks(
                              res.data.sort(
                                (a, b) => a.titleIndex - b.titleIndex
                              )
                            );
                            setEditRowId(null);
                          } catch (err) {
                            alert(
                              err.response?.data?.message || "수정 실패"
                            );
                          }
                        }}
                        className="text-green-600 hover:underline text-sm"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => {
                          setEditRowId(null);
                          setEditForm({});
                        }}
                        className="text-gray-500 hover:underline text-sm"
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
                          });
                        }}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        수정
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm("정말 삭제하시겠습니까?")) {
                            await axios.delete(
                              `${API}/api/admin/books/${book._id}`
                            );
                            const res = await axios.get(`${API}/api/books`);
                            setBooks(
                              res.data.sort(
                                (a, b) => a.titleIndex - b.titleIndex
                              )
                            );
                          }
                        }}
                        className="text-red-600 hover:underline text-sm"
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
      </section>

      {/* 📚 전자책 등록 */}
      <section>
        <h2 className="text-xl font-semibold mb-2">📚 전자책 등록</h2>
        <div className="space-y-2">
          <input
            type="number"
            placeholder="전자책 인덱스 (정렬용 숫자)"
            value={form.titleIndex}
            onChange={(e) =>
              setForm({ ...form, titleIndex: e.target.value })
            }
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="제목"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="전자책 설명"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="border p-2 w-full"
          />
          <input
            type="number"
            placeholder="정가 (원)"
            value={form.originalPrice}
            onChange={(e) =>
              setForm({ ...form, originalPrice: e.target.value })
            }
            className="border p-2 w-full"
          />
          <input
            type="number"
            placeholder="판매가 (원)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="슬러그 (예: frontend01)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
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
          <input
            type="file"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            className="w-full"
          />
          <button
            onClick={uploadBook}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            등록하기
          </button>
        </div>
      </section>

      {/* 👥 회원 목록 */}
      <section>
        <h2 className="text-xl font-semibold mb-2">👥 회원 목록</h2>
        <table className="w-full border">
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
      </section>
    </div>
  );
}

export default Admin;
