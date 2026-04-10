import { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

export default function Cart() {
  const { cart, removeFromCart, clearCart, markProductsAsPaid } = useCart();
  const [phone, setPhone] = useState('');
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [paidOrder, setPaidOrder] = useState(null);
  const [checkoutRequestID, setCheckoutRequestID] = useState(null);
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

        const resultCode = res.data?.ResultCode;
        console.log('[POLL] Verify result:', res.data);

        if (resultCode === 0 || resultCode === '0') {
          clearInterval(interval);
          setPolling(false);
          markProductsAsPaid(productIds);
          setPaidOrder(paidItems);
          clearCart();
          setMessage('✅ Payment confirmed! Your downloads are ready.');
          setMessageType('success');
          return;
        }

        if (resultCode !== undefined && resultCode !== null &&
            resultCode !== 0 && resultCode !== '0') {
          clearInterval(interval);
          setPolling(false);
          setMessage(`❌ Payment failed: ${res.data?.ResultDesc || 'Try again.'}`);
          setMessageType('error');
          return;
        }

      } catch (e) {
        console.log('[POLL] Attempt', attempts, e.message);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setPolling(false);
        setMessage('⏱ Payment timed out. If you paid, check Downloads in a few minutes.');
        setMessageType('error');
      }
    }, 5000);
  };

  const handleCheckout = async () => {
    const cleaned = phone.replace(/\s+/g, '');
    if (!cleaned.startsWith('254') || cleaned.length !== 12) {
      setMessage('Enter a valid Safaricom number starting with 254 (e.g. 254712345678)');
      setMessageType('error');
      return;
    }

    setPaying(true);
    setMessage('📱 Sending STK push to your phone...');
    setMessageType('success');

    try {
      const productIds = cart.map(i => i.id);
      const paidItems = [...cart];

      const res = await api.post('/pay/', {
        phone: cleaned,
        amount: totalPrice,
        product_ids: productIds,
      });

      console.log('[PAY] Response:', res.data);

      const reqID = res.data?.CheckoutRequestID;
      setCheckoutRequestID(reqID);
      setMessage('📱 STK push sent! Enter your M-Pesa PIN on your phone...');
      setMessageType('success');

      // Poll for real confirmation instead of assuming success
      pollPaymentStatus(reqID, paidItems, productIds);

    } catch (err) {
      console.error('[PAY] Error:', err.response?.data);

      const detail =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.response?.data?.message ||
        (typeof err.response?.data === 'object'
          ? JSON.stringify(err.response.data)
          : null) ||
        'Payment failed. Please try again.';

      setMessage(`❌ ${detail}`);
      setMessageType('error');
    } finally {
      setPaying(false);
    }
  };

  if (paidOrder) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-green-600">🎉 Payment Successful!</h2>
        <p className="mb-4 text-gray-700">Your downloads are ready.</p>
        <div className="space-y-4">
          {paidOrder.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">KSh {item.price}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => window.location.href = '/downloads'}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Go to Downloads
        </button>
      </div>
    );
  }

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
                  className="text-red-600 hover:text-red-800"
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
              <span>KSh {totalPrice}</span>
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
                className="w-full p-3 border rounded-lg"
                disabled={paying || polling}
              />
            </div>

            {message && (
              <div className={`p-3 rounded-lg text-sm ${
                messageType === 'error'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {message}
                {polling && (
                  <span className="ml-2 inline-block animate-pulse">
                    Checking payment status...
                  </span>
                )}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={paying || polling || !phone.trim()}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paying ? 'Sending STK push...' :
               polling ? 'Waiting for payment...' :
               `Pay KSh ${totalPrice}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}