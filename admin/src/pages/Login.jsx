import React, { useState } from 'react';
import api from '../api'; // Axios instance configured with backend base URL

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/admin/login', { username, password });
      // Pass token and user info upward to parent to update app state
      onLogin({ token: data.token, user: data.admin });
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg font-sans"
      noValidate
    >
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 text-center">
        Admin Login
      </h2>

      {/* Show error alert */}
      {error && (
        <p className="mb-4 text-center text-red-600 font-medium">{error}</p>
      )}

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        aria-label="Username"
        disabled={loading}
        className="w-full mb-5 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        aria-label="Password"
        disabled={loading}
        className="w-full mb-5 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold text-white transition ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        aria-live="polite"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
