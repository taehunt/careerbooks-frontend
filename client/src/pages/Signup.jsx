import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ userId: '', password: '', nickname: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, form);
      alert('회원가입 성공!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || '에러 발생');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="닉네임"
          className="w-full border p-2"
          onChange={(e) => setForm({ ...form, nickname: e.target.value })}
        />
        <input
          type="text"
          placeholder="아이디"
          className="w-full border p-2"
          onChange={(e) => setForm({ ...form, userId: e.target.value })}
        />
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full border p-2"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2">
          가입하기
        </button>
      </form>
    </div>
  );
}

export default Signup;
