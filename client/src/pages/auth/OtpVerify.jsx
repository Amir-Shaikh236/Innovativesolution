import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function OtpVerify() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('signupData'));
    if (!storedData) {
      setMessage('Signup data missing.');
      navigate('/register');
    } else {
      setFormData(storedData);
    }
  }, [navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setVerifying(true);
    try {
      const res = await api.post('/auth/verify-email', {
        ...formData,
        otp,
      });
      localStorage.removeItem('signupData');
      localStorage.setItem('token', res.data.token);

      setMessage('Signup successful! Redirecting...');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'OTP verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resending || !formData?.email) return;
    setResending(true);
    setError('');
    setMessage('');
    try {
      await api.post('/api/users/signup/request-otp', { email: formData.email });
      setMessage('OTP resent to your email.');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-black rounded-2xl shadow-lg font-sans border border-teal-700">
        <h2 className="text-2xl font-extrabold text-teal-600 mb-6 text-center">
          Verify OTP for {formData.email}
        </h2>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="w-full mb-5 px-4 py-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          />
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={verifying}
              className={`flex-grow py-3 rounded-lg font-semibold text-black transition ${verifying
                ? 'bg-teal-400 cursor-not-allowed'
                : 'bg-teal-400 hover:bg-green-700 hover:text-white'
                }`}
            >
              {verifying ? 'Verifying...' : 'Verify'}
            </button>
            <button
              type="button"
              disabled={resending}
              onClick={handleResend}
              className={`flex-grow py-3 rounded-lg font-semibold text-black transition ${resending
                ? 'bg-teal-400 cursor-not-allowed'
                : 'bg-teal-400 hover:bg-green-700 hover:text-white'
                }`}
            >
              {resending ? 'Resending...' : 'Resend OTP'}
            </button>
          </div>
        </form>
        {message && (
          <p className="mt-4 text-green-500 font-medium text-center">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-red-500 font-medium text-center">{error}</p>
        )}
      </div>
    </div>
  );
}