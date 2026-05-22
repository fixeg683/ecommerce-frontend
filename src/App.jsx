import React from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

// Contexts
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Downloads from './pages/Downloads';
import PaymentSuccess from './pages/PaymentSuccess';

// Toast
import { Toaster } from 'react-hot-toast';

const AUTH_ROUTES = ['/login', '/signup'];

function AppLayout() {
  const location = useLocation();

  const isAuthPage = AUTH_ROUTES.includes(
    location.pathname
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        reverseOrder={false}
      />

      {/* Navbar + Cart */}
      {!isAuthPage && <Navbar />}
      {!isAuthPage && <CartDrawer />}

      {/* Main Content */}
      <main
        className={
          isAuthPage
            ? 'flex-grow'
            : 'flex-grow w-full px-4 sm:px-6 lg:px-8 py-8'
        }
      >
        <Routes>

          {/* Public Routes */}
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/downloads"
            element={
              <ProtectedRoute>
                <Downloads />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment-success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />

          {/* Redirect Unknown Routes */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </main>

      {/* Footer */}
      {!isAuthPage && (
        <footer className="py-4 text-center text-gray-400 text-xs border-t bg-white">
          © 2026 Nexusmall Marketplace
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppLayout />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;