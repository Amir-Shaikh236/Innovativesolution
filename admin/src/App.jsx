import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Subpages from './pages/Subpages';
import FlipCards from './pages/FlipCards';
import AdminBlogPanel from './pages/AdminBlogPanel';
import PrivateRoute from './components/PrivateRoute';
import UserManagement from './pages/UserManagement';
import Subscriptions from './pages/Subscriptions';
import AdminLayout from './components/AdminLayout';
import api from './api';

function App() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
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

  const handleLogout = async () => {
    try {
      await api.post('/admin/admin-Logout');
    } catch (error) {
      console.error("Error logging out from server:", error);
    } finally {
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
        {/* Public Login Route */}
        <Route path="/login" element={!admin ? <Login onLogin={setAdmin} /> : <Navigate to="/" />} />
        <Route
          element={
            <PrivateRoute admin={admin}>
              <AdminLayout onLogout={handleLogout}>
                <Outlet />
              </AdminLayout>
            </PrivateRoute>
          }
        >

          <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/subpages" element={<Subpages />} />
          <Route path="/flipcards" element={<FlipCards />} />
          <Route path="/blogs" element={<AdminBlogPanel />} />
          <Route path="/manage-users" element={<UserManagement />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;