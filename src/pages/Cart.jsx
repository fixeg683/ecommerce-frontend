import React, { useState } from 'react';
import { Trash2, CreditCard, Phone } from 'lucide-react';

const Cart = () => {
  // Mock data - eventually this will come from your Zustand store
  const [phone, setPhone] = useState('');
  const cartItems = [
    { id: 1, name: 'Sample Product', price: 1200, quantity: 1 }
  ];

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (!phone.startsWith('254') || phone.length !== 12) {
      alert("Please enter a valid Safaricom number (e.g., 254712345678)");
      return;
    }
    console.log("Initiating M-Pesa push for:", phone);
    // Here you will call your initiate_payment view
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items List */}
        <div className="lg:col-span-2">
          {cartItems.map((item) => (
            <div key={item.id} className="mb-4 flex items-center justify-between rounded-lg border bg-white p-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded bg-gray-100"></div>
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">KES {item.price}</p>
                <button className="text-red-500 hover:text-red-700">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Summary */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">Order Summary</h2>
          <div className="mb-4 flex justify-between border-b pb-4">
            <span>Total Amount</span>
            <span className="text-xl font-bold text-blue-600">KES {total}</span>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">M-Pesa Phone Number</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">
                <Phone size={18} />
              </span>
              <input 
                type="text" 
                placeholder="2547XXXXXXXX"
                className="w-full rounded-lg border py-2 pl-10 pr-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-bold text-white hover:bg-green-700 transition-colors"
          >
            <CreditCard size={20} />
            Pay with M-Pesa
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;