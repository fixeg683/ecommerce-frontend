import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.from || '/';

  const [formData, setFormData] = useState({
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

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate(returnTo, { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-green-600">Nexusmall</h1>
          <p className="text-2xl font-bold mt-4">Welcome Back</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg"
          />

          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-green-600 font-bold">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;