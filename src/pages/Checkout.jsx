import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import { showSuccess, showError } from '../utils/toast';

const Checkout = () => {
  const { cart, totalPrice, clearCart, markProductsAsPaid } = useCart();
  const [phone, setPhone] = useState('254');
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null | 'pending' | 'success' | 'failed'
  const navigate = useNavigate();

  const handlePayment = async () => {
    const cleaned = phone.replace(/\s+/g, '');
    if (!cleaned.startsWith('254') || cleaned.length !== 12) {
      showError('Enter a valid Safaricom number e.g. 254712345678');
      return;
    }

    setLoading(true);
    setPaymentStatus('pending');

    try {
      const productIds = cart.map(i => i.id);

      const res = await api.post('/pay/', {
        phone: cleaned,
        amount: totalPrice,
        product_ids: productIds,
      });

      const reqID = res.data.CheckoutRequestID;
      showSuccess('📱 M-Pesa prompt sent! Check your phone.');
      pollPaymentStatus(reqID, productIds);

    } catch (err) {
      const detail = err.response?.data?.error || 'Payment failed to initiate.';
      showError(detail);
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = (reqID, productIds) => {
    let attempts = 0;
    const maxAttempts = 10; // poll every 5s for ~50s

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await api.post('/verify-payment/', { checkout_request_id: reqID });
        const code = String(res.data.ResultCode ?? '');

        if (code === '0') {
          clearInterval(interval);
          setPaymentStatus('success');

          // Unlock files in cart context immediately (no page reload needed)
          markProductsAsPaid(productIds);
          clearCart();

          showSuccess('✅ Payment confirmed! Your files are now unlocked.');

          // Navigate to downloads after a short delay so user sees the toast
          setTimeout(() => navigate('/downloads'), 2000);

        } else if (code !== '') {
          clearInterval(interval);
          setPaymentStatus('failed');
          showError('❌ Payment was not completed. Please try again.');
        }
      } catch (e) {
        console.log('Polling attempt', attempts, e);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setPaymentStatus(prev => {
          if (prev !== 'success') {
            showError('⏱ Payment timed out. If you paid, check My Downloads in a moment.');
            return 'failed';
          }
          return prev;
        });
      }
    }, 5000);
  };

  if (!cart.length && paymentStatus !== 'success') {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg">Your cart is empty.</p>
        <a href="/" className="mt-4 inline-block text-blue-600 underline">Browse products</a>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg bg-white shadow">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {/* Order Summary */}
      <div className="mb-6 divide-y border rounded-lg overflow-hidden">
        {cart.map(item => (
          <div key={item.id} className="flex justify-between px-4 py-2 text-sm">
            <span className="text-gray-700">{item.name}</span>
            <span className="font-medium">KES {Number(item.price).toLocaleString()}</span>
          </div>
        ))}
        <div className="flex justify-between px-4 py-3 bg-gray-50 font-bold">
          <span>Total</span>
          <span>KES {Number(totalPrice).toLocaleString()}</span>
        </div>
      </div>

      {paymentStatus === 'success' ? (
        <div className="bg-green-50 border border-green-200 p-5 rounded-xl text-center">
          <p className="text-green-700 font-bold text-lg mb-1">✅ Payment Confirmed!</p>
          <p className="text-green-600 text-sm mb-4">Redirecting you to downloads…</p>
          <a
            href="/downloads"
            className="block bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-bold transition"
          >
            Go to My Downloads
          </a>
        </div>
      ) : (
        <>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            M-Pesa Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="2547XXXXXXXX"
            disabled={loading}
          />

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition"
          >
            {loading
              ? paymentStatus === 'pending'
                ? '📱 Waiting for M-Pesa…'
                : 'Processing…'
              : 'Pay with M-Pesa'}
          </button>

          {paymentStatus === 'pending' && (
            <p className="text-yellow-600 text-sm mt-3 text-center animate-pulse">
              ⏳ Waiting for payment confirmation…
            </p>
          )}

          {paymentStatus === 'failed' && (
            <p className="text-red-500 text-sm mt-3 text-center">
              ❌ Payment failed or timed out. Please try again.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Checkout;
