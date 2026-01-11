// src/components/Modal/BookingModal.jsx - NETWORK ERROR FIXED

import { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const BookingModal = ({ ticket, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();

    const availableQuantity = ticket.ticketQuantity || ticket.quantity || 0;

    if (quantity > availableQuantity) {
      toast.error(`Only ${availableQuantity} seats available`);
      return;
    }

    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    setLoading(true);

    try {
      // Get Firebase Auth instance
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        toast.error('Please login again');
        setLoading(false);
        return;
      }

      console.log('🔑 Getting Firebase token...');

      // Get fresh Firebase token
      const token = await currentUser.getIdToken(true);

      console.log('✅ Token received:', token ? 'Yes' : 'No');

      const bookingData = {
        ticketId: ticket._id,
        quantity: parseInt(quantity),
        ticketTitle: ticket.title,
        from: ticket.from,
        to: ticket.to,
        transportType: ticket.transportType || 'bus',
        unitPrice: ticket.price,
        totalPrice: ticket.price * parseInt(quantity),
        departure: ticket.departureDateTime || ticket.departure,
        image: ticket.image,
        vendorEmail: ticket.vendorEmail,
        vendorName: ticket.vendorName,
      };

      console.log('📦 Booking Data:', bookingData);
      console.log(
        '🌐 API URL:',
        `${import.meta.env.VITE_API_URL}/api/bookings`
      );

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log('✅ Booking Response:', response.data);

      if (response.data.success) {
        toast.success('Booking created successfully! 🎉');
        onSuccess();
        onClose();
      } else {
        throw new Error(response.data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('❌ Complete Error:', error);

      let errorMessage = 'Booking failed. Please try again.';

      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection.';
      } else if (error.response) {
        // Server responded with error
        console.error('Server Error:', error.response.data);
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response
        console.error('No Response Error:', error.request);
        errorMessage =
          'Cannot connect to server. Please check:\n1. Server is running\n2. API URL is correct\n3. CORS is enabled';
      } else {
        // Other errors
        console.error('Error:', error.message);
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = (ticket.price * quantity).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Book Ticket
        </h2>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-lg mb-2 text-gray-800 dark:text-white">
            {ticket.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            {ticket.from} → {ticket.to}
          </p>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            ৳{ticket.price}{' '}
            <span className="text-sm text-gray-500">per seat</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Available:{' '}
            <span className="font-semibold text-green-600">
              {ticket.ticketQuantity || ticket.quantity || 0} seats
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Tickets
            </label>
            <input
              type="number"
              min="1"
              max={ticket.ticketQuantity || ticket.quantity || 1}
              value={quantity}
              onChange={e =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Total Amount:
              </span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ৳{totalPrice}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition font-semibold text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white rounded-xl hover:shadow-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Booking...
                </span>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
