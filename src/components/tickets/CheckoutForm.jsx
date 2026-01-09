// components/CheckoutForm.jsx
import React, { useState, useEffect } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CheckoutForm = ({ amount, bookingId, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  // Create payment intent
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await axios.post('/api/create-payment-intent', {
          amount: amount * 100, // Convert to cents
          bookingId,
        });

        if (response.data.success) {
          setClientSecret(response.data.clientSecret);
        } else {
          onError(new Error(response.data.message));
        }
      } catch (error) {
        console.error('Payment intent error:', error);
        onError(error);
      }
    };

    if (amount > 0 && bookingId) {
      createPaymentIntent();
    }
  }, [amount, bookingId, onError]);

  const handleSubmit = async event => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        setErrorMessage(error.message);
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Save transaction to database
        await axios.post('/api/transactions', {
          paymentIntentId: paymentIntent.id,
          bookingId,
          amount,
          status: 'completed',
        });

        // Update booking status to paid
        await axios.patch(`/api/bookings/${bookingId}/pay`);

        toast.success('Payment successful!');
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage(error.message);
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Card Details
        </label>
        <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {errorMessage && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
