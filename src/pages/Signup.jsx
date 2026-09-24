import React, { useState } from 'react';

export default function Signup() {
  const [step, setStep] = useState('signup');
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const rawApiUrl = import.meta.env.VITE_API_URL || 'https://backend-ecommerce-3-2hqt.onrender.com';
  const cleanBaseUrl = rawApiUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');

  const parseResponse = async (res, fallbackMessage) => {
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Server returned non-JSON response (${res.status}). ${fallbackMessage}`);
    }
    return data;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfoMessage('');

    try {
      const res = await fetch(`${cleanBaseUrl}/api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });
      const data = await parseResponse(res, 'Verify backend route.');

      if (!res.ok) {
        throw new Error(
          data.detail ||
            (data.username && data.username[0]) ||
            (data.email && data.email[0]) ||
            (data.password && data.password[0]) ||
            'Registration failed. Please check your credentials.'
        );
      }

      setStep('confirm');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${cleanBaseUrl}/api/verify-code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: formData.email.trim(), code: code.trim() }),
      });
      const data = await parseResponse(res, '');

      if (!res.ok) {
        throw new Error(data.detail || 'Invalid or expired verification code.');
      }

      setStep('verified');
    } catch (err) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setInfoMessage('');

    try {
      const res = await fetch(`${cleanBaseUrl}/api/resend-code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: formData.email.trim() }),
      });
      const data = await parseResponse(res, '');

      if (!res.ok) {
        throw new Error(data.detail || 'Could not resend verification code.');
      }

      setInfoMessage('A new verification code has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Could not resend verification code.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>Nexusmall</h1>
        {error && <div style={styles.errorBox}>{error}</div>}
        {infoMessage && <div style={styles.infoBox}>{infoMessage}</div>}

        {step === 'signup' && (
          <form onSubmit={handleRegister} style={styles.form}>
            <h2 style={styles.title}>Create Account</h2>
            <p style={styles.subtitle}>Join Nexusmall and start shopping</p>
            <input type="text" placeholder="Username" required value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} style={styles.input} />
            <input type="email" placeholder="Email address" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={styles.input} />
            <input type="password" placeholder="Password" required minLength={8} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={styles.input} />
            <span style={styles.helperText}>Minimum 8 characters</span>
            <button type="submit" disabled={loading} style={styles.button}>{loading ? 'Creating Account...' : 'Sign Up'}</button>
            <p style={styles.footerText}>Already have an account? <a href="/login" style={styles.link}>Login</a></p>
          </form>
        )}

        {step === 'confirm' && (
          <form onSubmit={handleVerifyCode} style={styles.form}>
            <h2 style={styles.title}>Verify your email</h2>
            <p style={styles.subtitle}>We sent a 6-digit code to <strong>{formData.email}</strong>.</p>
            <input type="text" maxLength={6} placeholder="1 2 3 4 5 6" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} style={styles.otpInput} autoFocus required />
            <button type="submit" disabled={loading || code.length !== 6} style={{ ...styles.button, opacity: code.length === 6 ? 1 : 0.6, cursor: code.length === 6 ? 'pointer' : 'not-allowed' }}>{loading ? 'Verifying...' : 'Confirm Code'}</button>
            <button type="button" onClick={handleResendCode} style={styles.textButton}>Didn't receive the code? Resend</button>
          </form>
        )}

        {step === 'verified' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ ...styles.title, color: '#22c55e' }}>Account Verified!</h2>
            <p style={{ ...styles.subtitle, margin: '16px 0 24px' }}>Your email has been confirmed. You can now log in to Nexusmall.</p>
            <a href="/login" style={{ ...styles.button, display: 'inline-block', textDecoration: 'none' }}>Proceed to Login</a>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f10', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  card: { width: '100%', maxWidth: '420px', backgroundColor: '#18181b', borderRadius: '12px', padding: '36px 30px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)', textAlign: 'center' },
  logo: { color: '#22c55e', fontSize: '28px', fontWeight: '800', marginBottom: '18px' },
  title: { color: '#ffffff', fontSize: '22px', fontWeight: '700', margin: '0 0 6px' },
  subtitle: { color: '#9ca3af', fontSize: '14px', margin: '0 0 20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' },
  input: { width: '100%', padding: '13px 15px', backgroundColor: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#ffffff', fontSize: '15px', outline: 'none', boxSizing: 'border-box' },
  otpInput: { width: '100%', padding: '14px', backgroundColor: '#27272a', border: '1px solid #3f3f46', borderRadius: '8px', color: '#ffffff', fontSize: '24px', letterSpacing: '10px', textAlign: 'center', fontWeight: 'bold', outline: 'none', boxSizing: 'border-box', margin: '8px 0' },
  helperText: { color: '#71717a', fontSize: '12px', marginTop: '-4px', marginBottom: '6px' },
  button: { width: '100%', padding: '14px', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s', boxSizing: 'border-box' },
  textButton: { background: 'none', border: 'none', color: '#22c55e', fontSize: '14px', cursor: 'pointer', textDecoration: 'none', marginTop: '8px', textAlign: 'center' },
  footerText: { color: '#a1a1aa', fontSize: '14px', textAlign: 'center', marginTop: '16px', marginBottom: 0 },
  link: { color: '#22c55e', textDecoration: 'none', fontWeight: '600' },
  errorBox: { backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' },
  infoBox: { backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', color: '#4ade80', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', textAlign: 'center' },
};