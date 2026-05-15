import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { showSuccess, showError } from '../utils/toast';

const POLL_INTERVAL_MS = 5000;
const MAX_ATTEMPTS = 12; // 60 seconds total

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { markProductsAsPaid, clearCart } = useCart();

  const [status, setStatus] = useState('verifying');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const checkoutRequestId = params.get('checkout_request_id');

    // No checkout_request_id means we arrived here after already-confirmed payment
    if (!checkoutRequestId) {
      setStatus('success');
      return;
    }

    let attempts = 0;
    let stopped = false;

    const poll = async () => {
      if (stopped) return;
      attempts++;

      try {
        const res = await api.post('/verify-payment/', {
          checkout_request_id: checkoutRequestId,
        });

        const code = String(res.data?.ResultCode ?? '');

        // Success
        if (code === '0') {
          stopped = true;
          const rawIds = params.get('product_ids');
          if (rawIds) {
            try {
              const ids = JSON.parse(rawIds);
              markProductsAsPaid(ids);
              clearCart();
            } catch (_) { }
          }
          showSuccess('Payment confirmed! Your files are unlocked.');
          setStatus('success');
          return;
        }

        // Still pending — "pending" string or empty means keep polling
        if (code === 'pending' || code === '') {
          // keep polling
        } else {
          // A real non-zero numeric code = definite failure
          stopped = true;
          showError('Payment was not completed. Please try again.');
          setStatus('failed');
          return;
        }

      } catch (e) {
        console.warn('Polling attempt', attempts, e);
        // network error — keep trying
      }

      if (attempts >= MAX_ATTEMPTS) {
        stopped = true;
        setStatus('timeout');
        return;
      }

      if (!stopped) setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();
    return () => { stopped = true; };
  }, []);

  // Auto-redirect countdown after success
  useEffect(() => {
    if (status !== 'success') return;
    if (countdown <= 0) { navigate('/downloads'); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, countdown]);

  /* ── VERIFYING ── */
  if (status === 'verifying') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-6 py-12 max-w-sm w-full">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Verifying Payment</h2>
          <p className="text-gray-500 text-sm">
            Please wait while we confirm your M-Pesa transaction…
          </p>
          <p className="text-gray-400 text-xs mt-4 animate-pulse">
            This may take up to 60 seconds
          </p>
        </div>
      </div>
    );
  }

  /* ── SUCCESS ── */
  if (status === 'success') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 px-8 py-12 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor"
                strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-500 text-sm mb-1">
            Your purchase is confirmed. Your files are now unlocked and ready to download.
          </p>
          <p className="text-green-600 text-xs font-medium mb-8">
            Redirecting to downloads in{' '}
            <span className="font-bold text-green-700">{countdown}s</span>…
          </p>
          <Link to="/downloads"
            className="block w-full bg-green-500 hover:bg-green-600 active:scale-95 transition-all text-white font-bold py-3 rounded-xl mb-3">
            Go to My Downloads
          </Link>
          <Link to="/"
            className="block w-full border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium py-3 rounded-xl transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  /* ── FAILED ── */
  if (status === 'failed') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 px-8 py-12 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor"
                strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-gray-500 text-sm mb-8">
            Your payment was not completed. You have not been charged. Please try again.
          </p>
          <Link to="/cart"
            className="block w-full bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white font-bold py-3 rounded-xl mb-3">
            Return to Cart
          </Link>
          <Link to="/"
            className="block w-full border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium py-3 rounded-xl transition">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  /* ── TIMEOUT ── */
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-yellow-100 px-8 py-12 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor"
              strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Payment Pending</h1>
        <p className="text-gray-500 text-sm mb-2">
          We couldn't confirm your payment in time. If you completed the M-Pesa prompt,
          your purchase may still be processing.
        </p>
        <p className="text-gray-400 text-xs mb-8">
          Check <strong>My Downloads</strong> in a few minutes — it will appear once confirmed.
        </p>
        <Link to="/downloads"
          className="block w-full bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-all text-white font-bold py-3 rounded-xl mb-3">
          Check My Downloads
        </Link>
        <Link to="/cart"
          className="block w-full border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium py-3 rounded-xl transition">
          Return to Cart
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;