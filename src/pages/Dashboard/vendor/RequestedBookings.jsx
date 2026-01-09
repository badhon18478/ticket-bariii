import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthProvider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiCheck, FiX } from 'react-icons/fi';

const RequestedBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequestedBookings();
  }, [user]);

  const fetchRequestedBookings = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/vendor/${user.email}`
      );
      setBookings(data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async bookingId => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}`,
        {
          status: 'accepted',
        }
      );
      toast.success('Booking accepted successfully');
      fetchRequestedBookings();
    } catch (error) {
      toast.error('Failed to accept booking');
    }
  };

  const handleReject = async bookingId => {
    if (!confirm('Are you sure you want to reject this booking?')) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}`,
        {
          status: 'rejected',
        }
      );
      toast.success('Booking rejected');
      fetchRequestedBookings();
    } catch (error) {
      toast.error('Failed to reject booking');
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'accepted':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'paid':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

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
        Requested Bookings
      </h2>

      {bookings.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No booking requests yet
          </p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ticket Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.map(booking => (
                <tr
                  key={booking._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {booking.userName}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {booking.userEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {booking.ticketTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {booking.bookingQuantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary">
                    ${booking.totalPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {booking.status === 'pending' ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAccept(booking._id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
                        >
                          <FiCheck />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleReject(booking._id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                        >
                          <FiX />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        {booking.status === 'accepted'
                          ? 'Awaiting Payment'
                          : 'Processed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Stats */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Pending</h3>
            <p className="text-3xl font-bold">
              {bookings.filter(b => b.status === 'pending').length}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Accepted</h3>
            <p className="text-3xl font-bold">
              {bookings.filter(b => b.status === 'accepted').length}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Paid</h3>
            <p className="text-3xl font-bold">
              {bookings.filter(b => b.status === 'paid').length}
            </p>
          </div>
          <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
            <h3 className="text-lg font-semibold mb-2">Rejected</h3>
            <p className="text-3xl font-bold">
              {bookings.filter(b => b.status === 'rejected').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestedBookings;
