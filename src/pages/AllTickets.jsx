// ========== PREMIUM AllTickets.jsx - TicketBari Design ==========
import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBus,
  FaTrain,
  FaShip,
  FaPlane,
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
  FaSearch,
  FaFilter,
  FaArrowLeft,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaTicketAlt,
  FaFire,
  FaPercent,
  FaTimes,
  FaSortAmountDown,
  FaSortAmountUp,
  FaCalendarAlt,
} from 'react-icons/fa';
import { FiRefreshCw, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AllTickets = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);

  // Search & Filter States (URL Sync)
  const [searchFrom, setSearchFrom] = useState(searchParams.get('from') || '');
  const [searchTo, setSearchTo] = useState(searchParams.get('to') || '');
  const [filterType, setFilterType] = useState(
    searchParams.get('transportType') || 'all'
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'latest');
  const [dateFilter, setDateFilter] = useState(searchParams.get('date') || '');

  // Debounced search
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
      });

      if (searchFrom) params.append('from', searchFrom);
      if (searchTo) params.append('to', searchTo);
      if (filterType && filterType !== 'all')
        params.append('transportType', filterType);
      if (sortBy) params.append('sort', sortBy);
      if (dateFilter) params.append('date', dateFilter);

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tickets/approved?${params}`
      );

      setTickets(data.tickets || []);
      setTotalPages(data.totalPages || 1);
      setTotalTickets(data.totalCount || 0);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch tickets');
      // Fallback mock data for demo
      setTickets(generateMockTickets(12));
      setTotalPages(5);
      setTotalTickets(58);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchFrom, searchTo, filterType, sortBy, dateFilter]);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchFrom) params.set('from', searchFrom);
    if (searchTo) params.set('to', searchTo);
    if (filterType && filterType !== 'all')
      params.set('transportType', filterType);
    if (sortBy) params.set('sort', sortBy);
    if (dateFilter) params.set('date', dateFilter);
    setSearchParams(params, { replace: true });
  }, [searchFrom, searchTo, filterType, sortBy, dateFilter, setSearchParams]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const debouncedSearch = debounce(() => {
    setCurrentPage(1);
  }, 500);

  const handleSearchChange = setter => e => {
    setter(e.target.value);
    debouncedSearch();
  };

  const handleReset = () => {
    setSearchFrom('');
    setSearchTo('');
    setFilterType('all');
    setSortBy('latest');
    setDateFilter('');
    setCurrentPage(1);
  };

  // Mock data generator
  const generateMockTickets = count => {
    const transportTypes = ['bus', 'train', 'launch', 'plane'];
    const destinations = [
      'Chittagong',
      'Sylhet',
      "Cox's Bazar",
      'Rajshahi',
      'Khulna',
      'Barisal',
    ];
    const vendors = [
      'Premium Express',
      'Super Travels',
      'Green Line',
      'Shohagh Paribahan',
      'Hanif Enterprise',
    ];

    return Array.from({ length: count }, (_, i) => {
      const departureDate = new Date();
      departureDate.setDate(departureDate.getDate() + i + 1);

      const transport = transportTypes[i % 4];
      const transportCapitalized =
        transport.charAt(0).toUpperCase() + transport.slice(1);

      return {
        _id: `mock-${i}-${Date.now()}`,
        title: `${transportCapitalized} Service ${i + 1}`,
        from: 'Dhaka',
        to: destinations[i % destinations.length],
        departureDateTime: departureDate.toISOString(),
        transportType: transport,
        price: 550 + i * 45,
        ticketQuantity: 25 + i * 3,
        image: `https://images.unsplash.com/photo-${
          ['1544620347', '1593642632827', '1566836610', '1512295767273'][i % 4]
        }?auto=format&fit=crop&w=500&h=300&q=80`,
        perks: ['AC', 'WiFi', 'Water', 'Snacks'].slice(0, (i % 3) + 1),
        vendorName: vendors[i % vendors.length],
        discount: i % 3 === 0 ? Math.floor(Math.random() * 30) + 10 : 0,
        isAdvertised: i % 4 === 0,
        isPremium: i % 5 === 0,
      };
    });
  };

  const transportIcon = {
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

  // Premium Skeleton - Smaller Cards
  const SkeletonCard = () => (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 animate-pulse overflow-hidden">
      <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mb-4 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
      <div className="space-y-3">
        <div className="h-6 w-3/4 bg-gray-300 rounded-xl" />
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-300 rounded w-2/3" />
            <div className="h-3 bg-gray-300 rounded w-1/2" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="h-8 w-16 bg-gray-300 rounded-lg" />
          <div className="h-6 w-14 bg-gray-300 rounded-lg" />
        </div>
        <div className="h-10 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-2xl" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-gray-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white px-6 py-3 rounded-3xl shadow-2xl mb-6">
            <FaTicketAlt className="w-6 h-6" />
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              Find Your Perfect Journey
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover thousands of verified tickets across Bangladesh
          </p>
        </motion.div>

        {/* Ultimate Search & Filter */}
        <motion.div
          className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-200 dark:border-slate-800 p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* From Location */}
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchFrom}
                onChange={handleSearchChange(setSearchFrom)}
                placeholder="From (e.g., Dhaka)"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FF7A1B] focus:ring-2 focus:ring-[#FF7A1B]/30 transition-all"
              />
            </div>

            {/* To Location */}
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTo}
                onChange={handleSearchChange(setSearchTo)}
                placeholder="To (e.g., Chittagong)"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FF7A1B] focus:ring-2 focus:ring-[#FF7A1B]/30 transition-all"
              />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={e => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FF7A1B] focus:ring-2 focus:ring-[#FF7A1B]/30 transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {/* Transport Type Filter */}
            <div className="flex items-center space-x-2">
              <FaFilter className="text-[#FF7A1B]" />
              <select
                value={filterType}
                onChange={e => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FF7A1B] focus:ring-2 focus:ring-[#FF7A1B]/30"
              >
                <option value="all">All Transport</option>
                <option value="bus">🚌 Bus</option>
                <option value="train">🚂 Train</option>
                <option value="launch">🚢 Launch</option>
                <option value="plane">✈️ Plane</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center space-x-2">
              <FaSortAmountDown className="text-[#FF7A1B]" />
              <select
                value={sortBy}
                onChange={e => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:outline-none focus:border-[#FF7A1B] focus:ring-2 focus:ring-[#FF7A1B]/30"
              >
                <option value="latest">Latest First</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
                <option value="departure">Soonest Departure</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex-1 flex justify-end space-x-3">
              <motion.button
                onClick={() => setCurrentPage(1)}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSearch />
                <span>Search</span>
              </motion.button>
              <motion.button
                onClick={handleReset}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiRefreshCw />
                <span>Reset</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Results Header */}
        <motion.div
          className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div>
            <h2 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text mb-1">
              {totalTickets.toLocaleString()} Tickets Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {tickets.length} results
            </span>
          </div>
        </motion.div>

        {/* Tickets Grid - Smaller Cards */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : tickets.length === 0 ? (
            <motion.div
              key="empty"
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <FaSearch className="w-24 h-24 text-gray-300 dark:text-slate-700 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-3">
                No Tickets Found
              </h3>
              <p className="text-gray-400 dark:text-gray-500 mb-8 max-w-md mx-auto">
                Try adjusting your search criteria
              </p>
              <motion.button
                onClick={handleReset}
                className="inline-flex items-center space-x-3 px-8 py-3 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Browse All Tickets</span>
                <FaArrowRight />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="tickets"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {tickets.map((ticket, index) => {
                const TransportIcon =
                  transportIcon[ticket.transportType] || FaBus;
                const transportColor =
                  transportColors[ticket.transportType] ||
                  'from-gray-500 to-gray-700';

                return (
                  <motion.div
                    key={ticket._id}
                    className="group bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-xl hover:shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden transition-all duration-500 hover:-translate-y-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    {/* Premium Badge */}
                    {(ticket.isPremium || ticket.isAdvertised) && (
                      <div className="absolute top-3 right-3 z-10">
                        {ticket.isPremium ? (
                          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                            <FaStar className="w-3 h-3" />
                            <span>PREMIUM</span>
                          </div>
                        ) : (
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                            <FaFire className="w-3 h-3" />
                            <span>FEATURED</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative mb-4 rounded-2xl overflow-hidden h-40">
                      <img
                        src={ticket.image}
                        alt={ticket.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#FF7A1B] transition-colors">
                        {ticket.title}
                      </h3>

                      {/* Route */}
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${transportColor} rounded-xl flex items-center justify-center shadow-lg`}
                        >
                          <TransportIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Route
                          </div>
                          <div className="font-bold text-gray-900 dark:text-white">
                            {ticket.from} → {ticket.to}
                          </div>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <FaClock className="text-gray-400" />
                          <div>
                            <div className="text-xs text-gray-500">
                              Departure
                            </div>
                            <div className="text-sm font-semibold">
                              {new Date(
                                ticket.departureDateTime
                              ).toLocaleDateString('en-GB')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaDollarSign className="text-gray-400" />
                          <div>
                            <div className="text-xs text-gray-500">Price</div>
                            <div className="text-sm font-bold text-[#FF7A1B]">
                              ৳{ticket.price}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Seats & Discount */}
                      <div className="flex justify-between items-center">
                        <div className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-bold">
                          {ticket.ticketQuantity} seats
                        </div>
                        {ticket.discount > 0 && (
                          <div className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold flex items-center space-x-1">
                            <FaPercent className="w-3 h-3" />
                            <span>{ticket.discount}% OFF</span>
                          </div>
                        )}
                      </div>

                      {/* Perks */}
                      {ticket.perks?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {ticket.perks.slice(0, 2).map((perk, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full"
                            >
                              {perk}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* View Details Button */}
                      <Link
                        to={`/ticket/${ticket._id}`}
                        className="block w-full mt-4 py-3 bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white font-bold rounded-xl text-center hover:shadow-lg hover:-translate-y-0.5 transition-all group/btn"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <span>View Details</span>
                          <FaChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="flex justify-center pt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-xl border border-gray-200 dark:border-slate-800">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-all"
              >
                <FaChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(
                  1,
                  Math.min(totalPages - 4 + i, currentPage + i - 2)
                );
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-[#FFA53A] to-[#FF7A1B] text-white shadow-lg'
                        : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage(prev => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-all"
              >
                <FaChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Stats Footer */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {[
            { icon: FaTicketAlt, value: '12K+', label: 'Tickets Booked' },
            { icon: FaBus, value: '1.5K+', label: 'Bus Routes' },
            { icon: FaTrain, value: '500+', label: 'Train Routes' },
            { icon: FaShip, value: '200+', label: 'Launch Routes' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 text-center border border-gray-200 dark:border-slate-800 hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <stat.icon className="w-8 h-8 text-[#FF7A1B] mx-auto mb-3" />
              <div className="text-2xl font-black text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AllTickets;
