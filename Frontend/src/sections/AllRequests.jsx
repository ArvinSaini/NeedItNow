import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaBook, FaTshirt, FaUtensils, FaLaptop, FaBicycle, FaGamepad, FaTools, FaPhone, FaMapMarkerAlt, FaExclamationCircle } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const AllRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = {
    All: { icon: <FaSearch />, color: 'from-gray-500 to-gray-600' },
    Books: { icon: <FaBook />, color: 'from-blue-500 to-cyan-500' },
    Clothing: { icon: <FaTshirt />, color: 'from-purple-500 to-pink-500' },
    Food: { icon: <FaUtensils />, color: 'from-orange-500 to-red-500' },
    Electronics: { icon: <FaLaptop />, color: 'from-green-500 to-emerald-500' },
    Sports: { icon: <FaBicycle />, color: 'from-yellow-500 to-amber-500' },
    Gaming: { icon: <FaGamepad />, color: 'from-indigo-500 to-blue-500' },
    Other: { icon: <FaTools />, color: 'from-rose-500 to-pink-600' }
  };

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch('https://needitnow.onrender.com/request');
      const data = await response.json();

      const requestsArray = data.requests || data || [];

      setRequests(requestsArray);
      setFilteredRequests(requestsArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  useEffect(() => {
    let filtered = requests;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item =>
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedUrgency !== 'All') {
      filtered = filtered.filter(item =>
        item.urgency.toLowerCase() === selectedUrgency.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  }, [selectedCategory, selectedUrgency, searchQuery, requests]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D34E4E]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9E7B2]/20 via-white to-[#D34E4E]/10">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#4338ca] to-[#D34E4E] bg-clip-text text-transparent">
            Community Requests
          </h1>
          <p className="text-xl text-gray-600">See what your hostel mates are looking for and help them out!</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-[#D34E4E]/20 focus:border-[#D34E4E] focus:outline-none text-lg shadow-lg"
            />
            <FaSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-[#D34E4E] text-xl" />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-3 pb-4 min-w-max justify-center">
            {Object.keys(categories).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${selectedCategory === category
                    ? 'bg-[#D34E4E] text-white shadow-xl scale-105'
                    : 'bg-white text-gray-700 hover:shadow-lg hover:scale-105'
                  }`}
              >
                <span className="text-lg">{categories[category].icon}</span>
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Urgency Filter */}
        <div className="mb-8 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => setSelectedUrgency('All')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${selectedUrgency === 'All'
                ? 'bg-[#D34E4E] text-white shadow-xl'
                : 'bg-white text-gray-700 hover:shadow-lg'
              }`}
          >
            All Urgency
          </button>
          <button
            onClick={() => setSelectedUrgency('low')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${selectedUrgency === 'low'
                ? 'bg-[#D34E4E] text-white shadow-xl'
                : 'bg-white text-gray-700 hover:shadow-lg'
              }`}
          >
            Low
          </button>
          <button
            onClick={() => setSelectedUrgency('medium')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${selectedUrgency === 'medium'
                ? 'bg-[#D34E4E] text-white shadow-xl'
                : 'bg-white text-gray-700 hover:shadow-lg'
              }`}
          >
            Medium
          </button>
          <button
            onClick={() => setSelectedUrgency('high')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${selectedUrgency === 'high'
                ? 'bg-[#D34E4E] text-white shadow-xl'
                : 'bg-white text-gray-700 hover:shadow-lg'
              }`}
          >
            High
          </button>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Found <span className="font-bold text-[#D34E4E]">{filteredRequests.length}</span> active requests
          </p>
        </div>

        {/* Requests Grid */}
        {filteredRequests.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No requests found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <div
                key={request._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden hover:scale-105"
              >
                <div className={`h-2 bg-gradient-to-r ${categories[request.category]?.color || categories.Other.color}`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{request.title}</h3>
                      <div className="flex gap-2 mb-3 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${request.urgency === 'high'
                            ? 'bg-red-100 text-red-700'
                            : request.urgency === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                          <FaExclamationCircle className="inline mr-1" />
                          {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)} Urgency
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                          {request.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{request.description}</p>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-[#D34E4E]" />
                      <span>Hostel {request.requester?.hostel}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaPhone className="text-[#D34E4E]" />
                      <span>{request.requester?.phone}</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-700">Requester: {request.requester?.name}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${request.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : request.status === 'fulfilled'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                      {request.status === 'active' && '✅ Active'}
                      {request.status === 'fulfilled' && '🎉 Fulfilled'}
                      {request.status === 'cancelled' && '❌ Cancelled'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRequests;
