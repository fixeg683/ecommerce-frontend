import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../lib/api';

const Checkout = () => {
  const { cart, total } = useCart();
  const [phone, setPhone] = useState('254');
  const [loading, setLoading] = useState(false);
  const [checkoutRequestID, setCheckoutRequestID] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'pending' | 'success' | 'failed'

  const handlePayment = async () => {
    const cleaned = phone.replace(/\s+/g, '');
    if (!cleaned.startsWith('254') || cleaned.length !== 12) {
      alert('Enter a valid Safaricom number e.g. 254712345678');
      return;
    }

    setLoading(true);
    setPaymentStatus('pending');

    try {
      const productIds = cart.map(i => i.id);

      const res = await api.post('/api/pay/', {
        phone: cleaned,
        amount: total,
        product_ids: productIds,
      });

      const reqID = res.data.CheckoutRequestID;
      setCheckoutRequestID(reqID);
      alert('📱 Check your phone for the M-Pesa prompt!');

      pollPaymentStatus(reqID);

    } catch (err) {
      const detail = err.response?.data?.error || 'Payment failed to initiate.';
      alert(detail);
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = (reqID) => {
    let attempts = 0;
    const maxAttempts = 10; // poll every 5s for ~50 seconds

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await api.post('/api/verify-payment/', { checkout_request_id: reqID });
        const code = res.data.ResultCode;

        if (code === 0 || code === '0') {
          clearInterval(interval);
          setPaymentStatus('success');
        } else if (code !== undefined && code !== null) {
          clearInterval(interval);
          setPaymentStatus('failed');
        }
      } catch (e) {
        console.log('Polling...', e);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setPaymentStatus(prev => prev !== 'success' ? 'failed' : prev);
      }
    }, 5000);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <div className="mb-4">
        <p className="flex justify-between"><span>Items:</span><span>{cart.length}</span></p>
        <p className="flex justify-between font-bold text-xl"><span>Total:</span><span>KES {total}</span></p>
      </div>

      {paymentStatus === 'success' ? (
        <div className="bg-green-100 p-4 rounded-xl text-center">
          <p className="text-green-700 font-bold text-lg">✅ Payment Confirmed!</p>
          <a
            href="/downloads"
            className="mt-3 block bg-green-500 text-white py-2 rounded-xl font-bold text-center"
          >
            Go to My Downloads
          </a>
        </div>
      ) : (
        <>
          <label className="block mb-2">M-Pesa Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded mb-4"
            placeholder="2547XXXXXXXX"
          />
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-green-500 text-white py-3 rounded-xl font-bold"
          >
            {loading
              ? paymentStatus === 'pending'
                ? '📱 Waiting for M-Pesa...'
                : 'Processing...'
              : 'Pay with M-Pesa'}
          </button>

          {paymentStatus === 'failed' && (
            <p className="text-red-500 mt-2 text-center">
              ❌ Payment failed or timed out. Please try again.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Checkout;
