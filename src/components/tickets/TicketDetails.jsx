import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getTicketById } from '../../services/tickets';
import { createBooking } from '../../services/bookings';
import BookingModal from './BookingModal';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-hot-toast';

const TicketDetails = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  // Fetch ticket details
  const {
    data: ticket,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => getTicketById(id),
    enabled: !!id,
    onError: error => {
      toast.error('Failed to load ticket details');
      console.error(error);
    },
  });

  // Calculate time left until departure
  useEffect(() => {
    if (!ticket) return;

    const calculateTimeLeft = () => {
      const departureDate = new Date(ticket.departureDate);
      const [hours, minutes] = ticket.departureTime.split(':');
      departureDate.setHours(hours, minutes);

      const difference = departureDate - new Date();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutesLeft = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );

        setTimeLeft({
          days,
          hours: hoursLeft,
          minutes: minutesLeft,
        });
      } else {
        setTimeLeft(null);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [ticket]);

  const handleBookNow = () => {
    if (!currentUser) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }

    setIsModalOpen(true);
  };

  const handleBookingSubmit = async bookingData => {
    try {
      await createBooking({
        ticketId: ticket._id,
        bookingQuantity: bookingData.quantity,
        totalPrice: ticket.price * bookingData.quantity,
      });

      toast.success('Booking successful!');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to book ticket');
      console.error(error);
    }
  };

  const getTransportIcon = type => {
    switch (type) {
      case 'bus':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0014 7z" />
          </svg>
        );
      case 'train':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0014 7z" />
          </svg>
        );
      case 'launch':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.503 1.132a1 1 0 01.994 0l1.75 1a1 1 0 11-.994 1.736L10.8 3.416a1 1 0 01-.6 0L9.747 3.868a1 1 0 11-.994-1.736l1.75-1zM5.752 5.336a1 1 0 00-1.504 0l-1.75 3a1 1 0 001.504 1.328L5.75 8.5a1 1 0 001.504 0l1.75-1.836a1 1 0 00-1.504-1.328l-.75 1.286V7a1 1 0 00-2 0v1.622l-.75-1.286zm8.496 0a1 1 0 011.504 0l1.75 3a1 1 0 01-1.504 1.328L14.25 8.5a1 1 0 01-1.504 0l-1.75-1.836a1 1 0 011.504-1.328l.75 1.286V7a1 1 0 012 0v1.622l.75-1.286z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'plane':
        return (
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isDeparturePassed = !timeLeft;
  const isOutOfStock = ticket && ticket.ticketQuantity === 0;
  const isBookable = !isDeparturePassed && !isOutOfStock;

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error || !ticket) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Ticket Not Found</h1>
        <p className="mb-6">
          The ticket you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/all-tickets')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
        >
          Back to Tickets
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`rounded-lg shadow-lg overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={ticket.image}
              alt={ticket.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:w-1/2 p-6">
            <div className="flex items-center mb-4">
              {getTransportIcon(ticket.transportType)}
              <span className="ml-2 text-lg font-semibold">
                {ticket.transportType.charAt(0).toUpperCase() +
                  ticket.transportType.slice(1)}
              </span>
            </div>

            <h1 className="text-2xl font-bold mb-4">{ticket.title}</h1>

            <div className="mb-6">
              <div className="flex items-center mb-2">
                <span className="font-medium">Route:</span>
                <span className="ml-2">
                  {ticket.from} → {ticket.to}
                </span>
              </div>

              <div className="flex items-center mb-2">
                <span className="font-medium">Departure:</span>
                <span className="ml-2">
                  {formatDepartureTime(
                    ticket.departureDate,
                    ticket.departureTime
                  )}
                </span>
              </div>

              <div className="flex items-center mb-2">
                <span className="font-medium">Available Tickets:</span>
                <span className="ml-2">{ticket.ticketQuantity}</span>
              </div>

              <div className="flex items-center mb-4">
                <span className="font-medium">Price per Ticket:</span>
                <span className="ml-2 text-xl font-bold text-blue-500">
                  ${ticket.price}
                </span>
              </div>

              {ticket.perks && ticket.perks.length > 0 && (
                <div className="mb-4">
                  <span className="font-medium">Perks:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ticket.perks.map((perk, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {perk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {timeLeft && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <h3 className="font-medium mb-2">Time Left Until Departure:</h3>
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{timeLeft.days}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Days
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{timeLeft.hours}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Hours
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Minutes
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                {isDeparturePassed && (
                  <p className="text-red-500 font-medium">
                    This ticket has expired
                  </p>
                )}
                {isOutOfStock && (
                  <p className="text-red-500 font-medium">Sold Out</p>
                )}
              </div>

              <button
                onClick={handleBookNow}
                disabled={!isBookable}
                className={`px-6 py-3 rounded-md font-medium transition ${
                  isBookable
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {isModalOpen && (
        <BookingModal
          ticket={ticket}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
};

export default TicketDetails;
