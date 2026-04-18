import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

function Signup() {
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.from || '/';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ✅ SIGNUP
      await signup(formData.name, formData.email, formData.password);

      // ✅ LOGIN AFTER SIGNUP (IMPORTANT FIX: use username)
      await login(formData.name, formData.password);

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
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Username"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-bold">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;