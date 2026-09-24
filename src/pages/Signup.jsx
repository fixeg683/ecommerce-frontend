import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import API from '../api/axios';

function Signup() {
  const { register } = useAuth();

  const [step, setStep] = useState('signup');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [verificationCode, setVerificationCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setStep('confirm');
      setSuccess('A 6-digit verification code has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await API.post('verify-code/', {
        email: formData.email,
        code: verificationCode,
      });

      setSuccess(response.data.message);
      setStep('success');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');

    try {
      const response = await API.post('resend-code/', { email: formData.email });
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not resend the code.');
    }
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 w-full max-w-md text-center">
          <h1 className="text-4xl font-black text-green-600 mb-1">Nexusmall</h1>
          <h2 className="text-2xl font-extrabold text-gray-900 mt-6">Verified!</h2>
          <p className="my-4 text-gray-600">{success}</p>
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

  if (step === 'confirm') {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-green-600 mb-1">Nexusmall</h1>
            <p className="text-2xl font-extrabold text-gray-900 mt-4">Verify your email</p>
            <p className="text-gray-500 text-sm mt-2">We sent a 6-digit code to <strong>{formData.email}</strong>.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
            <input
              type="text"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              required
              className="w-full px-4 py-3 border rounded-lg text-center tracking-[0.5em] text-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <button
              type="submit"
              disabled={loading || verificationCode.length !== 6}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Verifying…' : 'Confirm Code'}
            </button>

            <button
              type="button"
              onClick={handleResend}
              className="text-green-600 font-medium underline"
            >
              Didn&apos;t receive the code? Resend
            </button>
          </form>
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
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

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