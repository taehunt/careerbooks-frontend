import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_BASE_URL;

function Signup() {
  const [form, setForm] = useState({ userId: '', password: '', nickname: '' });
  const navigate = useNavigate();

  const validate = () => {
    const { userId, password, nickname } = form;

    if (!nickname || !userId || !password) {
      alert('모든 항목을 입력해주세요.');
      return false;
    }

    const koreanRegex = /^[가-힣]{2,8}$/;
    const englishRegex = /^[a-zA-Z]{4,8}$/;
    if (!koreanRegex.test(nickname) && !englishRegex.test(nickname)) {
      alert('닉네임은 한글(2~8자) 또는 영문(4~8자)만 가능하며,\n자음/모음 단독, 숫자/특수문자 또는 혼용은 불가합니다.');
      return false;
    }

    const userIdRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!userIdRegex.test(userId)) {
      alert('아이디는 영어와 숫자만 입력 가능하며, 4~20자까지 입력 가능합니다.');
      return false;
    }

    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]{6,20}$/;
    if (!passwordRegex.test(password)) {
      alert('비밀번호는 영어, 숫자, 특수문자 조합만 가능하며, 6~20자까지 입력 가능합니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post(`${API}/api/auth/signup`, form);
      alert('회원가입 성공 :)');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || '에러가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="닉네임 (한글 2~8자 / 영문 4~8자)"
          className="w-full border p-2"
          onChange={(e) => setForm({ ...form, nickname: e.target.value })}
        />
        <input
          type="text"
          placeholder="아이디 (영문+숫자, 최대 20자)"
          className="w-full border p-2"
          onChange={(e) => setForm({ ...form, userId: e.target.value })}
        />
        <input
          type="password"
          placeholder="비밀번호 (특수문자 포함, 최대 20자)"
          className="w-full border p-2"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 hover:bg-blue-700 transition">
          가입하기
        </button>
      </form>
    </div>
  );
}

export default Signup;
