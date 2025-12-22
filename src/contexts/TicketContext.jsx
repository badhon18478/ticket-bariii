import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import useAxiosSecure from '../hooks/useAxiosSecure';

const TicketContext = createContext();

export const useTicket = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicket must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosSecure = useAxiosSecure();
  // Fetch all tickets
  const fetchTickets = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axiosSecure.get(`/api/tickets/approved`, {
        params,
      });
      setTickets(response.data.tickets);
      return response.data;
    } catch (error) {
      setError(error.message);
      console.error('Fetch tickets error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch advertised tickets
  const fetchAdvertisedTickets = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/tickets/advertised`
      );
      return response.data;
    } catch (error) {
      console.error('Fetch advertised tickets error:', error);
      return [];
    }
  };

  // Fetch latest tickets
  const fetchLatestTickets = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/tickets/latest`
      );
      return response.data;
    } catch (error) {
      console.error('Fetch latest tickets error:', error);
      return [];
    }
  };

  // Get ticket by ID
  const getTicketById = async id => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/tickets/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Get ticket error:', error);
      throw error;
    }
  };

  // Book ticket
  const bookTicket = async (ticketId, quantity) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/bookings`,
        {
          ticketId,
          quantity,
          bookingDate: new Date().toISOString(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Book ticket error:', error);
      throw error;
    }
  };

  // Get vendor tickets
  const getVendorTickets = async email => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/tickets/vendor/${email}`
      );
      return response.data;
    } catch (error) {
      console.error('Get vendor tickets error:', error);
      return [];
    }
  };

  // Add ticket (Vendor)
  const addTicket = async ticketData => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/tickets`,
        ticketData
      );
      return response.data;
    } catch (error) {
      console.error('Add ticket error:', error);
      throw error;
    }
  };

  // Update ticket (Vendor)
  const updateTicket = async (id, ticketData) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/tickets/${id}`,
        ticketData
      );
      return response.data;
    } catch (error) {
      console.error('Update ticket error:', error);
      throw error;
    }
  };

  // Delete ticket (Vendor)
  const deleteTicket = async id => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/tickets/${id}`
      );
      return response.data;
    } catch (error) {
      console.error('Delete ticket error:', error);
      throw error;
    }
  };

  // Get user bookings
  const getUserBookings = async email => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/bookings/user/${email}`
      );
      return response.data;
    } catch (error) {
      console.error('Get user bookings error:', error);
      return [];
    }
  };

  // Get vendor bookings
  const getVendorBookings = async email => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/bookings/vendor/${email}`
      );
      return response.data;
    } catch (error) {
      console.error('Get vendor bookings error:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const value = {
    tickets,
    loading,
    error,
    fetchTickets,
    fetchAdvertisedTickets,
    fetchLatestTickets,
    getTicketById,
    bookTicket,
    getVendorTickets,
    addTicket,
    updateTicket,
    deleteTicket,
    getUserBookings,
    getVendorBookings,
  };

  return (
    <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
  );
};
