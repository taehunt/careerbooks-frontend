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
    zipUrl: "",
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
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!form.zipUrl) return alert("ZIP 파일의 Cloudflare URL을 입력해주세요.");

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
            {/* 기존 전자책 목록 테이블 그대로 유지 */}

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
