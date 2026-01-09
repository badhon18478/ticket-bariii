// src/components/PaymentModal.jsx
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaCreditCard,
  FaLock,
  FaSpinner,
  FaTimes,
  FaCheckCircle,
  FaBarcode,
  FaMoneyBill,
  FaMobileAlt,
} from 'react-icons/fa';

const PaymentModal = ({
  isOpen,
  onClose,
  amount,
  bookingId,
  ticketId,
  quantity,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [manualPaymentInfo, setManualPaymentInfo] = useState({
    transactionId: '',
    phoneNumber: '',
    paymentMethod: 'bkash',
  });

  if (!isOpen) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (paymentMethod === 'card') {
      await handleCardPayment();
    } else {
      await handleManualPayment();
    }
  };

  const handleCardPayment = async () => {
    if (!stripe || !elements) {
      toast.error('Stripe is not loaded');
      return;
    }

    setProcessing(true);

    try {
      // 1. Create payment intent
      const response = await axios.post(
        'http://localhost:5000/api/create-payment-intent',
        {
          amount: amount,
          bookingId: bookingId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const { clientSecret } = response.data;

      // 2. Confirm card payment
      const cardElement = elements.getElement(CardElement);

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
          },
        });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // 3. Save transaction
        await saveTransaction(paymentIntent.id);
        toast.success('Payment successful!');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Payment failed');
      toast.error(error.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleManualPayment = async () => {
    setLoading(true);
    try {
      // For manual payments like bKash, Nagad, Rocket
      const response = await axios.post(
        'http://localhost:5000/api/transactions',
        {
          paymentIntentId: `manual_${Date.now()}`,
          bookingId: bookingId,
          ticketId: ticketId,
          amount: amount,
          quantity: quantity,
          paymentMethod: manualPaymentInfo.paymentMethod,
          transactionId: manualPaymentInfo.transactionId,
          phoneNumber: manualPaymentInfo.phoneNumber,
          status: 'pending_verification',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      if (response.data.success) {
        toast.success('Payment information submitted! Vendor will verify.');
        onSuccess();
        onClose();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Manual payment error:', error);
      setError(error.message || 'Payment submission failed');
      toast.error(error.message || 'Payment submission failed');
    } finally {
      setLoading(false);
    }
  };

  const saveTransaction = async paymentIntentId => {
    try {
      await axios.post(
        'http://localhost:5000/api/transactions',
        {
          paymentIntentId: paymentIntentId,
          bookingId: bookingId,
          ticketId: ticketId,
          amount: amount,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
    } catch (error) {
      console.error('Save transaction error:', error);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <FaCreditCard className="text-2xl text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Complete Payment
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl"
            >
              <FaTimes />
            </button>
          </div>

          {/* Amount Display */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 dark:text-gray-300">Total Amount</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Booking ID: {bookingId?.slice(-8)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">
                  ${amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {quantity} ticket(s)
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Select Payment Method
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
              >
                <FaCreditCard
                  className={`text-2xl mb-2 ${
                    paymentMethod === 'card' ? 'text-blue-500' : 'text-gray-400'
                  }`}
                />
                <span className="font-medium">Credit/Debit Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'
                }`}
              >
                <FaMobileAlt
                  className={`text-2xl mb-2 ${
                    paymentMethod === 'bkash'
                      ? 'text-pink-500'
                      : 'text-gray-400'
                  }`}
                />
                <span className="font-medium">bKash</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                  paymentMethod === 'nagad'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                }`}
              >
                <FaBarcode
                  className={`text-2xl mb-2 ${
                    paymentMethod === 'nagad'
                      ? 'text-green-500'
                      : 'text-gray-400'
                  }`}
                />
                <span className="font-medium">Nagad</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                  paymentMethod === 'cash'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-yellow-300'
                }`}
              >
                <FaMoneyBill
                  className={`text-2xl mb-2 ${
                    paymentMethod === 'cash'
                      ? 'text-yellow-500'
                      : 'text-gray-400'
                  }`}
                />
                <span className="font-medium">Cash</span>
              </button>
            </div>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === 'card' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Card Details
                </label>
                <div className="p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700">
                  <CardElement options={cardElementOptions} />
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <FaLock className="mr-2 text-green-500" />
                <span>Your payment is secured with 256-bit SSL encryption</span>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {processing ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    Pay ${amount.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          )}

          {/* Manual Payment Form */}
          {paymentMethod !== 'card' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {paymentMethod !== 'cash' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={manualPaymentInfo.phoneNumber}
                      onChange={e =>
                        setManualPaymentInfo({
                          ...manualPaymentInfo,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="01XXXXXXXXX"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Transaction ID
                    </label>
                    <input
                      type="text"
                      value={manualPaymentInfo.transactionId}
                      onChange={e =>
                        setManualPaymentInfo({
                          ...manualPaymentInfo,
                          transactionId: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter transaction ID"
                      required
                    />
                  </div>

                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Send ${amount.toFixed(2)} to{' '}
                      {paymentMethod === 'bkash'
                        ? 'bKash: 017XXXXXXXX'
                        : paymentMethod === 'nagad'
                        ? 'Nagad: 017XXXXXXXX'
                        : 'Rocket: 017XXXXXXXX'}
                    </p>
                  </div>
                </>
              )}

              {paymentMethod === 'cash' && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200">
                    Please pay ${amount.toFixed(2)} in cash to the vendor. Your
                    booking will be confirmed after payment.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Confirm Payment
                  </>
                )}
              </button>
            </form>
          )}

          {/* Security Info */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FaLock className="text-green-500" />
              <span>Secure payment • 100% Safe • Money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
