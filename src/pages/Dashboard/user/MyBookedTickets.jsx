// src/pages/Dashboard/User/MyBookedTickets.jsx - COMPLETE WORKING VERSION

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaCreditCard,
  FaTicketAlt,
} from 'react-icons/fa';

const MyBookedTickets = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const firebaseUser = window.firebase?.auth()?.currentUser;
      if (!firebaseUser) {
        toast.error('Please login again');
        return;
      }

      const token = await firebaseUser.getIdToken();
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/my-bookings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('📋 Bookings:', response.data);
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async booking => {
    try {
      const firebaseUser = window.firebase?.auth()?.currentUser;
      if (!firebaseUser) {
        toast.error('Please login again');
        return;
      }

      const token = await firebaseUser.getIdToken();

      toast.loading('Creating payment session...');

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/create-checkout-session`,
        {
          bookingId: booking._id,
          amount: booking.totalPrice,
          quantity: booking.quantity,
          ticketTitle: booking.ticketTitle,
          userEmail: firebaseUser.email,
          userName: firebaseUser.displayName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.dismiss();

      if (response.data.success && response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to create payment session');
      }
    } catch (error) {
      toast.dismiss();
      console.error('❌ Payment Error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
    }
  };

  const calculateCountdown = departureDate => {
    try {
      const departure = new Date(departureDate);
      const now = new Date();
      const difference = departure - now;

      if (difference <= 0) return 'Departed';

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      return `${days}d ${hours}h`;
    } catch {
      return 'Invalid';
    }
  };

  const formatDate = dateString => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const statusConfig = {
    pending: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-700 dark:text-yellow-300',
      label: 'Pending',
    },
    accepted: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-300',
      label: 'Accepted',
    },
    rejected: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-300',
      label: 'Rejected',
    },
    paid: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      label: 'Paid ✓',
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-[#FF7A1B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] bg-clip-text text-transparent mb-2">
          My Booked Tickets
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}{' '}
          found
        </p>
      </motion.div>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {bookings.map((booking, index) => {
              const canPay =
                booking.status === 'accepted' &&
                booking.paymentStatus !== 'paid' &&
                new Date(booking.departure) > new Date();

              const status =
                statusConfig[booking.status] || statusConfig.pending;

              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-gray-200 dark:border-slate-800"
                >
                  <div className="relative h-48">
                    <img
                      src={
                        booking.image || 'https://via.placeholder.com/400x300'
                      }
                      alt={booking.ticketTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`${status.bg} ${status.text} px-4 py-2 rounded-full text-sm font-bold shadow-lg`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                      {booking.ticketTitle}
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaMapMarkerAlt className="w-4 h-4 text-[#FF7A1B]" />
                        <span className="text-sm">
                          {booking.from} → {booking.to}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaCalendarAlt className="w-4 h-4 text-[#FF7A1B]" />
                        <span className="text-sm">
                          {formatDate(booking.departure)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <FaClock className="w-4 h-4 text-[#FF7A1B]" />
                        <span className="text-sm">
                          {calculateCountdown(booking.departure)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-slate-700">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Quantity
                        </p>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {booking.quantity} seats
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Total
                        </p>
                        <p className="font-bold text-xl text-[#FF7A1B]">
                          ৳{booking.totalPrice}
                        </p>
                      </div>
                    </div>

                    {canPay && (
                      <button
                        onClick={() => handlePayment(booking)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                      >
                        <FaCreditCard className="w-5 h-5" />
                        Pay Now
                      </button>
                    )}

                    {booking.status === 'pending' && (
                      <p className="text-center text-sm text-gray-500">
                        Waiting for vendor confirmation
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl shadow-xl"
        >
          <FaTicketAlt className="w-16 h-16 text-gray-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            No Bookings Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start booking your journey today!
          </p>
          <motion.a
            href="/all-tickets"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white font-bold rounded-xl shadow-lg"
          >
            Browse Tickets
          </motion.a>
        </motion.div>
      )}
    </div>
  );
};

export default MyBookedTickets;
