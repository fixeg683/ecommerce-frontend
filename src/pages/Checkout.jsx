import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Checkout = () => {
  const { cart, total } = useCart();
  const [phone, setPhone] = useState('254');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/pay/', 
        { phone, amount: total },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Check your phone for the M-Pesa prompt!");
    } catch (err) {
      alert("Payment failed to initiate.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <div className="mb-4">
        <p className="flex justify-between"><span>Items:</span> <span>{cart.length}</span></p>
        <p className="flex justify-between font-bold text-xl"><span>Total:</span> <span>KES {total}</span></p>
      </div>
      <label className="block mb-2">M-Pesa Phone Number</label>
      <input 
        type="text" value={phone} 
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border p-2 rounded mb-4" 
        placeholder="2547XXXXXXXX"
      />
      <button 
        onClick={handlePayment} disabled={loading}
        className="w-full bg-green-500 text-white py-3 rounded-xl font-bold"
      >
        {loading ? "Processing..." : "Pay with M-Pesa"}
      </button>
    </div>
  );
};
export default Checkout;