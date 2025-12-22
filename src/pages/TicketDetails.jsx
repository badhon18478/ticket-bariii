// ========== 2. TicketDetails.jsx - Professional Design ==========
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
} from 'react-icons/fa';
// import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
// import { AuthContext } from '../AuthContext';
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

  useEffect(() => {
    fetchTicket();
  }, [id]);

  useEffect(() => {
    if (ticket) {
      const interval = setInterval(() => {
        const now = new Date();
        const departure = new Date(ticket.departureDateTime);

        if (now >= departure) {
          setTimeLeft('Departed');
          clearInterval(interval);
        } else {
          setTimeLeft(formatDistanceToNow(departure, { addSuffix: true }));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [ticket]);

  const fetchTicket = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tickets/${id}`
      );
      setTicket(response.data);
    } catch (error) {
      toast.error('Failed to load ticket');
      navigate('/all-tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async e => {
    e.preventDefault();

    if (bookingQuantity > ticket.ticketQuantity) {
      toast.error('Not enough tickets available');
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

      toast.success('Booking request sent successfully!');
      setShowModal(false);
      setBookingQuantity(1);
      navigate('/dashboard/my-bookings');
    } catch (error) {
      toast.error('Failed to create booking');
    }
  };

  const isBookingDisabled = () => {
    if (!ticket) return true;
    const now = new Date();
    const departure = new Date(ticket.departureDateTime);
    return now >= departure || ticket.ticketQuantity === 0;
  };

  const getTransportIcon = type => {
    const icons = {
      bus: <FaBus className="text-3xl" />,
      train: <FaTrain className="text-3xl" />,
      launch: <FaShip className="text-3xl" />,
      plane: <FaPlane className="text-3xl" />,
    };
    return icons[type?.toLowerCase()] || <FaBus className="text-3xl" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div
          className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4"
          style={{ borderColor: 'hsl(221 83% 53%)' }}
        ></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Ticket not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Ticket Header */}
        <div className="card-ticket overflow-hidden mb-6 animate-fade-in">
          <div className="relative h-96">
            <img
              src={ticket.image}
              alt={ticket.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="badge bg-white/20 backdrop-blur-md text-white text-lg px-4 py-2">
                  {getTransportIcon(ticket.transportType)}
                  <span className="ml-2">{ticket.transportType}</span>
                </span>
                <span className="px-5 py-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-lg font-bold shadow-lg">
                  ${ticket.price} / ticket
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                {ticket.title}
              </h1>
              <div className="flex items-center gap-4 text-lg">
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {ticket.from}
                </span>
                <span>→</span>
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {ticket.to}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Countdown Card */}
            <div className="glass-card p-6 rounded-2xl animate-slide-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Departure Time
                  </p>
                  <p className="text-2xl font-bold">
                    {new Date(ticket.departureDateTime).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Departs</p>
                  <p className="text-2xl font-bold gradient-text">{timeLeft}</p>
                </div>
              </div>
            </div>

            {/* Ticket Info */}
            <div className="card-ticket p-6 animate-slide-up delay-100">
              <h2 className="text-2xl font-bold mb-6">Ticket Information</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">
                    Available Seats
                  </p>
                  <p className="text-xl font-bold flex items-center gap-2">
                    <FaTicketAlt className="text-primary" />
                    {ticket.ticketQuantity} tickets
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm mb-2">Vendor</p>
                  <p className="text-xl font-bold flex items-center gap-2">
                    <FaUser className="text-primary" />
                    {ticket.vendorName}
                  </p>
                </div>
              </div>
            </div>

            {/* Perks */}
            {ticket.perks && ticket.perks.length > 0 && (
              <div className="card-ticket p-6 animate-slide-up delay-200">
                <h2 className="text-2xl font-bold mb-4">Included Perks</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {ticket.perks.map((perk, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg"
                    >
                      <FaCheckCircle className="text-success flex-shrink-0" />
                      <span className="font-medium">{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking */}
          <div>
            <div className="card-ticket p-6 sticky top-24 animate-slide-up delay-300">
              <h3 className="text-2xl font-bold mb-6">Book Your Ticket</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg">
                  <span className="text-muted-foreground">
                    Price per ticket
                  </span>
                  <span className="text-xl font-bold">${ticket.price}</span>
                </div>

                <div className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg">
                  <span className="text-muted-foreground">Available</span>
                  <span className="text-xl font-bold">
                    {ticket.ticketQuantity}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowModal(true)}
                disabled={isBookingDisabled()}
                className="btn-accent w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBookingDisabled() ? 'Booking Unavailable' : 'Book Now'}
              </button>

              {isBookingDisabled() && (
                <p className="text-destructive text-sm mt-3 text-center">
                  {ticket.ticketQuantity === 0 ? 'Sold Out' : 'Booking Closed'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="card-ticket max-w-md w-full p-8 animate-scale-in">
              <h2 className="text-2xl font-bold mb-6">Confirm Booking</h2>

              <form onSubmit={handleBooking}>
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">
                    Number of Tickets (Max: {ticket.ticketQuantity})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={ticket.ticketQuantity}
                    value={bookingQuantity}
                    onChange={e => setBookingQuantity(parseInt(e.target.value))}
                    className="input-field text-center text-2xl font-bold"
                    required
                  />
                </div>

                <div className="p-4 bg-secondary/50 rounded-lg mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="text-3xl font-bold gradient-text">
                      ${ticket.price * bookingQuantity}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-accent flex-1">
                    Confirm Booking
                  </button>
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
