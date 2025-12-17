import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useThemeContext';
// import { useTheme } from '../../contexts/ThemeContext';

const TicketCard = ({ ticket }) => {
  const { theme } = useTheme();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getTransportIcon = type => {
    switch (type) {
      case 'bus':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0014 7z" />
          </svg>
        );
      case 'train':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0014 7z" />
          </svg>
        );
      case 'launch':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.503 1.132a1 1 0 01.994 0l1.75 1a1 1 0 11-.994 1.736L10.8 3.416a1 1 0 01-.6 0L9.747 3.868a1 1 0 11-.994-1.736l1.75-1zM5.752 5.336a1 1 0 00-1.504 0l-1.75 3a1 1 0 001.504 1.328L5.75 8.5a1 1 0 001.504 0l1.75-1.836a1 1 0 00-1.504-1.328l-.75 1.286V7a1 1 0 00-2 0v1.622l-.75-1.286zm8.496 0a1 1 0 011.504 0l1.75 3a1 1 0 01-1.504 1.328L14.25 8.5a1 1 0 01-1.504 0l-1.75-1.836a1 1 0 011.504-1.328l.75 1.286V7a1 1 0 012 0v1.622l.75-1.286z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'plane':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDepartureTime = (date, time) => {
    const departureDate = new Date(date);
    const [hours, minutes] = time.split(':');
    departureDate.setHours(hours, minutes);

    return departureDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={`rounded-lg shadow-md overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } hover:shadow-xl transition-all duration-300`}
    >
      <div className="relative">
        <img
          src={ticket.image}
          alt={ticket.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          {ticket.transportType.charAt(0).toUpperCase() +
            ticket.transportType.slice(1)}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{ticket.title}</h3>

        <div className="flex items-center mb-2">
          {getTransportIcon(ticket.transportType)}
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            {ticket.from} → {ticket.to}
          </span>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Departure
            </p>
            <p className="font-medium">
              {formatDepartureTime(ticket.departureDate, ticket.departureTime)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
            <p className="text-xl font-bold text-blue-500">${ticket.price}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Available
            </p>
            <p className="font-medium">{ticket.ticketQuantity} tickets</p>
          </div>

          {ticket.perks && ticket.perks.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {ticket.perks.slice(0, 2).map((perk, index) => (
                <span
                  key={index}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                >
                  {perk}
                </span>
              ))}
              {ticket.perks.length > 2 && (
                <span className="text-gray-500 text-xs">
                  +{ticket.perks.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        <Link
          to={`/ticket/${ticket._id}`}
          className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded-md transition"
        >
          See Details
        </Link>
      </div>
    </motion.div>
  );
};

export default TicketCard;
