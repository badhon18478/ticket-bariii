// components/tickets/TicketCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBus,
  FaTrain,
  FaShip,
  FaPlane,
  FaStar,
  FaUsers,
  FaCalendar,
  FaMapMarkerAlt,
  FaArrowRight,
  FaTicketAlt,
} from 'react-icons/fa';
// import { useAuth } from '../../contexts/AuthProvider';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthProvider';

const TicketCard = ({ ticket = {}, featured = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // ✅ SAFE: Default empty object if ticket is undefined
  const safeTicket = ticket || {};

  // ✅ SAFE: Get all values with defaults
  const ticketId = safeTicket._id || '';
  const ticketTitle = safeTicket.title || 'Untitled Ticket';
  const ticketFrom = safeTicket.from || 'Unknown';
  const ticketTo = safeTicket.to || 'Unknown';
  const ticketPrice = parseFloat(safeTicket.price) || 0;
  const ticketQuantity = parseInt(safeTicket.quantity) || 0;
  const ticketAvailableQuantity = parseInt(safeTicket.availableQuantity) || 0;
  const ticketImage = safeTicket.image || '/default-ticket.jpg';
  const ticketTransportType = safeTicket.transportType || 'bus';
  const ticketDeparture = safeTicket.departure || new Date().toISOString();
  const ticketDepartureTime = safeTicket.departureTime || '';
  const ticketStatus = safeTicket.verificationStatus || 'pending';
  const ticketPerks = Array.isArray(safeTicket.perks) ? safeTicket.perks : [];
  const isAdvertised = safeTicket.isAdvertised || false;

  // ✅ SAFE: Transport icon with null check
  const getTransportIcon = type => {
    if (!type) return <FaBus className="text-gray-500" />;

    const typeLower = type.toLowerCase();
    switch (typeLower) {
      case 'bus':
        return <FaBus className="text-green-500" />;
      case 'train':
        return <FaTrain className="text-blue-500" />;
      case 'launch':
        return <FaShip className="text-purple-500" />;
      case 'plane':
        return <FaPlane className="text-red-500" />;
      default:
        return <FaBus className="text-gray-500" />;
    }
  };

  // ✅ FIXED: Safe date formatting
  const formatDate = dateString => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';

      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

  // ✅ FIXED: Safe time formatting (no split method)
  const formatTime = () => {
    // First check departureTime string
    if (ticketDepartureTime && typeof ticketDepartureTime === 'string') {
      return ticketDepartureTime;
    }

    // Fallback to departure date
    if (!ticketDeparture) return '';

    try {
      const date = new Date(ticketDeparture);
      if (isNaN(date.getTime())) return '';

      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      console.error('Time formatting error:', error);
      return '';
    }
  };

  // ✅ FIXED: Safe departure time formatting (প্রধান সমস্যার সমাধান)
  const formatDepartureTime = () => {
    // If we have a pre-formatted departureTime string
    if (ticketDepartureTime && typeof ticketDepartureTime === 'string') {
      return ticketDepartureTime;
    }

    // Otherwise format from ISO date
    if (!ticketDeparture) return '';

    try {
      const date = new Date(ticketDeparture);
      if (isNaN(date.getTime())) return '';

      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');

      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    } catch (error) {
      console.error('Departure time formatting error:', error);
      return '';
    }
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }

    if (ticketStatus !== 'approved') {
      toast.error('This ticket is not available for booking');
      return;
    }

    const availableQty =
      ticketAvailableQuantity > 0 ? ticketAvailableQuantity : ticketQuantity;
    if (availableQty <= 0) {
      toast.error('No tickets available');
      return;
    }

    navigate(`/book-ticket/${ticketId}`);
  };

  const handleViewDetails = () => {
    if (!ticketId) {
      toast.error('Invalid ticket');
      return;
    }
    navigate(`/ticket/${ticketId}`);
  };

  // ✅ SAFE: Status badge color
  const getStatusColor = status => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const availableQty =
    ticketAvailableQuantity > 0 ? ticketAvailableQuantity : ticketQuantity;

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 ${
        featured ? 'ring-2 ring-orange-500/20' : ''
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            <FaStar className="text-xs" /> FEATURED
          </span>
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={ticketImage}
          alt={ticketTitle}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={e => {
            e.target.src = '/default-ticket.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Transport Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
          {getTransportIcon(ticketTransportType)}
          <span className="text-sm font-medium capitalize">
            {ticketTransportType}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              ticketStatus
            )}`}
          >
            {ticketStatus === 'approved' && '✓'}
            {ticketStatus === 'pending' && '⏳'}
            {ticketStatus === 'rejected' && '✗'}
            <span className="ml-1 capitalize">{ticketStatus}</span>
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {ticketTitle}
        </h3>

        {/* Route */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
          <FaMapMarkerAlt className="mr-2 text-blue-500" />
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {ticketFrom}
          </span>
          <FaArrowRight className="mx-2 text-gray-400" />
          <span className="font-medium text-green-600 dark:text-green-400">
            {ticketTo}
          </span>
        </div>

        {/* Departure */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
          <FaCalendar className="mr-2 text-purple-500" />
          <span>{formatDate(ticketDeparture)}</span>
          <span className="ml-2 font-medium">{formatDepartureTime()}</span>
        </div>

        {/* Price & Quantity */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${ticketPrice.toFixed(2)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              per ticket
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FaTicketAlt className="text-gray-400" />
            <div className="text-right">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {availableQty} available
              </div>
            </div>
          </div>
        </div>

        {/* Perks */}
        {ticketPerks.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Included:
            </div>
            <div className="flex flex-wrap gap-2">
              {ticketPerks.slice(0, 3).map((perk, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {perk}
                </span>
              ))}
              {ticketPerks.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  +{ticketPerks.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleViewDetails}
            className="flex-1 text-center px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            View Details
          </button>

          <button
            onClick={handleBookNow}
            disabled={
              loading || ticketStatus !== 'approved' || availableQty <= 0
            }
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Loading...' : 'Book Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
