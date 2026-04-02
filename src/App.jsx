import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Components & Pages
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
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
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
          
          {/* Global Navigation Bar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
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

              {/* --- Protected Routes --- */}
              {/* Users must be logged in to access checkout */}
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              {/* --- 404 Redirect --- */}
              {/* If a user types a wrong URL, send them back Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Persistent Footer */}
          <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-500 text-sm">
            <div className="container mx-auto px-4">
              <p className="font-semibold text-gray-700 mb-2">E-Soko Marketplace</p>
              <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
              <div className="mt-4 flex justify-center gap-6">
                <a href="#" className="hover:text-blue-600">Privacy Policy</a>
                <a href="#" className="hover:text-blue-600">Terms of Service</a>
                <a href="#" className="hover:text-blue-600">Support</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;