import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Subpages from './pages/Subpages';
import FlipCards from './pages/FlipCards';
import AdminBlogPanel from './pages/AdminBlogPanel';
import PrivateRoute from './components/PrivateRoute';
import UserManagement from './pages/UserManagement';
import Subscriptions from './pages/Subscriptions';
import api from './api';

function App() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // Optional: Good to prevent flickering

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        // This request will automatically send the httpOnly cookie to the backend
        const res = await api.get('/admin/getadmin');

        if (res.data && res.data.admin) {
          setAdmin(res.data.admin);
        }
      } catch (err) {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  // 2. Secure Logout
  const handleLogout = async () => {
    try {
      // Tell the backend to clear the httpOnly cookie
      await api.post('/admin-Logout');
    } catch (error) {
      console.error("Error logging out from server:", error);
    } finally {
      // Clear the React state whether the server request succeeds or fails
      setAdmin(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-semibold text-gray-700">Verifying session...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!admin ? <Login onLogin={setAdmin} /> : <Navigate to="/" />} />

        <Route
          path="/"
          element={
            <PrivateRoute admin={admin}>
              <Dashboard onLogout={handleLogout} />
            </PrivateRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <PrivateRoute admin={admin}>
              <Categories />
            </PrivateRoute>
          }
        />

        <Route
          path="/subpages"
          element={
            <PrivateRoute admin={admin}>
              <Subpages />
            </PrivateRoute>
          }
        />

        <Route
          path="/flipcards"
          element={
            <PrivateRoute admin={admin}>
              <FlipCards />
            </PrivateRoute>
          }
        />

        <Route
          path="/blogs"
          element={
            <PrivateRoute admin={admin}>
              <AdminBlogPanel />
            </PrivateRoute>
          }
        />

        <Route
          path="/manage-users"
          element={
            <PrivateRoute admin={admin}>
              <UserManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/subscriptions"
          element={
            <PrivateRoute admin={admin}>
              <Subscriptions />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;