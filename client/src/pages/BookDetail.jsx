import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function BookDetail() {
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);

  // ✅ 책 정보 불러오기
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/books/${slug}`)
      .then(res => setBook(res.data))
      .catch(err => {
        console.error('책 정보 불러오기 실패', err);
      });
  }, [slug]);

  // ✅ 접근 권한 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/books/${slug}/access`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setHasAccess(res.data.allowed))
      .catch(err => {
        console.error(err);
        setHasAccess(false);
      });
  }, [slug]);

  // ✅ 다운로드 핸들러
  const handleDownload = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/downloads/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('다운로드 실패');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = book.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('다운로드 오류');
      console.error(err);
    }
  };

  // ✅ 구매 핸들러
  const handlePurchase = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/books/${slug}/purchase`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('구매 완료');
      setHasAccess(true);
    } catch (err) {
      alert('구매 오류');
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {book ? (
        <>
          <h2 className="text-2xl font-bold mb-4">{book.title}</h2>
          <p className="text-gray-700 mb-6">{book.description}</p>

          {/* ✅ 미리보기 이미지 최대 5장 */}
          <div className="grid gap-4 mb-6">
            {Array.from({ length: 5 }).map((_, idx) => (
              <img
                key={idx}
                src={`${import.meta.env.VITE_UPLOADS_URL}/${slug}_preview0${idx + 1}.png`}
                alt={`미리보기 ${idx + 1}`}
                className="w-full border rounded shadow"
              />
            ))}
          </div>

          {/* ✅ 버튼 (구매 여부에 따라) */}
          {hasAccess ? (
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              다운로드
            </button>
          ) : (
            <button
              onClick={handlePurchase}
              className="bg-blue-600 text-white px-6 py-2 rounded"
            >
              구매하기
            </button>
          )}
        </>
      ) : (
        <p className="text-center mt-10">책 정보를 불러오는 중입니다...</p>
      )}
    </div>
  );
}

export default BookDetail;
