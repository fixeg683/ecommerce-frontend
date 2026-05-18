import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { showSuccess, showError, showInfo } from '../utils/toast';

export default function Cart() {
  const { cart, removeFromCart, clearCart, markProductsAsPaid } = useCart();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [paying, setPaying] = useState(false);
  const [polling, setPolling] = useState(false);

  const totalPrice = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const pollPaymentStatus = (reqID, paidItems, productIds) => {
    setPolling(true);
    let attempts = 0;
    const maxAttempts = 12; // 60 seconds

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await api.post('/verify-payment/', {
          checkout_request_id: reqID,
        });

        const confirmed = res.data?.confirmed === true;
        console.log('[POLL] Verify result:', res.data);

        if (confirmed) {
          clearInterval(interval);
          setPolling(false);
          markProductsAsPaid(productIds);
          clearCart();
          navigate('/downloads?unlocked=1');
          return;
        }

        // Non-pending explicit failure (cancelled, wrong PIN)
        if (res.data?.success === false && res.data?.confirmed === false &&
          res.data?.message && !res.data.message.toLowerCase().includes('pending') &&
          !res.data.message.toLowerCase().includes('processing')) {
          clearInterval(interval);
          setPolling(false);
          showError(`❌ ${res.data.message}`);
          return;
        }

      } catch (e) {
        console.log('[POLL] Attempt', attempts, e.message);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setPolling(false);
        showError('⏱ Payment timed out. If you paid, check Downloads in a few minutes.');
      }
    }, 5000);
  };

  const handleCheckout = async () => {
    const cleaned = phone.replace(/\s+/g, '');
    if (!cleaned.startsWith('254') || cleaned.length !== 12) {
      showError('Enter a valid Safaricom number starting with 254 (e.g. 254712345678)');
      return;
    }

    setPaying(true);
    showInfo('📱 Sending STK push to your phone…');

    try {
      const productIds = cart.map(i => i.id);

      const res = await api.post('/pay/', {
        phone: cleaned,
        amount: totalPrice,
        product_ids: productIds,
      });

      console.log('[PAY] Response:', res.data);

      const reqID = res.data?.CheckoutRequestID;

      if (!reqID) {
        showError('❌ Failed to get payment reference. Please try again.');
        return;
      }

      showSuccess('📱 STK push sent! Enter your M-Pesa PIN on your phone…');
      pollPaymentStatus(reqID, [...cart], productIds);

    } catch (err) {
      console.error('[PAY] Error:', err.response?.data);

      // Backend returns { success, error } — guard against object values
      const raw = err.response?.data;
      const detail =
        (typeof raw?.error === 'string' ? raw.error : null) ||
        (typeof raw?.detail === 'string' ? raw.detail : null) ||
        (typeof raw?.message === 'string' ? raw.message : null) ||
        'Payment failed. Please check your number and try again.';

      showError(`❌ ${detail}`);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border rounded-lg p-4">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">KSh {item.price}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 font-medium transition"
                  disabled={paying || polling}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>KSh {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Safaricom Phone Number (254XXXXXXXXX)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="254712345678"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                disabled={paying || polling}
              />
            </div>

            {polling && (
              <p className="text-yellow-600 text-sm animate-pulse text-center">
                ⏳ Waiting for M-Pesa confirmation…
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={paying || polling || !phone.trim()}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition"
            >
              {paying ? 'Sending STK push…' :
                polling ? 'Waiting for payment…' :
                  `Pay KSh ${totalPrice.toLocaleString()}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}