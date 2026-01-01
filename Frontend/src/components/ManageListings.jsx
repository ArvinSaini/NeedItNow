import React, { useState, useEffect } from 'react';
import { FaBox, FaTrash, FaSearch, FaMoneyBillWave, FaHandHoldingHeart } from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const ManageListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, lend, sell

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://needitnow-backend-ctbfahbeajfzbedw.eastasia-01.azurewebsites.net/listings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setListings(data.listings);
      } else {
        console.error('Failed to fetch listings');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://needitnow-backend-ctbfahbeajfzbedw.eastasia-01.azurewebsites.net/admin/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchListings();
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' ? true : listing.type === filterType;

    return matchesSearch && matchesFilter;
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Listings</p>
              <p className="text-3xl font-bold mt-2">{listings.length}</p>
            </div>
            <FaBox className="text-5xl opacity-30" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">For Lending</p>
              <p className="text-3xl font-bold mt-2">{listings.filter(l => l.type === 'lend').length}</p>
            </div>
            <FaHandHoldingHeart className="text-5xl opacity-30" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">For Selling</p>
              <p className="text-3xl font-bold mt-2">{listings.filter(l => l.type === 'sell').length}</p>
            </div>
            <FaMoneyBillWave className="text-5xl opacity-30" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, category, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D34E4E] focus:ring-2 focus:ring-[#D34E4E]/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${filterType === 'all'
                  ? 'bg-[#D34E4E] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('lend')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${filterType === 'lend'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Lend
            </button>
            <button
              onClick={() => setFilterType('sell')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${filterType === 'sell'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Sell
            </button>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <motion.div
            key={listing._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            <div className={`h-2 ${listing.type === 'lend' ? 'bg-purple-500' : 'bg-green-500'
              }`}></div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-1">{listing.title}</h3>
                  <p className="text-sm text-gray-500">{listing.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${listing.type === 'lend'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-green-100 text-green-700'
                  }`}>
                  {listing.type.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>

              {listing.type === 'sell' && (
                <div className="mb-4">
                  <span className="text-2xl font-bold text-[#D34E4E]">₹{listing.price}</span>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4 mb-4">
                <p className="text-sm text-gray-500 mb-1">Owner</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#D34E4E] to-[#F9E7B2] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {listing.owner?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{listing.owner?.name}</p>
                    <p className="text-xs text-gray-500">{listing.owner?.hostel}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDeleteListing(listing._id)}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-all"
              >
                <FaTrash />
                Delete Listing
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <p className="text-gray-500 text-lg">No listings found</p>
        </div>
      )}
    </div>
  );
};

export default ManageListings;
