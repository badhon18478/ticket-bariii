import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

// Stripe পাবলিক কী লোড করুন
const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({
  amount,
  bookingId,
  ticketId,
  quantity,
  onSuccess,
  onClose,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe is not loaded yet');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Firebase টোকেন নিন
      const token = await currentUser.getIdToken();

      // 2. Payment intent তৈরি করুন
      const response = await fetch(
        `${
          process.env.VITE_API_URL || 'http://localhost:5000'
        }/api/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount,
            bookingId,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Payment failed to initiate');
      }

      const { clientSecret, paymentIntentId } = data;

      // 3. Stripe payment confirm করুন
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status === 'succeeded') {
        // 4. ট্রানজেকশন সেভ করুন
        const saveResponse = await fetch(
          `${
            process.env.VITE_API_URL || 'http://localhost:5000'
          }/api/transactions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              paymentIntentId,
              bookingId,
              ticketId,
              amount,
              quantity,
            }),
          }
        );

        const saveData = await saveResponse.json();

        if (saveData.success) {
          toast.success('Payment completed successfully!');
          onSuccess();
        } else {
          throw new Error(saveData.message || 'Failed to save transaction');
        }
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      toast.error(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Card Details</label>
        <div className="p-3 border rounded-md bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Test Card: 4242 4242 4242 4242 | Exp: 12/34 | CVC: 123
        </p>
      </div>

      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded-md hover:bg-gray-50 transition"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className={`px-6 py-2 rounded-md font-medium transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {loading ? 'Processing...' : `Pay $${amount}`}
        </button>
      </div>
    </form>
  );
};

const PaymentModal = ({
  isOpen,
  onClose,
  amount,
  bookingId,
  ticketId,
  quantity,
  onSuccess,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            disabled={false}
          >
            &times;
          </button>
        </div>

        <div className="mb-6">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-green-500">${amount}</div>
            <p className="text-gray-600">Total Amount</p>
          </div>
          <div className="space-y-2 text-sm bg-gray-50 p-4 rounded">
            <div className="flex justify-between">
              <span className="font-medium">Booking ID:</span>
              <span>{bookingId?.slice(-8)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tickets:</span>
              <span>{quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount per ticket:</span>
              <span>${(amount / quantity).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm
            amount={amount}
            bookingId={bookingId}
            ticketId={ticketId}
            quantity={quantity}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </Elements>

        <div className="mt-4 text-xs text-gray-500">
          <p>Your payment is secure and encrypted.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentModal;
