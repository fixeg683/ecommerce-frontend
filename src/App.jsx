import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Downloads from './pages/Downloads'; // ✅ ADD THIS

const AUTH_ROUTES = ['/login', '/signup'];

function AppLayout() {
  const location = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      {!isAuthPage && <Navbar />}
      {!isAuthPage && <CartDrawer />}

      <main className={
        isAuthPage
          ? 'flex-grow'
          : 'flex-grow w-full px-4 sm:px-6 lg:px-8 py-8'
      }>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route path="/cart" element={
            <ProtectedRoute><Cart /></ProtectedRoute>
          } />

          {/* ✅ NEW DOWNLOAD ROUTE */}
          <Route path="/downloads" element={
            <ProtectedRoute><Downloads /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAuthPage && (
        <footer className="py-4 text-center text-gray-400 text-xs border-t bg-white">
          &copy; 2026 E-Space Marketplace
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;