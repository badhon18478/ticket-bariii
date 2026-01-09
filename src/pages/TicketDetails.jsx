// ========== ULTIMATE TicketDetails.jsx - Premium Design ==========
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FaBus,
  FaTrain,
  FaShip,
  FaPlane,
  FaClock,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaCheckCircle,
  FaUser,
  FaShieldAlt,
  FaWifi,
  FaSnowflake,
  FaUtensils,
  FaBed,
  FaTv,
  FaPhoneAlt,
  FaCalendarAlt,
  FaArrowLeft,
  FaShareAlt,
  FaHeart,
  FaTag,
  FaFire,
  FaStar,
  FaChevronRight,
  FaExclamationCircle,
  FaLock,
  FaMoneyBillWave,
} from 'react-icons/fa';
import { FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatDistanceToNow, format, isValid } from 'date-fns';
import { useAuth } from '../contexts/AuthProvider';

const TicketDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [bookingQuantity, setBookingQuantity] = useState(1);
  const [timeLeft, setTimeLeft] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [similarTickets, setSimilarTickets] = useState([]);

  // Helper function to check if date is valid
  const isValidDate = dateString => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  // Helper function to format date safely
  const safeFormatDate = (dateString, formatString) => {
    if (!dateString || !isValidDate(dateString)) {
      return 'Date not available';
    }
    const date = new Date(dateString);
    return isValid(date) ? format(date, formatString) : 'Date not available';
  };

  // Helper function for distance to now
  const safeDistanceToNow = dateString => {
    if (!dateString || !isValidDate(dateString)) {
      return 'Date not available';
    }
    const date = new Date(dateString);
    return isValid(date)
      ? formatDistanceToNow(date, { addSuffix: true })
      : 'Date not available';
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  useEffect(() => {
    if (
      ticket &&
      ticket.departureDateTime &&
      isValidDate(ticket.departureDateTime)
    ) {
      const interval = setInterval(() => {
        const now = new Date();
        const departure = new Date(ticket.departureDateTime);

        if (now >= departure) {
          setTimeLeft('Departed');
          clearInterval(interval);
        } else {
          setTimeLeft(safeDistanceToNow(ticket.departureDateTime));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [ticket]);

  const fetchTicket = async () => {
    setLoading(true);
    try {
      // Try to fetch from API
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tickets/${id}`
      );
      setTicket(response.data);

      // Mock similar tickets
      setSimilarTickets(generateSimilarTickets(response.data));
    } catch (error) {
      console.log('Using mock data');
      // Fallback to mock data
      setTicket(generateMockTicket());
      setSimilarTickets(generateSimilarTickets());
    } finally {
      setLoading(false);
    }
  };

  const generateMockTicket = () => {
    return {
      _id: id,
      title: 'Premium AC Bus Service - Dhaka to Chittagong',
      from: 'Dhaka',
      to: 'Chittagong',
      price: 850,
      ticketQuantity: 12,
      departureDateTime: new Date(
        Date.now() + 48 * 60 * 60 * 1000
      ).toISOString(),
      transportType: 'bus',
      image:
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      vendorName: 'Green Line Paribahan',
      vendorEmail: 'greenline@example.com',
      perks: [
        'AC',
        'WiFi',
        'Water Bottle',
        'Snacks',
        'Charging Port',
        'Entertainment',
      ],
      description:
        'Experience luxury travel with our premium AC bus service. Comfortable reclining seats, onboard entertainment, and professional staff ensure a pleasant journey.',
      isPremium: true,
      isAdvertised: true,
      discount: 15,
      rating: 4.8,
      totalReviews: 124,
      amenities: [
        { icon: <FaWifi />, name: 'Free WiFi' },
        { icon: <FaSnowflake />, name: 'AC' },
        { icon: <FaUtensils />, name: 'Snacks' },
        { icon: <FaBed />, name: 'Recliner Seats' },
        { icon: <FaTv />, name: 'TV' },
        { icon: <FaPhoneAlt />, name: 'Charging Port' },
      ],
    };
  };

  const generateSimilarTickets = currentTicket => {
    return Array.from({ length: 4 }, (_, i) => ({
      _id: `similar-${i}`,
      title: `${currentTicket?.transportType || 'Bus'} Service ${i + 1}`,
      from: currentTicket?.from || 'Dhaka',
      to: ['Chittagong', 'Sylhet', "Cox's Bazar", 'Rajshahi'][i],
      price: 650 + i * 50,
      transportType: currentTicket?.transportType || 'bus',
      image: `https://images.unsplash.com/photo-${
        ['1544620347', '1593642632827', '1566836610', '1512295767273'][i]
      }?auto=format&fit=crop&w=500&q=80`,
      ticketQuantity: 8 + i,
      isAdvertised: i === 0,
    }));
  };

  const handleBooking = async e => {
    e.preventDefault();

    if (bookingQuantity > ticket.ticketQuantity) {
      toast.error('Not enough tickets available');
      return;
    }

    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        ticketId: ticket._id,
        ticketTitle: ticket.title,
        userEmail: user.email,
        userName: user.displayName,
        vendorEmail: ticket.vendorEmail,
        bookingQuantity,
        unitPrice: ticket.price,
        totalPrice: ticket.price * bookingQuantity,
        from: ticket.from,
        to: ticket.to,
        departureDateTime: ticket.departureDateTime,
        image: ticket.image,
      });

      toast.success('🎉 Booking request sent successfully!');
      setShowModal(false);
      setBookingQuantity(1);
      navigate('/dashboard/my-bookings');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to create booking');
    }
  };

  const isBookingDisabled = () => {
    if (!ticket) return true;
    if (!user) return true;

    const now = new Date();
    let departure;

    if (ticket.departureDateTime && isValidDate(ticket.departureDateTime)) {
      departure = new Date(ticket.departureDateTime);
      if (now >= departure) return true;
    }

    return ticket.ticketQuantity === 0;
  };

  const getTransportIcon = type => {
    const icons = {
      bus: <FaBus className="w-6 h-6" />,
      train: <FaTrain className="w-6 h-6" />,
      launch: <FaShip className="w-6 h-6" />,
      plane: <FaPlane className="w-6 h-6" />,
    };
    return icons[type?.toLowerCase()] || <FaBus className="w-6 h-6" />;
  };

  const getTransportColor = type => {
    const colors = {
      bus: 'from-blue-500 to-blue-700',
      train: 'from-green-500 to-green-700',
      launch: 'from-cyan-500 to-cyan-700',
      plane: 'from-indigo-500 to-indigo-700',
    };
    return colors[type?.toLowerCase()] || 'from-gray-500 to-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-gray-900">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-[#FFA53A] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
            Loading ticket details...
          </p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-gray-900">
        <div className="text-center max-w-md mx-auto px-4">
          <FaExclamationCircle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Ticket Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The ticket you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/all-tickets"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <FaArrowLeft /> Browse All Tickets
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = ticket.price * bookingQuantity;
  const discountAmount = ticket.discount
    ? (totalPrice * ticket.discount) / 100
    : 0;
  const finalPrice = totalPrice - discountAmount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#FF7A1B] transition-colors"
          >
            <FaArrowLeft /> Back to Tickets
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details (2/3) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative h-80 md:h-96">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-wrap gap-3">
                  <div
                    className={`px-4 py-2 bg-gradient-to-r ${getTransportColor(
                      ticket.transportType
                    )} text-white rounded-xl font-bold flex items-center gap-2`}
                  >
                    {getTransportIcon(ticket.transportType)}
                    <span className="capitalize">{ticket.transportType}</span>
                  </div>
                  {ticket.isPremium && (
                    <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold flex items-center gap-2">
                      <FaStar /> PREMIUM
                    </div>
                  )}
                  {ticket.isAdvertised && (
                    <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold flex items-center gap-2">
                      <FaFire /> FEATURED
                    </div>
                  )}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"
                >
                  <FaHeart
                    className={`w-6 h-6 ${
                      isFavorite ? 'text-red-500 fill-current' : 'text-white'
                    }`}
                  />
                </button>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    {ticket.title}
                  </h1>
                  <div className="flex items-center gap-6 text-lg">
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#FFA53A]" />
                      <span className="font-bold">{ticket.from}</span>
                    </div>
                    <FaChevronRight className="text-[#FFA53A]" />
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#FFA53A]" />
                      <span className="font-bold">{ticket.to}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Departure
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {safeFormatDate(
                      ticket.departureDateTime,
                      'EEE, MMM dd • hh:mm a'
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Departs In
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] bg-clip-text text-transparent">
                    {timeLeft || 'Date not available'}
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    Available Seats
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {ticket.ticketQuantity} seats
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vendor Info */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <FaUser className="text-[#FF7A1B]" />
                  Vendor Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Vendor Name
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {ticket.vendorName}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Contact Email
                    </div>
                    <div className="text-lg text-gray-700 dark:text-gray-300">
                      {ticket.vendorEmail}
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                  <FaCheckCircle className="text-[#FF7A1B]" />
                  Amenities & Features
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {ticket.perks?.map((perk, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl"
                    >
                      <FaCheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {perk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            {ticket.description && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {ticket.description}
                </p>
              </div>
            )}

            {/* Similar Tickets */}
            {similarTickets.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Similar Tickets
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {similarTickets.map((similar, idx) => (
                    <Link
                      key={similar._id}
                      to={`/ticket/${similar._id}`}
                      className="group bg-gray-50 dark:bg-slate-800 rounded-2xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${getTransportColor(
                            similar.transportType
                          )} flex items-center justify-center`}
                        >
                          {getTransportIcon(similar.transportType)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white group-hover:text-[#FF7A1B] transition-colors">
                            {similar.from} → {similar.to}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {similar.transportType}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-[#FF7A1B]">
                          ৳{similar.price}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {similar.ticketQuantity} seats
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking (1/3) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-slate-800">
              {/* Price Header */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] bg-clip-text text-transparent mb-2">
                  ৳{ticket.price}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  per ticket
                </div>
              </div>

              {/* Booking Form */}
              <div className="space-y-6">
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Tickets
                  </label>
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                    <button
                      onClick={() =>
                        bookingQuantity > 1 &&
                        setBookingQuantity(bookingQuantity - 1)
                      }
                      className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      <span className="text-xl">-</span>
                    </button>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {bookingQuantity}
                    </div>
                    <button
                      onClick={() =>
                        bookingQuantity < ticket.ticketQuantity &&
                        setBookingQuantity(bookingQuantity + 1)
                      }
                      className="w-10 h-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      <span className="text-xl">+</span>
                    </button>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Max: {ticket.ticketQuantity} tickets
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 bg-gray-50 dark:bg-slate-800 rounded-xl p-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Base Price
                    </span>
                    <span className="font-medium">
                      ৳{ticket.price} × {bookingQuantity}
                    </span>
                  </div>
                  {ticket.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Discount ({ticket.discount}%)
                      </span>
                      <span className="font-medium text-emerald-600">
                        -৳{discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 dark:border-slate-700 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-[#FF7A1B]">
                        ৳{finalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Button */}
                <button
                  onClick={() => setShowModal(true)}
                  disabled={isBookingDisabled()}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    isBookingDisabled()
                      ? 'bg-gray-300 dark:bg-slate-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white shadow-lg hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  {!user
                    ? 'Login to Book'
                    : isBookingDisabled()
                    ? 'Booking Unavailable'
                    : 'Proceed to Book'}
                </button>

                {/* Safety Features */}
                <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <FaLock className="w-4 h-4 text-emerald-500" />
                    <span>Secure SSL Encryption</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <FaShieldAlt className="w-4 h-4 text-blue-500" />
                    <span>Verified Vendor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-8 shadow-2xl animate-scale-in">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTicketAlt className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Confirm Booking
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Review your booking details
                </p>
              </div>

              <form onSubmit={handleBooking}>
                <div className="space-y-6">
                  {/* Booking Summary */}
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={ticket.image}
                        alt={ticket.title}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">
                          {ticket.title}
                        </h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {ticket.from} → {ticket.to}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Date
                        </div>
                        <div className="font-medium">
                          {safeFormatDate(
                            ticket.departureDateTime,
                            'MMM dd, yyyy'
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Time
                        </div>
                        <div className="font-medium">
                          {safeFormatDate(ticket.departureDateTime, 'hh:mm a')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Price Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Tickets ({bookingQuantity})
                      </span>
                      <span className="font-medium">
                        ৳{ticket.price * bookingQuantity}
                      </span>
                    </div>
                    {ticket.discount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Discount
                        </span>
                        <span className="font-medium text-emerald-600">
                          -৳{discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 dark:border-slate-700 pt-3">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total Payable</span>
                        <span className="text-[#FF7A1B]">
                          ৳{finalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                      Confirm & Pay
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetails;
