import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MessageSquare, TrendingUp, Users, AlertCircle, Star } from 'lucide-react';

const ChatbotAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);

      const res = await fetch(`/api/chatbot/analytics?${params}`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading analytics...</div>;

  if (!analytics) return <div className="text-center py-8">No analytics data available</div>;

  const COLORS = ['#40E0D0', '#FF6B6B', '#FFA07A', '#FFD700'];

  // Prepare data for charts
  const intentsData = Object.entries(analytics.intentsDistribution || {}).map(([key, value]) => ({
    name: key,
    value
  }));

  return (
    <div className="p-6 bg-gray-950 text-white rounded-lg">
      <h1 className="text-3xl font-bold mb-6" style={{ color: '#40E0D0' }}>Chatbot Analytics Dashboard</h1>

      {/* Date Range Filter */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
          className="px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
          className="px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white"
          placeholder="End Date"
        />
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 rounded font-semibold transition"
          style={{ background: '#40E0D0', color: 'black' }}
        >
          Apply Filter
        </button>
        <button
          onClick={() => setDateRange({ startDate: '', endDate: '' })}
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
        >
          Reset
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Total Conversations */}
        <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
          <div className="flex items-center gap-3">
            <MessageSquare size={32} style={{ color: '#40E0D0' }} />
            <div>
              <p className="text-gray-400 text-sm">Total Conversations</p>
              <p className="text-2xl font-bold">{analytics.totalConversations}</p>
            </div>
          </div>
        </div>

        {/* Escalated Conversations */}
        <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
          <div className="flex items-center gap-3">
            <AlertCircle size={32} style={{ color: '#FF6B6B' }} />
            <div>
              <p className="text-gray-400 text-sm">Escalated Cases</p>
              <p className="text-2xl font-bold">{analytics.escalatedCount}</p>
              <p className="text-xs text-gray-500">{analytics.escalationRate}</p>
            </div>
          </div>
        </div>

        {/* Average Rating */}
        <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
          <div className="flex items-center gap-3">
            <Star size={32} style={{ color: '#FFD700' }} />
            <div>
              <p className="text-gray-400 text-sm">Average Rating</p>
              <p className="text-2xl font-bold">{analytics.averageRating.toFixed(1)}/5</p>
              <p className="text-xs text-gray-500">{analytics.feedbackCount} ratings</p>
            </div>
          </div>
        </div>

        {/* User Engagement */}
        <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
          <div className="flex items-center gap-3">
            <Users size={32} style={{ color: '#40E0D0' }} />
            <div>
              <p className="text-gray-400 text-sm">Positive Messages</p>
              <p className="text-2xl font-bold">{analytics.trends.positiveMessages}</p>
              <p className="text-xs text-gray-500">{analytics.trends.negativeMessages} negative</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Intent Distribution */}
        {intentsData.length > 0 && (
          <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#40E0D0' }}>Intent Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={intentsData} cx="50%" cy="50%" labelLine={false} label>
                  {intentsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #40E0D0' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Sentiment Analysis */}
        <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4" style={{ color: '#40E0D0' }}>Sentiment Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[
              { name: 'Positive', value: analytics.trends.positiveMessages },
              { name: 'Negative', value: analytics.trends.negativeMessages }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #40E0D0' }} />
              <Bar dataKey="value" fill="#40E0D0" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="p-4 rounded-lg bg-gray-900 border border-gray-800">
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#40E0D0' }}>Recent Conversations</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="px-4 py-2 text-gray-400">Session ID</th>
                <th className="px-4 py-2 text-gray-400">Status</th>
                <th className="px-4 py-2 text-gray-400">Messages</th>
                <th className="px-4 py-2 text-gray-400">Rating</th>
                <th className="px-4 py-2 text-gray-400">Date</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentConversations?.slice(0, 10).map((conv, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800 transition">
                  <td className="px-4 py-2 text-gray-300 truncate max-w-xs">{conv.sessionId}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      conv.status === 'escalated' ? 'bg-red-900 text-red-200' :
                      conv.status === 'closed' ? 'bg-green-900 text-green-200' :
                      'bg-blue-900 text-blue-200'
                    }`}>
                      {conv.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-300">{conv.messages?.length || 0}</td>
                  <td className="px-4 py-2">
                    {conv.satisfactionRating ? (
                      <span style={{ color: '#FFD700' }}>★ {conv.satisfactionRating}/5</span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-400 text-xs">
                    {new Date(conv.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChatbotAnalyticsDashboard;
