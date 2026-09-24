import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState('form');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || 'https://backend-ecommerce-3-2hqt.onrender.com';
      const baseUrl = rawApiUrl.replace(/\/+$/, '');

      const res = await fetch(`${baseUrl}/api/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        throw new Error(
          `Server returned non-JSON response (${res.status}): ${text.slice(0, 80)}`
        );
      }

      if (!res.ok) {
        const errorMsg =
          data.detail ||
          (data.username && data.username[0]) ||
          (data.email && data.email[0]) ||
          (data.password && data.password[0]) ||
          'Registration failed';
        throw new Error(errorMsg);
      }

      setStep('confirm');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'confirm') {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 w-full max-w-md text-center">
          <h1 className="text-4xl font-black text-green-600 mb-1">Nexusmall</h1>
          <h2 className="text-2xl font-extrabold text-gray-900 mt-6">Check your email!</h2>
          <p className="my-4 text-gray-600">
            We have sent a confirmation link to <strong>{formData.email}</strong>.
          </p>
          <p className="text-sm text-gray-500">
            Please click the link in your email to activate your account before logging in.
          </p>
          <Link
            to="/login"
            className="inline-block mt-5 px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md no-underline font-medium transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-green-600 mb-1">Nexusmall</h1>
          <p className="text-2xl font-extrabold text-gray-900 mt-4">Create Account</p>
          <p className="text-gray-500 text-sm mt-1">Join Nexusmall and start shopping</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* USERNAME */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <p className="text-xs text-gray-400 mt-1 ml-1">Minimum 8 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 font-bold">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;