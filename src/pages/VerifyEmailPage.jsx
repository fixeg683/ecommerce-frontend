import React, { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (!token) {
      setLoading(false);
      setStatus('error');
      setMessage('No verification token found in URL.');
      return;
    }

    const rawApiUrl = import.meta.env.VITE_API_URL || 'https://backend-ecommerce-3-2hqt.onrender.com';
    const baseUrl = rawApiUrl.replace(/\/+$/, '');

    fetch(`${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Verification failed');
        }
        setStatus('success');
        setMessage(data.message || 'Email verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Unable to connect to verification service.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-[480px] mx-auto mt-20 p-8 text-center border border-gray-200 rounded-lg font-sans">
      {loading && (
        <div>
          <h3>Verifying your account...</h3>
          <p className="text-gray-500">Please wait while we validate your link.</p>
        </div>
      )}

      {!loading && status === 'success' && (
        <div>
          <h2 className="text-green-600">Account Verified!</h2>
          <p className="my-4 text-gray-700">{message}</p>
          <a
            href="/login"
            className="inline-block mt-3 px-6 py-2 bg-gray-900 text-white rounded-md no-underline font-medium"
          >
            Go to Login
          </a>
        </div>
      )}

      {!loading && status === 'error' && (
        <div>
          <h2 className="text-red-600">Verification Failed</h2>
          <p className="my-4 text-gray-600">{message}</p>
          <a
            href="/signup"
            className="inline-block mt-3 text-blue-600 underline"
          >
            Try registering again
          </a>
        </div>
      )}
    </div>
  );
}
