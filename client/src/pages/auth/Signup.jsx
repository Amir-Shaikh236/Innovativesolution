import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    age: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const OnSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (parseInt(formData.age, 10) < 18) {
      setError('You must be at least 18 years old to signup.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', formData);

      setMessage(`Verification Email sent to your email: ${formData.email}`);
      navigate('/verify-email');
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.msg || 'Failed to send Email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen pt-32 pb-16 flex flex-col justify-center items-center font-sans">
      <form
        onSubmit={OnSubmit}
        className="max-w-md w-full p-8 bg-black rounded-2xl shadow-lg border border-teal-700"
        noValidate
      >
        <h2 className="text-2xl font-extrabold text-teal-600 mb-6 text-center">
          Signup - Request OTP
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        />

        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        />

        <input
          type="number"
          name="age"
          placeholder="Age (must be 18+)"
          value={formData.age}
          onChange={handleChange}
          min={18}
          required
          className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          minLength={6}
          className="w-full mb-6 px-4 py-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-black transition ${loading
            ? 'bg-teal-400 cursor-not-allowed'
            : 'bg-teal-400 hover:bg-green-700 hover:text-white'
            }`}
        >
          {loading ? 'Sending Email...' : 'Send Email'}
        </button>

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-400 font-semibold hover:underline">
            Login here.
          </Link>
        </p>

        {message && (
          <p className="mt-4 text-green-500 font-medium text-center">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-red-500 font-medium text-center">{error}</p>
        )}
      </form>
    </div>
  );
}