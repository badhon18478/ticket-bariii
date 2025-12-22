import { useEffect, useState } from 'react';
import axios from 'axios';
// import { useAuth } from '../../../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
// import { AuthContext } from '../../../AuthContext';
import { useAuth } from '../../../contexts/AuthProvider';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ booking, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      // Create payment intent
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/create-payment-intent`,
        { amount: booking.totalPrice }
      );

      // Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        // Save transaction
        await axios.post(`${import.meta.env.VITE_API_URL}/api/transactions`, {
          bookingId: booking._id,
          ticketId: booking.ticketId,
          userEmail: booking.userEmail,
          ticketTitle: booking.ticketTitle,
          amount: booking.totalPrice,
          quantity: booking.bookingQuantity,
          transactionId: result.paymentIntent.id,
          paymentDate: new Date(),
        });

        toast.success('Payment successful!');
        onSuccess();
      }
    } catch (error) {
      toast.error('Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-3 border rounded-md" />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-300"
      >
        {processing ? 'Processing...' : `Pay $${booking.totalPrice}`}
      </button>
    </form>
  );
};

const MyBookedTickets = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/user/${user.email}`
      );
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canPay = booking => {
    const now = new Date();
    const departure = new Date(booking.departureDateTime);
    return booking.status === 'accepted' && now < departure;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Booked Tickets</h1>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map(booking => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={booking.image}
                alt={booking.ticketTitle}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">
                  {booking.ticketTitle}
                </h3>
                <p className="text-gray-600 mb-1">
                  {booking.from} → {booking.to}
                </p>
                <p className="text-gray-600 mb-2">
                  Quantity: {booking.bookingQuantity} × ${booking.unitPrice}
                </p>
                <p className="text-2xl font-bold text-green-600 mb-2">
                  Total: ${booking.totalPrice}
                </p>

                <div className="mb-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </div>

                {booking.status !== 'rejected' && (
                  <div className="bg-blue-50 p-2 rounded mb-2">
                    <p className="text-sm">
                      Departs:{' '}
                      {formatDistanceToNow(
                        new Date(booking.departureDateTime),
                        { addSuffix: true }
                      )}
                    </p>
                  </div>
                )}

                {canPay(booking) && (
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No bookings yet</p>
      )}

      {/* Payment Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>
            <p className="mb-4">
              <strong>Ticket:</strong> {selectedBooking.ticketTitle}
            </p>
            <p className="text-2xl font-bold text-green-600 mb-4">
              Amount: ${selectedBooking.totalPrice}
            </p>

            <Elements stripe={stripePromise}>
              <PaymentForm
                booking={selectedBooking}
                onSuccess={() => {
                  setSelectedBooking(null);
                  fetchBookings();
                }}
              />
            </Elements>

            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-4 w-full bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookedTickets;
