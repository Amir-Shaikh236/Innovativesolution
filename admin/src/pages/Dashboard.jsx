import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Layers, CreditCard, Activity } from 'lucide-react';
import api from '../api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    blogs: 0,
    subscriptions: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get('/admin/dashboard-stats');
        setStats({
          categories: response.data.categories || 0,
          blogs: response.data.blogs || 0,
          subscriptions: response.data.subscriptions || 0,
          users: response.data.users || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here is what's happening with your platform today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card className="bg-emerald-600 border-none text-white shadow-sm relative overflow-hidden rounded-2xl">
          <CardContent className="py-4 px-5 relative z-10 flex flex-col justify-center h-full">
            <p className="text-emerald-100 text-sm font-medium mb-0.5">Total Categories</p>
            <CardTitle className="text-3xl font-bold">
              {loading ? "..." : stats.categories}
            </CardTitle>
          </CardContent>
          <Layers className="absolute -right-2 -bottom-4 h-24 w-24 text-emerald-500 opacity-50" />
        </Card>

        {/* Card 2: Blogs */}
        <Card className="bg-white border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
          <CardContent className="py-4 px-5 flex items-center gap-4 h-full">
            <div className="h-11 w-11 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-[13px] font-medium mb-0.5">Active Blogs</p>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stats.blogs}
              </CardTitle>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Subscriptions */}
        <Card className="bg-white border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
          <CardContent className="py-4 px-5 flex items-center gap-4 h-full">
            <div className="h-11 w-11 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-[13px] font-medium mb-0.5">Subscriptions</p>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stats.subscriptions}
              </CardTitle>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Users */}
        <Card className="bg-white border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
          <CardContent className="py-4 px-5 flex items-center gap-4 h-full">
            <div className="h-11 w-11 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-500 text-[13px] font-medium mb-0.5">Total Users</p>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {loading ? "..." : stats.users}
              </CardTitle>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* 🚨 BOTTOM PANELS USING SHADCN CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Chart Area */}
        <Card className="lg:col-span-2 bg-white border-gray-100 shadow-sm rounded-2xl min-h-[350px] flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold text-gray-900">Analytics Chart</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-6 pt-4">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <Activity className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm mt-1 max-w-xs">Connect your backend API here to display real-time traffic or user growth charts.</p>
          </CardContent>
        </Card>

        {/* Recent Activity Panel */}
        <Card className="bg-white border-gray-100 shadow-sm rounded-2xl min-h-[350px]">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-gray-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="h-2 w-2 mt-2 rounded-full bg-emerald-500 shrink-0"></div>
                <p className="text-sm text-gray-600">New user <span className="font-semibold text-gray-900">John Doe</span> registered.</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

    </div>
  );
}