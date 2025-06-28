import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { token } = useParams();
  const API = import.meta.env.VITE_API_URL;
  const { t } = useTranslation();

const [message, setMessage] = useState('');
  const [status, setStatus] = useState('loading'); // ممكن تكون success أو error

  useEffect(()=>{
          setMessage(t("verifyingEmailMessage"));

  },[t])
useEffect(() => {
  async function doVerify() {
    try {
      const { data } = await axios.get(`${API}/verify-email/${token}`);
      if (data.success) {
        setMessage(t("emailVerifiedSuccessfully"));
        setStatus('success');

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      setStatus('error');

      const backendMsg = err.response?.data?.message;

      setMessage(
        backendMsg === "رابط التفعيل غير صالح أو منتهي"
          ? t("invalidOrExpiredToken")
          : t("emailVerificationError")
      );
    }
  }

  doVerify();
}, [API, token, navigate, t]);
  return (
    <div className="verify-email-container" style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>{message}</h2>

      {status === 'loading' && <p>⏳ {t("pleaseWait")}</p>}

      {status === 'success' && (
        <p style={{ color: 'green' }}>✅ {t("VerifyPage")}</p>
      )}

      {status === 'error' && (
        <p style={{ color: 'red' }}>❌ {message}</p>
      )}
    </div>
  );
}
