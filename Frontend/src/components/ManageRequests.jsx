import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaTrash, FaSearch, FaExclamationCircle } from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://needitnow-ui-ux-project.onrender.com/admin/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      } else {
        console.error('Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://needitnow-ui-ux-project.onrender.com/admin/requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requester?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D34E4E]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Total Requests</p>
              <p className="text-3xl font-bold mt-2">{requests.length}</p>
            </div>
            <FaEnvelope className="text-5xl opacity-30" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Urgent Requests</p>
              <p className="text-3xl font-bold mt-2">{requests.filter(r => r.urgency === 'urgent').length}</p>
            </div>
            <FaExclamationCircle className="text-5xl opacity-30" />
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by item name, category, or requester..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D34E4E] focus:ring-2 focus:ring-[#D34E4E]/20 outline-none transition-all"
          />
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map((request) => (
          <motion.div
            key={request._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            <div className={`h-2 ${request.urgency === 'urgent' ? 'bg-red-500' :
                request.urgency === 'moderate' ? 'bg-orange-500' :
                  'bg-blue-500'
              }`}></div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-1">{request.title}</h3>
                  <p className="text-sm text-gray-500">{request.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${request.urgency === 'urgent' ? 'bg-red-100 text-red-700' :
                    request.urgency === 'moderate' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                  }`}>
                  {request.urgency.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{request.description}</p>

              {request.duration && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Duration Needed</p>
                  <p className="font-semibold text-gray-900">{request.duration}</p>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 mb-4">
                <p className="text-sm text-gray-500 mb-1">Requester</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#D34E4E] to-[#F9E7B2] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {request.requester?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{request.requester?.name}</p>
                    <p className="text-xs text-gray-500">{request.requester?.hostel}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDeleteRequest(request._id)}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-all"
              >
                <FaTrash />
                Delete Request
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <p className="text-gray-500 text-lg">No requests found</p>
        </div>
      )}
    </div>
  );
};

export default ManageRequests;
