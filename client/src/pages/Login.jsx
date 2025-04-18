// 파일 경로: root/client/src/pages/Login.jsx

import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

axios.defaults.withCredentials = true;  // ★ 추가된 부분

const API = import.meta.env.VITE_API_BASE_URL;

function Login() {
  const [form, setForm] = useState({ userId: "", password: "" });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/auth/login`, form);
      const { user, token } = res.data;

      login(user, token); // ✅ 관리자 → sessionStorage / 유저 → localStorage 저장

      alert("로그인 성공 :)");

      // ✅ 역할 따라 자동 리다이렉션
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/my-books");
      }
    } catch (err) {
      alert(err.response?.data?.message || "로그인 실패 :(");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800 tracking-tight">
          로그인
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              아이디
            </label>
            <input
              type="text"
              placeholder="아이디를 입력하세요"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
