// ========== 5. RevenueOverview.jsx ==========
import { useEffect, useState } from 'react';
// import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
// import { AuthContext } from '../../../AuthContext';
import { useAuth } from '../../../contexts/AuthProvider';

const RevenueOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalTicketsSold: 0,
    totalTicketsAdded: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/vendor/stats/${user.email}`
      );
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: 'Revenue', value: stats.totalRevenue },
    { name: 'Tickets Sold', value: stats.totalTicketsSold },
    { name: 'Tickets Added', value: stats.totalTicketsAdded },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Revenue Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Total Revenue</p>
          <p className="text-4xl font-bold text-green-600">
            ${stats.totalRevenue}
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Total Tickets Sold</p>
          <p className="text-4xl font-bold text-blue-600">
            {stats.totalTicketsSold}
          </p>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Total Tickets Added</p>
          <p className="text-4xl font-bold text-purple-600">
            {stats.totalTicketsAdded}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Statistics Chart</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueOverview;
