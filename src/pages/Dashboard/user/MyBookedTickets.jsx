// ========== 1. User Dashboard - MyBookedTickets.jsx ==========
import { useState, useEffect } from 'react';
// import { useAuth } from '../../../contexts/AuthContext';
import {
  FaTicketAlt,
  FaClock,
  FaMapMarkerAlt,
  FaCreditCard,
  FaTimes,
} from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../../contexts/AuthProvider';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ booking, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/create-payment-intent`,
        { amount: booking.totalPrice }
      );

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-ticket max-w-md w-full p-8 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Complete Payment</h2>
          <button onClick={onCancel} className="btn-ghost p-2">
            <FaTimes />
          </button>
        </div>

        <div className="mb-6 p-4 bg-secondary/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
          <p className="text-3xl font-bold gradient-text">
            ${booking.totalPrice}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">
              Card Details
            </label>
            <div className="p-4 border-2 border-input rounded-lg bg-background">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#1e293b',
                      '::placeholder': {
                        color: '#94a3b8',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="btn-outline flex-1"
              disabled={processing}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || processing}
              className="btn-accent flex-1"
            >
              {processing ? 'Processing...' : `Pay $${booking.totalPrice}`}
            </button>
          </div>
        </form>
      </div>
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
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/user/${user.email}`
      );
      setBookings(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = status => {
    const badges = {
      pending: 'badge-pending',
      accepted: 'badge-accepted',
      rejected: 'badge-rejected',
      paid: 'badge-paid',
    };
    return badges[status] || 'badge';
  };

  const canPay = booking => {
    const now = new Date();
    const departure = new Date(booking.departureDateTime);
    return booking.status === 'accepted' && now < departure;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div
          className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4"
          style={{ borderColor: 'hsl(221 83% 53%)' }}
        ></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="section-title">My Booked Tickets</h1>
          <p className="text-muted-foreground">
            View and manage your ticket bookings
          </p>
        </div>
        <div className="badge badge-paid text-lg px-4 py-2">
          {bookings.length} Bookings
        </div>
      </div>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking, index) => (
            <div
              key={booking._id}
              className="card-ticket animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="relative">
                <img
                  src={booking.image}
                  alt={booking.ticketTitle}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`badge ${getStatusBadge(
                      booking.status
                    )} text-xs font-bold uppercase`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold mb-3 line-clamp-1">
                  {booking.ticketTitle}
                </h3>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FaMapMarkerAlt className="flex-shrink-0" />
                    <span>
                      {booking.from} → {booking.to}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FaTicketAlt className="flex-shrink-0" />
                    <span>
                      {booking.bookingQuantity} × ${booking.unitPrice}
                    </span>
                  </div>

                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold gradient-text">
                      ${booking.totalPrice}
                    </p>
                  </div>
                </div>

                {booking.status !== 'rejected' && (
                  <div className="glass-card p-3 rounded-lg mb-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      Departs
                    </p>
                    <p className="font-semibold">
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
                    className="btn-accent w-full flex items-center justify-center gap-2"
                  >
                    <FaCreditCard />
                    Pay Now
                  </button>
                )}

                {booking.status === 'paid' && (
                  <div className="text-center py-2 text-success font-semibold">
                    ✓ Payment Completed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 card-ticket">
          <div className="text-6xl mb-4">🎫</div>
          <h3 className="text-2xl font-bold mb-2">No Bookings Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start exploring and book your first ticket
          </p>
          <a href="/all-tickets" className="btn-primary inline-block">
            Browse Tickets
          </a>
        </div>
      )}

      {selectedBooking && (
        <Elements stripe={stripePromise}>
          <PaymentForm
            booking={selectedBooking}
            onSuccess={() => {
              setSelectedBooking(null);
              fetchBookings();
            }}
            onCancel={() => setSelectedBooking(null)}
          />
        </Elements>
      )}
    </div>
  );
};

export default MyBookedTickets;
