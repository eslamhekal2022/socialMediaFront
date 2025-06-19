import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { token } = useParams();
  const API = import.meta.env.VITE_API_URL;

  const [message, setMessage] = useState('جاري التحقق من بريدك الإلكتروني...');
  const [status, setStatus] = useState('loading'); // ممكن تكون success أو error

  useEffect(() => {
    async function doVerify() {
      try {
        const { data } = await axios.post(`${API}/verify-email/${token}`);
        if (data.success) {
          setMessage(data.message);
          setStatus('success');
            navigate("/login");
        }
      } catch (err) {
        setStatus('error');
        setMessage(
          err.response?.data?.message || 'حدث خطأ أثناء التفعيل، حاول مرة أخرى.'
        );
      }
    }

    doVerify();
  }, [API, token, navigate]);

  return (
    <div className="verify-email-container" style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>{message}</h2>
      {status === 'loading' && <p>⏳ من فضلك انتظر...</p>}
      {status === 'success' && <p>✅ سيتم تحويلك إلى صفحة تسجيل الدخول</p>}
      {status === 'error' && <p style={{ color: 'red' }}>❌ {message}</p>}
    </div>
  );
}
