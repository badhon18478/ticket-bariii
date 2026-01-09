import { useState, useEffect } from 'react';
// import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FiDollarSign, FiShoppingCart, FiPackage } from 'react-icons/fi';
import { useAuth } from '../../../contexts/AuthProvider';

const RevenueOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTicketsSold: 0,
    totalTicketsAdded: 0,
    monthlyRevenue: [],
    ticketsByType: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenueData();
  }, [user]);

  const fetchRevenueData = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/vendor/revenue/${user.email}`
      );
      setStats(data);
    } catch (error) {
      toast.error('Failed to fetch revenue data');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  // Sample data - replace with actual API data
  const monthlyData = [
    { month: 'Jan', revenue: 4000, tickets: 24 },
    { month: 'Feb', revenue: 3000, tickets: 18 },
    { month: 'Mar', revenue: 5000, tickets: 30 },
    { month: 'Apr', revenue: 4500, tickets: 27 },
    { month: 'May', revenue: 6000, tickets: 36 },
    { month: 'Jun', revenue: 5500, tickets: 33 },
  ];

  const transportData = [
    { name: 'Bus', value: 400 },
    { name: 'Train', value: 300 },
    { name: 'Launch', value: 200 },
    { name: 'Plane', value: 100 },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        Revenue Overview
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-2">Total Revenue</p>
              <h3 className="text-3xl font-bold">
                ${stats.totalRevenue.toFixed(2)}
              </h3>
              <p className="text-blue-100 text-sm mt-2">From all sales</p>
            </div>
            <FiDollarSign className="text-6xl text-blue-200 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-2">Tickets Sold</p>
              <h3 className="text-3xl font-bold">{stats.totalTicketsSold}</h3>
              <p className="text-green-100 text-sm mt-2">Total tickets sold</p>
            </div>
            <FiShoppingCart className="text-6xl text-green-200 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 mb-2">Tickets Added</p>
              <h3 className="text-3xl font-bold">{stats.totalTicketsAdded}</h3>
              <p className="text-purple-100 text-sm mt-2">Total listings</p>
            </div>
            <FiPackage className="text-6xl text-purple-200 opacity-50" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Monthly Revenue
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tickets Sold Trend */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Tickets Sold Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="tickets"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Transport Type Distribution */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Tickets by Transport Type
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={transportData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {transportData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Performance */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">
                Average Revenue/Month
              </span>
              <span className="text-xl font-bold text-primary">
                $
                {(
                  monthlyData.reduce((sum, m) => sum + m.revenue, 0) /
                  monthlyData.length
                ).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">
                Average Tickets/Month
              </span>
              <span className="text-xl font-bold text-green-600">
                {Math.round(
                  monthlyData.reduce((sum, m) => sum + m.tickets, 0) /
                    monthlyData.length
                )}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">
                Conversion Rate
              </span>
              <span className="text-xl font-bold text-purple-600">
                {(
                  (stats.totalTicketsSold / stats.totalTicketsAdded) * 100 || 0
                ).toFixed(1)}
                %
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueOverview;
