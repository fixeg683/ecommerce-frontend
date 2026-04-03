import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Components & Pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';

/**
 * App Component
 * Handles global Providers, Routing, and the main Layout Shell.
 */
function App() {
  return (
    <CartProvider>
      <Router>
        {/* Standard flex-column layout to fit screen and keep footer at bottom */}
        <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans antialiased">
          
          {/* Global Navigation Bar */}
          <Navbar />

          {/* Main Content Area - Strictly standard padding and max-width */}
          <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-12 md:px-8">
            <Routes>
              {/* --- Public Routes --- */}
              <Route path="/" element={<Home />} />
              
              {/* Product Details - e.g., /product/5 */}
              <Route path="/product/:id" element={<ProductDetail />} />
              
              {/* Shopping Cart View */}
              <Route path="/cart" element={<Cart />} />
              
              {/* Authentication */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* --- 404 Redirect --- */}
              {/* If a user types a wrong URL, send them back Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Persistent Footer */}
          <footer className="bg-white border-t border-gray-100 py-10 text-center text-gray-500 text-sm mt-auto">
            <div className="max-w-7xl mx-auto px-4">
              <p className="font-semibold text-gray-700 mb-2">E-Soko Marketplace</p>
              <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
              <div className="mt-4 flex justify-center gap-6">
                <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
                <a href="#" className="hover:text-blue-600 transition">Terms of Service</a>
                <a href="#" className="hover:text-blue-600 transition">Support</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;