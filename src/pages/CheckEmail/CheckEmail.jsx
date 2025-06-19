// CheckEmail.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const CheckEmail = () => {
    const {t}=useTranslation()
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>✅ {t("Verified")}</h2>
      <p>
{t("PleaseCheck")}      </p>
<a className='LinkGmail' href="https://mail.google.com/mail/u/0/?hl=ar#inbox">Gmail</a>
    </div>
  );
};

export default CheckEmail;
