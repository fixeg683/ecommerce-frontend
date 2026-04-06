import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Lock, Mail } from 'lucide-react';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Go back to where they came from, or home
  const returnTo = location.state?.from || '/';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-green-600 mb-1">E-Space</h1>
          <p className="text-2xl font-extrabold text-gray-900 mt-4">Welcome Back</p>
          <p className="text-gray-500 text-sm mt-1">Log in to your E-Space account</p>
          {/* Show context message if redirected from cart */}
          {location.state?.from === '/cart' && (
            <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-2.5">
              🔒 Please log in to complete your purchase
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="email" name="email" placeholder="name@example.com"
                value={formData.email} onChange={handleChange} required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="password" name="password" placeholder="Enter your password"
                value={formData.password} onChange={handleChange} required
                autoComplete="current-password"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3 mt-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-2">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" state={{ from: returnTo }} className="text-green-600 font-bold hover:underline">
              Sign Up
            </Link>
          </p>
          <Link to="/" className="block text-sm text-gray-400 hover:text-green-600 transition">
            ← Continue browsing without logging in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;