import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaBus,
  FaTrain,
  FaShip,
  FaPlane,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import {
  MdDirectionsBus,
  MdTrain,
  MdDirectionsBoat,
  MdFlight,
} from 'react-icons/md';
import axios from 'axios';
import { useTheme } from '../hooks/useTheme';

const AllTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [transportFilter, setTransportFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [ticketsPerPage] = useState(6);

  const { theme } = useTheme();

  useEffect(() => {
    fetchTickets();
  }, []);

  // tickets state আপডেট হওয়ার পর নিরাপদভাবে ফিল্টার রান করার জন্য
  useEffect(() => {
    if (Array.isArray(tickets) && tickets.length >= 0) {
      filterAndSortTickets();
    }
  }, [searchTerm, transportFilter, sortOrder, tickets]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/tickets/all`);

      // API রেসপন্স সরাসরি array না হলে সেফটি চেক
      const data = response.data;
      const verifiedArray = Array.isArray(data)
        ? data
        : data?.tickets || data?.data || [];

      setTickets(verifiedArray);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTickets = () => {
    // টিকিট অ্যারে না হলে এরর হ্যান্ডলিং (Your Error Fix)
    if (!Array.isArray(tickets)) return;

    let filtered = tickets.filter(
      ticket => ticket && ticket.verificationStatus === 'approved'
    );

    // Search filter (Optional chaining used)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        ticket =>
          ticket.from?.toLowerCase().includes(searchLower) ||
          ticket.to?.toLowerCase().includes(searchLower) ||
          ticket.title?.toLowerCase().includes(searchLower)
      );
    }

    // Transport type filter
    if (transportFilter !== 'all') {
      filtered = filtered.filter(
        ticket => ticket.transportType === transportFilter
      );
    }

    // Sorting (Immutability maintained)
    const sorted = [...filtered];
    if (sortOrder === 'price-low-high') {
      sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOrder === 'price-high-low') {
      sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    setFilteredTickets(sorted);
  };

  const transportIcons = {
    bus: <MdDirectionsBus className="text-blue-500 text-xl" />,
    train: <MdTrain className="text-green-500 text-xl" />,
    launch: <MdDirectionsBoat className="text-purple-500 text-xl" />,
    plane: <MdFlight className="text-red-500 text-xl" />,
  };

  const transportLabels = {
    bus: (
      <>
        <FaBus className="inline mr-2" /> Bus
      </>
    ),
    train: (
      <>
        <FaTrain className="inline mr-2" /> Train
      </>
    ),
    launch: (
      <>
        <FaShip className="inline mr-2" /> Launch
      </>
    ),
    plane: (
      <>
        <FaPlane className="inline mr-2" /> Plane
      </>
    ),
  };

  // Pagination Logic
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage) || 1;

  const paginate = pageNumber => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const TicketCard = ({ ticket }) => {
    const departureDate = new Date(ticket.departureDate);
    const now = new Date();
    const isPast = departureDate < now;
    const isSoldOut = ticket.quantity === 0;

    return (
      <div
        className={`${
          theme === 'dark'
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-100'
        } rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border`}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={ticket.image}
            alt={ticket.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <div
              className={`flex items-center space-x-2 ${
                theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/90'
              } backdrop-blur-sm px-3 py-1.5 rounded-full`}
            >
              {transportIcons[ticket.transportType]}
              <span
                className={`font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                } capitalize`}
              >
                {ticket.transportType}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3
                className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                } mb-2`}
              >
                {ticket.title}
              </h3>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <FaMapMarkerAlt className="text-blue-500" />
                <span className="font-medium">
                  {ticket.from} → {ticket.to}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                ৳{ticket.price}
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm dark:text-gray-300">
              <span className="flex items-center gap-1">
                <FaCalendarAlt className="text-purple-500" />{' '}
                {new Date(ticket.departureDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <FaClock className="text-green-500" /> {ticket.departureTime}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm dark:text-gray-300">
              <FaUsers className="text-blue-500" />
              <span>{ticket.quantity} seats available</span>
            </div>
          </div>

          <Link
            to={`/ticket/${ticket._id}`}
            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center transition-all ${
              isPast || isSoldOut
                ? 'bg-gray-400 cursor-not-allowed text-white'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
            }`}
          >
            {isPast ? 'Departed' : isSoldOut ? 'Sold Out' : 'View Details'}
          </Link>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1
            className={`text-4xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            All Available Tickets
          </h1>
          <p className="text-gray-500 mt-2">Book your next journey with ease</p>
        </div>

        {/* Filter Bar */}
        <div
          className={`${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } p-6 rounded-2xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4`}
        >
          <div className="relative">
            <FaSearch className="absolute left-3 top-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search destination..."
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white'
              }`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className={`p-3 rounded-xl border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white'
            }`}
            value={transportFilter}
            onChange={e => setTransportFilter(e.target.value)}
          >
            <option value="all">All Transports</option>
            <option value="bus">Bus</option>
            <option value="train">Train</option>
            <option value="launch">Launch</option>
            <option value="plane">Plane</option>
          </select>
          <select
            className={`p-3 rounded-xl border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white'
            }`}
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
          >
            <option value="default">Sort By</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
        </div>

        {/* Grid Section */}
        {currentTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentTickets.map(ticket => (
              <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No tickets found for your criteria.
          </div>
        )}

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 rounded-lg font-bold transition ${
                  currentPage === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTickets;
