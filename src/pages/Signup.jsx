import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

function Signup() {
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.from || '/';

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(formData.name, formData.email, formData.password);
      // Auto-login after signup then redirect back
      await login(formData.email, formData.password);
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-green-600 mb-1">E-Space</h1>
          <p className="text-2xl font-extrabold text-gray-900 mt-4">Create Account</p>
          <p className="text-gray-500 text-sm mt-1">Join E-Space and start shopping</p>
          {location.state?.from === '/cart' && (
            <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-2.5">
              🔒 Create an account to complete your purchase
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
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text" name="name" placeholder="John Doe"
              onChange={handleChange} required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email" name="email" placeholder="name@example.com"
              onChange={handleChange} required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password" name="password" placeholder="Create a strong password"
              onChange={handleChange} required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3 mt-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-2">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" state={{ from: returnTo }} className="text-green-600 font-bold hover:underline">
              Login
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

export default Signup;