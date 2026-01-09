// pages/dashboard/user/BookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../contexts/AuthProvider';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaBus,
  FaCalendar,
  FaMapMarkerAlt,
  FaUsers,
  FaTicketAlt,
  FaCreditCard,
  FaCheck,
  FaArrowLeft,
  FaTimes,
} from 'react-icons/fa';
import { useAuth } from '../../../contexts/AuthProvider';

const BookingPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState({
    passengerName: '',
    passengerPhone: '',
    passengerEmail: '',
    specialRequest: '',
  });

  // Fetch ticket details
  useEffect(() => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }

    const fetchTicket = async () => {
      try {
        setLoading(true);
        console.log(`Fetching ticket with ID: ${id}`);

        const response = await axios.get(`/api/tickets/${id}`);

        if (response.data.success) {
          const ticketData = response.data.ticket;
          console.log('Ticket data:', ticketData);

          // Check if ticket is available for booking
          if (ticketData.verificationStatus !== 'approved') {
            toast.error('This ticket is not approved for booking');
            navigate('/dashboard/my-bookings');
            return;
          }

          if (ticketData.quantity <= 0) {
            toast.error('No tickets available');
            navigate('/all-tickets');
            return;
          }

          setTicket(ticketData);
          setFormData(prev => ({
            ...prev,
            passengerName: user.displayName || '',
            passengerEmail: user.email || '',
          }));
        } else {
          toast.error('Ticket not found');
          navigate('/all-tickets');
        }
      } catch (error) {
        console.error('Error fetching ticket:', error);
        toast.error('Failed to load ticket details');
        navigate('/all-tickets');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTicket();
    }
  }, [id, user, navigate]);

  // Update total price when quantity changes
  useEffect(() => {
    if (ticket && quantity > 0) {
      setTotalPrice(ticket.price * quantity);
    }
  }, [quantity, ticket]);

  // Handle form input changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.passengerName.trim()) {
      toast.error('Passenger name is required');
      return false;
    }
    if (!formData.passengerPhone.trim()) {
      toast.error('Passenger phone is required');
      return false;
    }
    if (quantity < 1) {
      toast.error('Select at least 1 ticket');
      return false;
    }
    if (quantity > ticket.quantity) {
      toast.error(`Only ${ticket.quantity} tickets available`);
      return false;
    }
    return true;
  };

  // Handle booking submission
  const handleBookingSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setBookingLoading(true);

      // Get user token
      const token = await user.getIdToken();

      const bookingData = {
        ticketId: id,
        quantity: quantity,
        passengerName: formData.passengerName,
        passengerPhone: formData.passengerPhone,
        passengerEmail: formData.passengerEmail || user.email,
        specialRequest: formData.specialRequest,
      };

      console.log('Submitting booking:', bookingData);

      const response = await axios.post('/api/bookings', bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Booking response:', response.data);

      if (response.data.success) {
        toast.success('Booking request submitted successfully!');
        // Navigate to my bookings page
        navigate('/dashboard/my-bookings');
      } else {
        toast.error(response.data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);

      if (error.response) {
        console.error(
          'Server error:',
          error.response.status,
          error.response.data
        );
        toast.error(
          error.response.data?.message || 'Server error during booking'
        );
      } else if (error.request) {
        console.error('No response:', error.request);
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(error.message || 'Booking failed');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Ticket Not Found</h2>
          <button
            onClick={() => navigate('/all-tickets')}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Browse Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <button
            onClick={() => navigate('/all-tickets')}
            className="hover:text-orange-500 flex items-center gap-1"
          >
            <FaArrowLeft className="text-xs" /> Back to Tickets
          </button>
          <span>/</span>
          <span className="text-orange-500">Booking</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Ticket Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FaCreditCard className="text-orange-500" />
                Complete Your Booking
              </h2>

              {/* Ticket Info Card */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-5 mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Ticket Summary
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FaBus className="text-green-500" />
                      <div>
                        <p className="text-sm text-gray-500">Transport</p>
                        <p className="font-medium capitalize">
                          {ticket.transportType || 'Bus'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className="text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Route</p>
                        <p className="font-medium">
                          {ticket.from} → {ticket.to}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FaCalendar className="text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-500">Departure</p>
                        <p className="font-medium">
                          {new Date(ticket.departure).toLocaleDateString(
                            'en-US',
                            {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            }
                          )}
                          <br />
                          <span className="text-sm">
                            {new Date(ticket.departure).toLocaleTimeString(
                              'en-US',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaTicketAlt className="text-orange-500" />
                      <div>
                        <p className="text-sm text-gray-500">Available</p>
                        <p className="font-medium">{ticket.quantity} seats</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleBookingSubmit}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Passenger Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="passengerName"
                      value={formData.passengerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter passenger name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="passengerPhone"
                      value={formData.passengerPhone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="passengerEmail"
                      value={formData.passengerEmail}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Number of Tickets *
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                      >
                        <FaTimes />
                      </button>

                      <div className="flex-1 text-center">
                        <span className="text-2xl font-bold">{quantity}</span>
                        <p className="text-sm text-gray-500">tickets</p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(Math.min(ticket.quantity, quantity + 1))
                        }
                        disabled={quantity >= ticket.quantity}
                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
                      >
                        <FaCheck />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Special Request (Optional)
                  </label>
                  <textarea
                    name="specialRequest"
                    value={formData.specialRequest}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Any special requests or instructions..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                >
                  {bookingLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing Booking...
                    </>
                  ) : (
                    <>
                      <FaCreditCard />
                      Confirm Booking - ${totalPrice.toFixed(2)}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Price Summary */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Price Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Unit Price
                  </span>
                  <span className="font-bold">
                    ${ticket.price?.toFixed(2) || '0.00'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Quantity
                  </span>
                  <span className="font-bold">{quantity}</span>
                </div>

                <div className="border-t border-gray-300 dark:border-gray-600 pt-3 mt-3">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold">Total Amount</span>
                    <span className="font-bold text-2xl text-orange-500">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="mt-8 pt-6 border-t border-gray-300 dark:border-gray-600">
                <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                  Important Notes
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Booking requires vendor approval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Payment will be made after vendor approval</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                    <span>Cancel anytime before vendor approval</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
