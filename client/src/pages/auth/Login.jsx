import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

// 1. CHANGE the prop name here from `onNext` to `onVerified` to match App.jsx
export default function Login({ onVerified }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', formData);
      onVerified(data.token, data.user);
      setMessage('Login successful');

    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen pt-32 pb-16 flex flex-col justify-center items-center font-sans">
      <form
        onSubmit={handleLogin}
        className="max-w-md w-full p-8 bg-black rounded-2xl shadow-lg font-sans border border-teal-700"
        noValidate
      >
        <h2 className="text-3xl font-extrabold text-teal-600 mb-6 text-center">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          disabled={loading}
          aria-label="Email"
        />

        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full mb-6 px-4 py-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          disabled={loading}
          aria-label="Password"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-black transition ${loading
            ? 'bg-teal-400 cursor-not-allowed'
            : 'bg-teal-400 hover:bg-green-700 hover:text-white'
            }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {message && (
          <p className="mt-4 text-green-500 font-medium text-center">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-red-500 font-medium text-center">{error}</p>
        )}

        <p className="mt-6 text-center text-sm text-gray-400">
          New User?{' '}
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="text-teal-400 hover:text-teal-200 font-semibold"
            disabled={loading}
          >
            Signup
          </button>{' '}
          |{' '}
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-teal-400 hover:text-teal-200 font-semibold"
            disabled={loading}
          >
            Forgot Password?
          </button>
        </p>
      </form>
    </div>
  );
}