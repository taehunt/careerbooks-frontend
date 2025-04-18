import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const API = import.meta.env.VITE_API_BASE_URL;

function Admin() {
  const navigate = useNavigate();
  const { user, logout, isAuthChecked } = useContext(AuthContext); // ✅ isAuthChecked 추가

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
    const token = localStorage.getItem("token");

    // ✅ 인증 확인 완료 전엔 아무 것도 안함
    if (!isAuthChecked) return;

    if (!token || !user || user.role !== "admin") {
      alert("관리자만 접근할 수 있습니다.");
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
  }, [user, isAuthChecked]);

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

  // ✅ 인증 정보 확인 중일 때 로딩 표시
  if (!isAuthChecked) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        관리자 인증 확인 중...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>

      {/* 나머지 기존 코드 동일 */}
      {/* ... */}
    </div>
  );
}

export default Admin;
