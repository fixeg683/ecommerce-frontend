import { Trash2, CreditCard, Phone, ShoppingBag, Minus, Plus, ImageOff, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

const BACKEND_URL =
  import.meta.env.VITE_API_URL || 'https://backend-ecommerce-3-href.onrender.com';

const getImageUrl = (item) => {
  if (item.image_url) return item.image_url;
  if (!item.image) return null;
  if (item.image.startsWith('http')) return item.image;
  return `${BACKEND_URL}${item.image}`;
};

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart();
  const [phone, setPhone] = useState('');
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheckout = async () => {
    if (!phone.startsWith('254') || phone.length !== 12) {
      setMessage('Please enter a valid Safaricom number (e.g., 254712345678)');
      return;
    }
    setPaying(true);
    setMessage('');
    try {
      await api.post('/pay/', { phone, amount: totalPrice });
      setMessage('✅ M-Pesa push sent! Check your phone to complete payment.');
      clearCart();
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-gray-300">
        <ShoppingBag size={72} />
        <p className="text-xl font-semibold text-gray-400">Your cart is empty</p>
        <Link
          to="/"
          className="flex items-center gap-2 text-green-600 font-bold hover:underline text-sm mt-2"
        >
          <ArrowLeft size={16} /> Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Your Cart</h1>
          <p className="text-gray-400 text-sm mt-1">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-600 transition font-medium">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const imageUrl = getImageUrl(item);
            return (
              <div key={item.id} className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageOff size={24} className="text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-green-600 font-bold text-sm mt-0.5">
                    KES {Number(item.price).toLocaleString()}
                  </p>
                  {/* Quantity */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* Subtotal + Remove */}
                <div className="text-right flex-shrink-0">
                  <p className="font-extrabold text-gray-900">
                    KES {(Number(item.price) * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2 text-red-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

          <div className="space-y-3 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-gray-500">
                <span className="truncate max-w-[160px]">{item.name} × {item.quantity}</span>
                <span>KES {(Number(item.price) * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-6">
            <span className="font-bold text-gray-700">Total</span>
            <span className="text-2xl font-black text-green-600">
              KES {totalPrice.toLocaleString()}
            </span>
          </div>

          {/* M-Pesa Input */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              M-Pesa Phone Number
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="tel"
                placeholder="254712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
          </div>

          {message && (
            <div className={`text-sm rounded-lg px-4 py-3 mb-4 ${
              message.startsWith('✅')
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={paying}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition text-base"
          >
            <CreditCard size={20} />
            {paying ? 'Processing...' : 'Pay with M-Pesa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;