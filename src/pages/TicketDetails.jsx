// src/pages/TicketDetails/TicketDetails.jsx - COMPLETE FIXED VERSION

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaUsers,
  FaDollarSign,
  FaBus,
  FaTrain,
  FaShip,
  FaPlane,
  FaStar,
  FaCheckCircle,
  FaArrowLeft,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { MdOutlineAirlineSeatReclineExtra } from 'react-icons/md';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthProvider';
import BookingModal from '../components/tickets/BookingModal';

const TicketDetails = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  useEffect(() => {
    fetchTicket();
  }, [id]);

  useEffect(() => {
    if (!ticket) return;

    const calculateCountdown = () => {
      try {
        // Get departure date from ticket
        const departureDateTime = new Date(
          ticket.departureDateTime || ticket.departure || ticket.createdAt
        );
        const now = new Date();
        const difference = departureDateTime - now;

        if (difference <= 0) {
          setCountdown({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            expired: true,
          });
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds, expired: false });
      } catch (error) {
        console.error('Countdown error:', error);
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [ticket]);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching ticket with ID:', id);

      // If it's a mock ticket ID, create mock data
      if (id && id.includes('mock-')) {
        console.log('🛠️ Creating mock ticket for:', id);
        const mockTicket = createMockTicket(id);
        setTicket(mockTicket);
        return;
      }

      // Try the main API endpoint
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tickets/${id}`
      );

      console.log('✅ Ticket Response:', response.data);

      // Handle response structure
      let ticketData = null;

      if (response.data && response.data.success) {
        ticketData = response.data.ticket || response.data.data;
      } else if (response.data && response.data._id) {
        ticketData = response.data;
      }

      if (ticketData) {
        setTicket(ticketData);
      } else {
        throw new Error('Ticket data not found in response');
      }
    } catch (error) {
      console.error('❌ Error fetching ticket:', error);

      // Create mock data for development
      if (import.meta.env.DEV) {
        console.log('🛠️ Creating development mock ticket');
        const mockTicket = createMockTicket(id);
        setTicket(mockTicket);
        toast.success('Loaded mock ticket (Development Mode)');
      } else {
        toast.error('Ticket not found or server error');
        setTimeout(() => navigate('/all-tickets'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Mock ticket generator for development
  const createMockTicket = ticketId => {
    const transportTypes = ['bus', 'train', 'launch', 'plane'];
    const transportType = transportTypes[Math.floor(Math.random() * 4)];

    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + 7);
    departureDate.setHours(10, 0, 0, 0);

    return {
      _id: ticketId || 'mock-ticket-123',
      title: `${
        transportType.charAt(0).toUpperCase() + transportType.slice(1)
      } Service - Premium`,
      from: 'Dhaka',
      to: 'Chittagong',
      transportType: transportType,
      price: 850,
      ticketQuantity: 25,
      quantity: 25,
      departureDateTime: departureDate.toISOString(),
      departure: departureDate.toISOString(),
      image: `https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&h=600&q=80`,
      perks: ['AC', 'WiFi', 'Water', 'Snacks', 'Charging Port'],
      vendorName: 'Premium Express',
      vendorEmail: 'vendor@example.com',
      verificationStatus: 'approved',
      isHidden: false,
      isAdvertised: true,
      discount: 15,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handleBookingSuccess = () => {
    toast.success('Booking created successfully!');
    setShowModal(false);
    // Refresh ticket data to update available seats
    fetchTicket();
  };

  const formatDate = dateString => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid date';
    }
  };

  const transportIcons = {
    bus: FaBus,
    train: FaTrain,
    launch: FaShip,
    plane: FaPlane,
  };

  const transportColors = {
    bus: 'from-blue-500 to-blue-700',
    train: 'from-green-500 to-green-700',
    launch: 'from-cyan-500 to-cyan-700',
    plane: 'from-indigo-500 to-indigo-700',
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-gray-900 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF7A1B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading ticket details...
          </p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-gray-900 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Ticket Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              The ticket you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/all-tickets')}
              className="px-8 py-3 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Browse Available Tickets
            </button>
          </div>
        </div>
      </div>
    );
  }

  const TransportIcon = transportIcons[ticket.transportType] || FaBus;
  const transportColor =
    transportColors[ticket.transportType] || 'from-blue-500 to-blue-700';

  const availableSeats = ticket.ticketQuantity || ticket.quantity || 0;
  const isBookingDisabled =
    countdown.expired ||
    availableSeats === 0 ||
    ticket.verificationStatus !== 'approved' ||
    ticket.isHidden ||
    !user;

  const getBookingButtonText = () => {
    if (!user) return 'Login to Book Ticket';
    if (countdown.expired) return 'Booking Closed - Departure Passed';
    if (availableSeats === 0) return 'Sold Out';
    if (ticket.verificationStatus !== 'approved') return 'Ticket Not Approved';
    if (ticket.isHidden) return 'Ticket Unavailable';
    return 'Book Now';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/all-tickets')}
          className="mb-8 flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-[#FF7A1B] dark:hover:text-[#FFA53A] font-semibold transition-colors"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5 }}
        >
          <FaArrowLeft className="w-5 h-5" />
          <span>Back to All Tickets</span>
        </motion.button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left - Image & Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Ticket Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-800">
              <div className="relative h-80 md:h-96">
                <img
                  src={
                    ticket.image ||
                    `https://via.placeholder.com/800x600?text=${ticket.transportType}+Ticket`
                  }
                  alt={ticket.title}
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.target.src = `https://via.placeholder.com/800x600?text=${ticket.transportType}+Ticket`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />

                {/* Transport Badge */}
                <div className="absolute top-6 right-6">
                  <div
                    className={`bg-gradient-to-r ${transportColor} text-white px-6 py-3 rounded-full font-bold flex items-center gap-3 shadow-2xl`}
                  >
                    <TransportIcon className="w-6 h-6" />
                    <span className="text-lg">
                      {ticket.transportType?.toUpperCase() || 'TRANSPORT'}
                    </span>
                  </div>
                </div>

                {/* Verified Badge */}
                {ticket.verificationStatus === 'approved' && (
                  <div className="absolute top-6 left-6 bg-green-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 shadow-lg">
                    <FaCheckCircle className="w-5 h-5" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6">
                  {ticket.title || `${ticket.transportType} Service`}
                </h1>

                {/* Route Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FaMapMarkerAlt className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        Route
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {ticket.from || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            From
                          </p>
                        </div>
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-slate-700 dark:to-slate-700" />
                        <FaArrowLeft className="w-6 h-6 text-[#FF7A1B] rotate-180" />
                        <div className="flex-1 h-px bg-gradient-to-r from-indigo-200 to-blue-200 dark:from-slate-700 dark:to-slate-700" />
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {ticket.to || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            To
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <FaCalendarAlt className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Departure
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatDate(
                            ticket.departureDateTime || ticket.departure
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                        <MdOutlineAirlineSeatReclineExtra className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Available Seats
                        </p>
                        <p
                          className={`font-bold text-xl ${
                            availableSeats > 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {availableSeats} seats
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perks */}
                {ticket.perks && ticket.perks.length > 0 && (
                  <div>
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                      <FaStar className="text-yellow-500" />
                      Included Perks
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {ticket.perks.map((perk, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 p-3 rounded-xl border border-amber-200 dark:border-amber-800/30"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <FaCheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {perk}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vendor Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-800">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Operated by
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {ticket.vendorName || 'TicketBari Partner'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Booking Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Countdown Timer */}
            <div className="bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] rounded-3xl shadow-2xl p-6 md:p-8 text-white overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2 text-center">
                  {countdown.expired
                    ? '⏰ Departure Completed'
                    : '⏱️ Departure In'}
                </h3>
                <p className="text-center text-white/80 mb-6">
                  {countdown.expired
                    ? 'This journey has already departed'
                    : 'Book your seat before departure'}
                </p>

                {!countdown.expired && (
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      {
                        label: 'Days',
                        value: countdown.days,
                        color: 'bg-white/20',
                      },
                      {
                        label: 'Hours',
                        value: countdown.hours,
                        color: 'bg-white/25',
                      },
                      {
                        label: 'Minutes',
                        value: countdown.minutes,
                        color: 'bg-white/30',
                      },
                      {
                        label: 'Seconds',
                        value: countdown.seconds,
                        color: 'bg-white/35',
                      },
                    ].map((item, index) => (
                      <div key={index} className="text-center">
                        <div
                          className={`${item.color} rounded-2xl p-4 mb-2 backdrop-blur-sm`}
                        >
                          <p className="text-4xl md:text-5xl font-black">
                            {String(item.value).padStart(2, '0')}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">{item.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Price & Booking Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-200 dark:border-slate-800">
              {/* Price */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 dark:text-gray-400">
                    Ticket Price
                  </p>
                  {ticket.discount > 0 && (
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm font-bold">
                      {ticket.discount}% OFF
                    </span>
                  )}
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    {ticket.discount > 0 && (
                      <p className="text-lg text-gray-500 dark:text-gray-400 line-through mb-1">
                        ৳
                        {(
                          (ticket.price * 100) /
                          (100 - ticket.discount)
                        ).toFixed(2)}
                      </p>
                    )}
                    <p className="text-5xl font-black text-[#FF7A1B]">
                      ৳{ticket.price}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      per seat
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaDollarSign className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Booking Button */}
              <button
                onClick={() => (user ? setShowModal(true) : navigate('/login'))}
                disabled={isBookingDisabled && user}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  isBookingDisabled && user
                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white hover:shadow-2xl hover:-translate-y-1 active:scale-95'
                } ${!isBookingDisabled && 'shadow-lg'}`}
              >
                {getBookingButtonText()}
              </button>

              {/* Status Messages */}
              <div className="mt-6 space-y-2">
                {!user && (
                  <p className="text-center text-amber-600 dark:text-amber-400 text-sm">
                    Please login to book this ticket
                  </p>
                )}
                {user && isBookingDisabled && (
                  <div className="text-center">
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium mb-1">
                      {countdown.expired && 'This ticket has expired'}
                      {availableSeats === 0 && 'All seats have been sold'}
                      {ticket.verificationStatus !== 'approved' &&
                        'Ticket is pending approval'}
                      {ticket.isHidden &&
                        'This ticket is currently unavailable'}
                    </p>
                    {!countdown.expired && availableSeats > 0 && (
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        Check back soon for availability updates
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <BookingModal
          ticket={ticket}
          user={user}
          onClose={() => setShowModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default TicketDetails;
