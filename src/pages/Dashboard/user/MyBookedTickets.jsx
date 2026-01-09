import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthProvider';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiClock, FiMapPin, FiCalendar } from 'react-icons/fi';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe('your_stripe_publishable_key');

const PaymentModal = ({ booking, onClose, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-payment-intent`,
        {
          amount: booking.totalPrice,
        }
      );

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        await axios.patch(
          `${import.meta.env.VITE_API_URL}/bookings/${booking._id}`,
          {
            status: 'paid',
            transactionId: paymentIntent.id,
          }
        );
        toast.success('Payment successful!');
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error('Payment failed');
    }
    setProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Complete Payment
        </h3>
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Amount:{' '}
            <span className="font-bold text-primary">
              ${booking.totalPrice}
            </span>
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 p-3 border rounded">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': { color: '#aab7c4' },
                  },
                },
              }}
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={!stripe || processing}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CountdownTimer = ({ departureDateTime }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const departure = new Date(departureDateTime).getTime();
      const distance = departure - now;

      if (distance < 0) {
        setTimeLeft('Expired');
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [departureDateTime]);

  return (
    <div className="flex items-center space-x-2 text-sm">
      <FiClock className="text-primary" />
      <span
        className={
          timeLeft === 'Expired'
            ? 'text-red-500'
            : 'text-gray-600 dark:text-gray-400'
        }
      >
        {timeLeft}
      </span>
    </div>
  );
};

const MyBookedTickets = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings?email=${user.email}`
      );
      setBookings(data);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'accepted':
        return 'bg-blue-500';
      case 'rejected':
        return 'bg-red-500';
      case 'paid':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const canPay = booking => {
    const now = new Date().getTime();
    const departure = new Date(booking.departureDateTime).getTime();
    return booking.status === 'accepted' && departure > now;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        My Booked Tickets
      </h2>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No bookings found. Start booking your tickets!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map(booking => (
            <div
              key={booking._id}
              className="card hover:shadow-xl transition-shadow"
            >
              <img
                src={booking.ticketImage}
                alt={booking.ticketTitle}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {booking.ticketTitle}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <FiMapPin />
                  <span>
                    {booking.from} → {booking.to}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <FiCalendar />
                  <span>
                    {new Date(booking.departureDateTime).toLocaleString()}
                  </span>
                </div>

                {booking.status !== 'rejected' && (
                  <CountdownTimer
                    departureDateTime={booking.departureDateTime}
                  />
                )}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Quantity:
                  </span>
                  <span className="font-semibold">
                    {booking.bookingQuantity}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Price:
                  </span>
                  <span className="font-bold text-primary">
                    ${booking.totalPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    Status:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              {canPay(booking) && (
                <button
                  onClick={() => setSelectedBooking(booking)}
                  className="btn-primary w-full mt-4"
                >
                  Pay Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedBooking && (
        <Elements stripe={stripePromise}>
          <PaymentModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onSuccess={fetchBookings}
          />
        </Elements>
      )}
    </div>
  );
};

export default MyBookedTickets;
