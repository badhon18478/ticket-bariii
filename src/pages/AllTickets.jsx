// ========== ULTIMATE AllTickets.jsx (Premium Design) ==========
import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bus,
  TrainFront,
  Ship,
  Plane,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
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
    searchParams.get('transportType') || ''
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'latest');

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
      if (filterType) params.append('transportType', filterType);
      if (sortBy) params.append('sort', sortBy);

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tickets/approved?${params}`
      );

      setTickets(data.tickets || []);
      setTotalPages(data.totalPages || 1);
      setTotalTickets(data.totalCount || 0);
    } catch (error) {
      toast.error('Failed to fetch tickets');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchFrom, searchTo, filterType, sortBy]);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchFrom) params.set('from', searchFrom);
    if (searchTo) params.set('to', searchTo);
    if (filterType) params.set('transportType', filterType);
    if (sortBy) params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
  }, [searchFrom, searchTo, filterType, sortBy, setSearchParams]);

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
    setFilterType('');
    setSortBy('latest');
    setCurrentPage(1);
  };

  const transportIcon = {
    Bus: Bus,
    Train: TrainFront,
    Launch: Ship,
    Plane: Plane,
  };

  // Premium Skeleton
  const SkeletonCard = () => (
    <motion.div
      className="bg-white/70 backdrop-blur-xl rounded-4xl p-8 shadow-2xl border border-white/50 animate-pulse overflow-hidden h-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-64 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 rounded-3xl mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
      </div>
      <div className="space-y-4">
        <div className="h-8 w-4/5 bg-gradient-to-r from-gray-300 to-gray-200 rounded-2xl" />
        <div className="space-y-3">
          <div className="flex items-center h-12 space-x-3">
            <div className="w-12 h-12 bg-gray-300 rounded-2xl" />
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-gray-300 rounded w-3/4" />
              <div className="h-4 bg-gray-300 rounded w-1/2" />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-10 w-20 bg-gray-300 rounded-xl" />
            <div className="h-8 w-16 bg-gray-300 rounded-lg" />
          </div>
        </div>
        <div className="h-12 bg-gradient-to-r from-blue-300 to-indigo-300 rounded-3xl mt-6" />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 py-16 lg:py-24 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <motion.div
          className="text-center mb-20 lg:mb-28"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-8 py-4 rounded-4xl shadow-2xl mb-8 backdrop-blur-xl">
            <Bus className="w-8 h-8" />
            <div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight">
                Find Your Perfect Journey
              </h1>
              <p className="text-lg lg:text-xl font-medium opacity-90">
                12,847+ tickets across Bangladesh
              </p>
            </div>
          </div>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Search from thousands of verified bus, train, launch & flight
            tickets
          </p>
        </motion.div>

        {/* Ultimate Search & Filter */}
        <motion.div
          className="bg-white/80 backdrop-blur-2xl shadow-2xl rounded-4xl border border-white/60 p-8 lg:p-12 mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              setCurrentPage(1);
            }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
          >
            {/* Location Search */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                  <span>From Location</span>
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    value={searchFrom}
                    onChange={handleSearchChange(setSearchFrom)}
                    placeholder="Dhaka, Sylhet, Chittagong..."
                    className="w-full pl-12 pr-6 py-5 text-lg border-2 border-gray-200 rounded-3xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                  <MapPin className="w-6 h-6 text-green-600" />
                  <span>To Location</span>
                </label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type="text"
                    value={searchTo}
                    onChange={handleSearchChange(setSearchTo)}
                    placeholder="Chittagong, Cox's Bazar..."
                    className="w-full pl-12 pr-6 py-5 text-lg border-2 border-gray-200 rounded-3xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>

            {/* Filters & Actions */}
            <div className="space-y-6 lg:pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Transport Filter */}
                <div className="space-y-2">
                  <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                    <Bus className="w-6 h-6 text-indigo-600" />
                    <span>Transport Type</span>
                  </label>
                  <select
                    value={filterType}
                    onChange={e => {
                      setFilterType(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-3xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none bg-no-repeat bg-right"
                  >
                    <option value="">All Transport</option>
                    <option value="Bus">🚌 Bus</option>
                    <option value="Train">🚂 Train</option>
                    <option value="Launch">🚢 Launch</option>
                    <option value="Plane">✈️ Plane</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="space-y-2">
                  <label className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                    <Filter className="w-6 h-6 text-purple-600" />
                    <span>Sort By</span>
                  </label>
                  <select
                    value={sortBy}
                    onChange={e => {
                      setSortBy(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-3xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm appearance-none bg-no-repeat bg-right"
                  >
                    <option value="latest">Latest First</option>
                    <option value="lowToHigh">💰 Price: Low to High</option>
                    <option value="highToLow">💎 Price: High to Low</option>
                    <option value="departure">📅 Soonest Departure</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <motion.button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black py-5 px-8 rounded-3xl shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3 text-lg tracking-wide"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Search className="w-6 h-6" />
                  <span>Search Tickets</span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-5 px-8 rounded-3xl shadow-xl hover:shadow-gray-400/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ArrowLeft className="w-6 h-6" />
                  <span>Reset All</span>
                </motion.button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Results Header */}
        <motion.div
          className="mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/60 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-xl border border-white/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text mb-2">
              {totalTickets.toLocaleString()} Tickets Found
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Page {currentPage} of {totalPages}
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Showing {tickets.length} results</span>
          </div>
        </motion.div>

        {/* Tickets Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-32"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {Array(12)
                .fill()
                .map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
            </motion.div>
          ) : tickets.length === 0 ? (
            <motion.div
              key="empty"
              className="col-span-full text-center py-32"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Search className="w-32 h-32 text-gray-300 mx-auto mb-8 animate-pulse opacity-50" />
              <h3 className="text-4xl font-black text-gray-500 mb-4">
                No Tickets Found
              </h3>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Try adjusting your search criteria or check back later for new
                tickets
              </p>
              <motion.button
                onClick={handleReset}
                className="inline-flex items-center space-x-3 px-12 py-6 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xl font-black rounded-4xl shadow-2xl hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Reset & Browse All</span>
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="tickets"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {tickets.map((ticket, index) => {
                const TransportIcon =
                  transportIcon[ticket.transportType] || Bus;
                return (
                  <motion.div
                    key={ticket._id}
                    className="group relative bg-white/80 backdrop-blur-xl rounded-4xl p-8 shadow-2xl hover:shadow-3xl border border-white/60 hover:border-blue-200/60 h-full flex flex-col overflow-hidden transition-all duration-700 hover:-translate-y-4 hover:scale-[1.03]"
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    whileHover={{ y: -25 }}
                  >
                    {/* Premium Badge */}
                    {ticket.isPremium && (
                      <motion.div
                        className="absolute top-6 right-6 z-20 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-2xl text-sm font-bold shadow-xl flex items-center space-x-1"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Star className="w-4 h-4 fill-current" />
                        <span>PREMIUM</span>
                      </motion.div>
                    )}

                    {/* Image */}
                    <div className="relative mb-8 rounded-3xl overflow-hidden h-64 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                      <img
                        src={
                          ticket.image ||
                          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop'
                        }
                        alt={ticket.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    </div>

                    {/* Content */}
                    <div className="flex-grow space-y-6">
                      <h3 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {ticket.title}
                      </h3>

                      {/* Route */}
                      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl">
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                          <MapPin className="w-7 h-7 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                            Route
                          </p>
                          <p className="text-xl font-black text-gray-900 truncate">
                            {ticket.from}
                          </p>
                          <p className="text-lg font-bold text-indigo-600">
                            → {ticket.to}
                          </p>
                        </div>
                      </div>

                      {/* Transport */}
                      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-3xl">
                        <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
                          <TransportIcon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-emerald-600 uppercase tracking-wide">
                            Transport
                          </p>
                          <p className="text-xl font-black text-gray-900 capitalize">
                            {ticket.transportType}
                          </p>
                        </div>
                      </div>

                      {/* Price & Seats */}
                      <div className="grid grid-cols-2 gap-4 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                            <Clock className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-purple-600 uppercase tracking-wide">
                              {new Date(
                                ticket.departureDateTime
                              ).toLocaleDateString('en-GB')}
                            </p>
                            <p className="text-lg font-black text-gray-900">
                              {new Date(
                                ticket.departureDateTime
                              ).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="p-3 bg-emerald-100/60 rounded-2xl">
                            <p className="text-xs text-emerald-700 font-bold uppercase tracking-wide">
                              Seats Left
                            </p>
                            <div className="flex items-baseline justify-end space-x-1">
                              <span className="text-3xl font-black text-emerald-700">
                                {ticket.ticketQuantity}
                              </span>
                              <Star className="w-5 h-5 text-amber-500 fill-current" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Perks */}
                      {ticket.perks?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {ticket.perks.slice(0, 3).map((perk, idx) => (
                            <motion.span
                              key={idx}
                              className="px-4 py-2 bg-white/70 backdrop-blur-sm text-sm font-bold text-gray-800 rounded-2xl shadow-md flex items-center space-x-1 border border-gray-200/50 hover:shadow-lg transition-all hover:scale-105"
                              whileHover={{ scale: 1.05, y: -1 }}
                            >
                              {perk}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <Link
                      to={`/ticket/${ticket._id}`}
                      className="group/btn mt-8 pt-8 border-t-2 border-blue-100 flex items-center justify-center w-full bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white font-black py-5 px-8 rounded-4xl shadow-2xl hover:shadow-indigo-500/50 hover:-translate-y-2 transition-all duration-500 overflow-hidden relative tracking-wide uppercase text-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="flex items-center space-x-3 z-10">
                        <span>View Details</span>
                        <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Pagination */}
        {totalPages > 1 && (
          <motion.div
            className="flex flex-col items-center space-y-6 pt-20 pb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/60">
              <motion.button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all group"
                whileHover={{ scale: currentPage > 1 ? 1.1 : 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft
                  className={`w-6 h-6 ${
                    currentPage > 1
                      ? 'text-gray-700 group-hover:text-gray-900'
                      : 'text-gray-400'
                  }`}
                />
              </motion.button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(
                    1,
                    Math.min(totalPages - 4 + i, currentPage + i - 2)
                  );
                  return (
                    <motion.button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                        currentPage === pageNum
                          ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-2xl shadow-indigo-500/30'
                          : 'bg-white/70 border border-gray-200 hover:bg-blue-50 hover:shadow-lg text-gray-800'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                onClick={() =>
                  setCurrentPage(prev => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all group"
                whileHover={{ scale: currentPage < totalPages ? 1.1 : 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight
                  className={`w-6 h-6 ${
                    currentPage < totalPages
                      ? 'text-gray-700 group-hover:text-gray-900'
                      : 'text-gray-400'
                  }`}
                />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllTickets;
