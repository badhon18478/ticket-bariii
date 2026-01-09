import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../../contexts/AuthProvider';
import LoadingSpinner from '../../../components/LoadingSpinner';
import {
  FaCheck,
  FaTimes,
  FaSearch,
  FaFilter,
  FaEye,
  FaTicketAlt,
  FaCalendar,
  FaDollarSign,
  FaBus,
  FaTrain,
  FaShip,
  FaPlane,
} from 'react-icons/fa';
import moment from 'moment';

const ManageTickets = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch all tickets with admin authentication
  const {
    data: ticketsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adminTickets'],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/tickets/admin/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data.tickets || [];
      } catch (err) {
        console.error('Error fetching tickets:', err);
        throw new Error('Failed to fetch tickets');
      }
    },
    enabled: !!token, // Only fetch if token is available
    retry: 1,
  });

  // Approve ticket mutation
  const approveMutation = useMutation({
    mutationFn: async ticketId => {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/tickets/${ticketId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Ticket approved successfully');
      queryClient.invalidateQueries(['adminTickets']);
    },
    onError: error => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to approve ticket';
      toast.error(errorMessage);
    },
  });

  // Reject ticket mutation
  const rejectMutation = useMutation({
    mutationFn: async ticketId => {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/tickets/${ticketId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Ticket rejected');
      queryClient.invalidateQueries(['adminTickets']);
    },
    onError: error => {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to reject ticket';
      toast.error(errorMessage);
    },
  });

  // Filter tickets
  const filteredTickets = React.useMemo(() => {
    if (!ticketsData) return [];

    return ticketsData.filter(ticket => {
      const matchesSearch =
        searchTerm === '' ||
        (ticket.title &&
          ticket.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ticket.vendorName &&
          ticket.vendorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ticket.from &&
          ticket.from.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ticket.to &&
          ticket.to.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'all' || ticket.verificationStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [ticketsData, searchTerm, statusFilter]);

  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getTransportIcon = type => {
    if (!type) return <FaBus className="text-gray-500" />;

    switch (type.toLowerCase()) {
      case 'bus':
        return <FaBus className="text-green-500" />;
      case 'train':
        return <FaTrain className="text-blue-500" />;
      case 'launch':
        return <FaShip className="text-purple-500" />;
      case 'plane':
        return <FaPlane className="text-red-500" />;
      default:
        return <FaBus className="text-gray-500" />;
    }
  };

  const formatDate = date => {
    if (!date) return 'N/A';
    return moment(date).format('DD MMM YYYY');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
        <span className="ml-3 text-gray-600 dark:text-gray-300">
          Loading tickets...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
          Failed to Load Tickets
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {error.message || 'Unable to fetch tickets. Please try again.'}
        </p>
        <button
          onClick={() => queryClient.invalidateQueries(['adminTickets'])}
          className="btn-primary px-6 py-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Manage Tickets
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Approve or reject tickets submitted by vendors
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Total Tickets
            </div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {ticketsData?.length || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Tickets
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title, vendor, or route"
                className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status Filter
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {ticketsData?.filter(t => t.verificationStatus === 'pending')
                  .length || 0}
              </div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                Pending
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {ticketsData?.filter(t => t.verificationStatus === 'approved')
                  .length || 0}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                Approved
              </div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {ticketsData?.filter(t => t.verificationStatus === 'rejected')
                  .length || 0}
              </div>
              <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                Rejected
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        {filteredTickets?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ticket Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Price & Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTickets.map(ticket => (
                  <tr
                    key={ticket._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-start space-x-4">
                        <img
                          src={ticket.image || '/default-ticket.jpg'}
                          alt={ticket.title}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={e => {
                            e.target.src = '/default-ticket.jpg';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-white truncate">
                            {ticket.title || 'Untitled Ticket'}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            {getTransportIcon(ticket.transportType)}
                            <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                              {ticket.transportType || 'N/A'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {ticket.from || 'Unknown'} →{' '}
                            {ticket.to || 'Unknown'}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <FaCalendar />
                            <span>{formatDate(ticket.departure)}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {ticket.vendorName || 'Unknown Vendor'}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {ticket.vendorEmail || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <FaDollarSign className="text-green-500" />
                          <span className="font-bold">
                            ${ticket.price?.toFixed(2) || '0.00'}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            per ticket
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FaTicketAlt className="text-blue-500" />
                          <span className="font-bold">
                            {ticket.quantity || 0}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            available
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          ticket.verificationStatus
                        )}`}
                      >
                        {ticket.verificationStatus === 'pending' && '⏳'}
                        {ticket.verificationStatus === 'approved' && '✓'}
                        {ticket.verificationStatus === 'rejected' && '✗'}
                        <span className="ml-1 capitalize">
                          {ticket.verificationStatus || 'unknown'}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            window.open(`/ticket/${ticket._id}`, '_blank')
                          }
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>

                        {ticket.verificationStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => approveMutation.mutate(ticket._id)}
                              disabled={approveMutation.isLoading}
                              className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Approve"
                            >
                              <FaCheck />
                            </button>
                            <button
                              onClick={() => rejectMutation.mutate(ticket._id)}
                              disabled={rejectMutation.isLoading}
                              className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Reject"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}

                        {ticket.verificationStatus === 'approved' && (
                          <button
                            onClick={() => rejectMutation.mutate(ticket._id)}
                            disabled={rejectMutation.isLoading}
                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        )}

                        {ticket.verificationStatus === 'rejected' && (
                          <button
                            onClick={() => approveMutation.mutate(ticket._id)}
                            disabled={approveMutation.isLoading}
                            className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              No Tickets Found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search filters'
                : 'No tickets have been submitted yet'}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                className="mt-4 px-6 py-2 btn-secondary"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTickets;
