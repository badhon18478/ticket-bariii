// ========== 4. RequestedBookings.jsx ==========
import { useEffect, useState } from 'react';
// import { useAuth } from '../../../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
// import { AuthContext } from '../../../AuthContext';
import { useAuth } from '../../../contexts/AuthProvider';

const RequestedBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/vendor/${user.email}`
      );
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async id => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}/accept`
      );
      toast.success('Booking accepted');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to accept booking');
    }
  };

  const handleReject = async id => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}/reject`
      );
      toast.success('Booking rejected');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to reject booking');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Requested Bookings</h1>

      {bookings.length > 0 ? (
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Ticket</th>
                <th className="px-6 py-3 text-left">Quantity</th>
                <th className="px-6 py-3 text-left">Total Price</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id} className="border-t">
                  <td className="px-6 py-4">
                    <p className="font-semibold">{booking.userName}</p>
                    <p className="text-sm text-gray-600">{booking.userEmail}</p>
                  </td>
                  <td className="px-6 py-4">{booking.ticketTitle}</td>
                  <td className="px-6 py-4">{booking.bookingQuantity}</td>
                  <td className="px-6 py-4 font-bold text-green-600">
                    ${booking.totalPrice}
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize">{booking.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    {booking.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAccept(booking._id)}
                          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(booking._id)}
                          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No booking requests</p>
      )}
    </div>
  );
};

export default RequestedBookings;
