import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function PaymentSuccess() {
  const [params] = useSearchParams();
  const slug = params.get('slug');
  const navigate = useNavigate();

  useEffect(() => {
    axios.post(`http://localhost:5000/api/books/${slug}/purchase`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(() => {
      alert('구매가 완료되었습니다!');
      navigate(`/books/${slug}`);
    }).catch(() => {
      alert('구매 처리 중 오류 발생');
    });
  }, []);

  return (
    <div className="text-center mt-20 text-xl font-semibold">
      구매 처리 중입니다... 잠시만 기다려주세요.
    </div>
  );
}

export default PaymentSuccess;
