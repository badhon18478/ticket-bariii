import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const BookingModal = ({ ticket, onClose, onSubmit }) => {
  const { theme } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuantityChange = e => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= ticket.ticketQuantity) {
      setQuantity(value);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (quantity < 1) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({ quantity });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`w-full max-w-md rounded-lg p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Book Ticket</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">{ticket.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {ticket.from} → {ticket.to}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Price per ticket: ${ticket.price}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Available: {ticket.ticketQuantity} tickets
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium mb-2"
            >
              Number of Tickets
            </label>
            <input
              type="number"
              id="quantity"
              min="1"
              max={ticket.ticketQuantity}
              value={quantity}
              onChange={handleQuantityChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Price:</span>
              <span className="text-xl font-bold text-blue-500">
                ${ticket.price * quantity}
              </span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-md border transition ${
                theme === 'dark'
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default BookingModal;
