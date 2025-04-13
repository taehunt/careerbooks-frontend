import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function BookDetail() {
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setNotFound(false);
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/books/${slug}`)
      .then(res => setBook(res.data))
      .catch(err => {
        console.error('책 정보 불러오기 실패', err);
        setNotFound(true);
      });
  }, [slug]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setHasAccess(false);
      return;
    }
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/books/${slug}/access`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setHasAccess(res.data.allowed))
      .catch(err => {
        console.error(err);
        setHasAccess(false);
      });
  }, [slug]);

  const handleDownload = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
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

  const handlePurchase = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }
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

  const categoryLabels = {
	frontend: '프론트엔드 개발',
	backend: '백엔드 개발',
	planner: '웹기획',
	designer: '웹디자인'
  };
  

  return (
    <div className="max-w-3xl mx-auto">
      {notFound ? (
        <p className="text-center mt-10 text-red-500 font-semibold">
          존재하지 않는 책입니다.
        </p>
      ) : book ? (
        <>
			<div className="text-sm text-blue-600 mb-2 space-x-1">
			<Link to="/" className="hover:underline">홈</Link>
			<span>&gt;</span>
			<Link to="/books" className="hover:underline">전자책 목록</Link>
			<span>&gt;</span>
			<Link
				to={`/books?category=${book.category}`}
				className="hover:underline"
			>
				{categoryLabels[book.category] || book.category}
			</Link>
			</div>
          <p className="text-lg font-bold text-gray-600 mb-2">
            · 상세정보
          </p>
          <h2 className="text-lg font-bold mb-2">
            제목 : {book.titleIndex}. {book.title}
          </h2>
          <p className="text-gray-600 mb-2">
            설명 : {book.description}
          </p>
          <p className="font-semibold text-blue-600 mb-6">
            가격 : {book.price.toLocaleString()}원
          </p>

          <p className="text-lg font-bold text-gray-600 mb-2">
            · 서비스설명
          </p>
          <p className="text-gray-600 mb-2">
            📌 이런 분들에게 꼭 추천드립니다<br/><br/>

            ✔️ 비전공자지만 웹 개발을 시작하고 싶은 분<br/>
            ✔️ 실전 프로젝트로 포트폴리오를 만들고 싶은 분<br/>
            ✔️ HTML, CSS, React, Express, MongoDB까지 실제 서비스 흐름을 익히고 싶은 분<br/>
            ✔️ 이직, 부업, 창업 등 실용적인 웹 제작 경험이 필요한 분<br/><br/>

            이 전자책은 단순한 이론서가 아닙니다.<br/>
            실전 중심으로 구성되어 있어 실제 서비스처럼 기획하고, 만들고, 배포할 수 있는 방법을 알려드립니다.<br/>
            지금 시작하지 않으면, 내일도 똑같은 자리에 머물러 있을지도 모릅니다.<br/><br/>
            이 기회를 잡아보세요!<br/><br/>
          </p>

          <p className="text-lg font-bold text-gray-600 mb-2">
            · 미리보기
          </p>
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
