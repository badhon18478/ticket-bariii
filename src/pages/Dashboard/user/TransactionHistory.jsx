import { useEffect, useState } from 'react';
import axios from 'axios';
// import { useAuth } from '../../../contexts/AuthContext';
import { FaSearch, FaDownload, FaCircle } from 'react-icons/fa';
// import { AuthContext } from '../../../AuthContext';
import { useAuth } from '../../../contexts/AuthProvider';

const TransactionHistory = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/transactions/${user.email}`
        );
        setTransactions(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [user.email]);

  const filteredData = transactions.filter(
    t =>
      t.ticketTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <SkeletonTable />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-500 text-sm">
            Review and download your transaction records
          </p>
        </div>

        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID or Title..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Transaction Info
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map(t => (
              <tr
                key={t._id}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-800">{t.ticketTitle}</p>
                  <p className="text-xs text-gray-400 font-mono mt-1 uppercase tracking-tighter">
                    #{t.transactionId.slice(-12)}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center text-green-700 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">
                    ${t.amount.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(t.paymentDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download Invoice"
                  >
                    <FaDownload />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="p-20 text-center text-gray-500">
            No transactions found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

const SkeletonTable = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 w-48 mb-6 rounded"></div>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
      ))}
    </div>
  </div>
);

export default TransactionHistory;
