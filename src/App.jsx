import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Components & Pages
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <CartProvider>
      <Router>
        {/* min-h-screen + flex-col forces the layout to take 100% height */}
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
          
          <Navbar />

          {/* flex-grow ensures this section takes up all remaining vertical space */}
          <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Default Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-400 text-sm">
            <div className="container mx-auto px-4">
              <p className="font-medium text-gray-600 mb-1">E-Soko Marketplace</p>
              <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;