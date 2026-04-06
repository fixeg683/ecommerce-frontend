import { X, Trash2, Plus, Minus, ShoppingBag, ImageOff } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL =
  import.meta.env.VITE_API_URL || 'https://backend-ecommerce-3-href.onrender.com';

const getImageUrl = (item) => {
  if (item.image_url) return item.image_url;
  if (!item.image) return null;
  if (item.image.startsWith('http')) return item.image;
  return `${BACKEND_URL}${item.image}`;
};

const CartDrawer = () => {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  if (!cartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
            {totalItems > 0 && (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-grow overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-300 py-24">
              <ShoppingBag size={64} />
              <p className="text-lg font-medium text-gray-400">Your cart is empty</p>
              <button
                onClick={() => setCartOpen(false)}
                className="text-sm text-green-600 font-semibold hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const imageUrl = getImageUrl(item);
              return (
                <div key={item.id} className="flex items-center gap-4 bg-gray-50 rounded-xl p-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.name} className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageOff size={20} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-green-600 font-bold text-sm">
                      KES {Number(item.price).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition">
                        <Minus size={11} />
                      </button>
                      <span className="text-sm font-bold w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition">
                        <Plus size={11} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-800">
                      KES {(Number(item.price) * item.quantity).toLocaleString()}
                    </p>
                    <button onClick={() => removeFromCart(item.id)}
                      className="mt-1.5 text-red-400 hover:text-red-600 transition">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 font-medium">Total</span>
              <span className="text-2xl font-black text-gray-900">
                KES {totalPrice.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => { setCartOpen(false); navigate('/cart'); }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition text-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;