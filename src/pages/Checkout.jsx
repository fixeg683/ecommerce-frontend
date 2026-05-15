import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import { showSuccess, showError } from '../utils/toast';

const Checkout = () => {
  const { cart, totalPrice } = useCart();
  const [phone, setPhone] = useState('254');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = async () => {
    const cleaned = phone.replace(/\s+/g, '');
    if (!cleaned.startsWith('254') || cleaned.length !== 12) {
      showError('Enter a valid Safaricom number e.g. 254712345678');
      return;
    }

    setLoading(true);

    try {
      const productIds = cart.map(i => i.id);

      const res = await api.post('/pay/', {
        phone: cleaned,
        amount: totalPrice,
        product_ids: productIds,
      });

      const checkoutRequestId = res.data.CheckoutRequestID;
      if (!checkoutRequestId) {
        showError('No checkout ID returned. Please try again.');
        return;
      }

      showSuccess('📱 M-Pesa prompt sent! Check your phone.');

      // Hand off ALL polling to PaymentSuccess page
      navigate(
        `/payment-success?checkout_request_id=${encodeURIComponent(checkoutRequestId)}&product_ids=${encodeURIComponent(JSON.stringify(productIds))}`
      );

    } catch (err) {
      const detail = err.response?.data?.error || 'Payment failed to initiate.';
      showError(detail);
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
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
        {loading ? 'Sending M-Pesa prompt…' : 'Pay with M-Pesa'}
      </button>
    </div>
  );
};

export default Checkout;