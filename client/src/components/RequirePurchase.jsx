// client/src/components/RequirePurchase.jsx
import { useContext, useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

function RequirePurchase({ children }) {
  const { user } = useContext(AuthContext);
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/books/${slug}/access`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setHasAccess(res.data.allowed);
      } catch (err) {
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [slug, user]);

  if (loading) return <div className="text-center mt-10">로딩 중...</div>;
  if (!hasAccess) return <Navigate to="/books" replace />;

  return children;
}

export default RequirePurchase;
