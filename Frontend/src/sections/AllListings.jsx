import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaBook, FaTshirt, FaUtensils, FaLaptop, FaBicycle, FaGamepad, FaTools, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const AllListings = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
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

  const fetchListings = useCallback(async () => {
    try {
      const response = await fetch('https://needitnow-backend-ctbfahbeajfzbedw.eastasia-01.azurewebsites.net/product');
      const data = await response.json();

      // Backend returns { count, listings } so we need to extract the listings array
      const listingsArray = data.listings || data || [];

      setListings(listingsArray);
      setFilteredListings(listingsArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]);
      setFilteredListings([]);
      setLoading(false);
    }
  }, []);

  const filterListings = useCallback(() => {
    let filtered = listings;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item =>
        item.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedType !== 'All') {
      filtered = filtered.filter(item =>
        item.type.toLowerCase() === selectedType.toLowerCase()
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredListings(filtered);
  }, [listings, searchQuery, selectedCategory, selectedType]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    filterListings();
  }, [filterListings]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9E7B2]/20 via-white to-[#D34E4E]/5">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Browse <span className="text-[#D34E4E]">All Listings</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover items shared by your hostel community
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-xl" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for items..."
                className="w-full pl-14 pr-6 py-4 text-lg bg-white border-2 border-gray-200 rounded-2xl focus:border-[#D34E4E] focus:ring-4 focus:ring-[#D34E4E]/10 outline-none transition-all shadow-lg"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {Object.keys(categories).map((category) => {
                const cat = categories[category];
                const isSelected = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{ backgroundColor: isSelected ? '#6B7280' : '#ffffff', color: isSelected ? 'white' : '#374151' }}
                    className={`group flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${isSelected
                        ? 'shadow-lg transform scale-105'
                        : 'border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <span className={isSelected ? 'text-xl' : 'text-lg group-hover:scale-110 transition-transform'}>
                      {cat.icon}
                    </span>
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Type Filter */}
          <div className="mb-10 flex justify-center gap-4">
            {['All', 'Lend', 'Sell'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-8 py-3 rounded-xl font-semibold transition-all ${selectedType === type
                    ? 'bg-[#D34E4E] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              Found <span className="font-bold text-[#D34E4E]">{filteredListings.length}</span> {filteredListings.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-[#F9E7B2] border-t-[#D34E4E] rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading listings...</p>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => {
                // Find category by matching lowercase names
                const categoryKey = Object.keys(categories).find(
                  key => key.toLowerCase() === listing.category?.toLowerCase()
                ) || 'Other';
                const cat = categories[categoryKey];

                return (
                  <div
                    key={listing._id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-[#D34E4E]/30 hover:-translate-y-2"
                  >
                    {/* Card Header */}
                    <div className={`h-2 bg-gradient-to-r ${cat.color}`}></div>

                    <div className="p-6">
                      {/* Category Icon & Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                          {cat.icon}
                        </div>
                        {(listing.price || listing.price === 0) && (
                          <span className="text-2xl font-bold text-[#D34E4E]">₹{listing.price}</span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#D34E4E] transition-colors">
                        {listing.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {listing.description}
                      </p>

                      {/* Status & Type Badges */}
                      <div className="mb-4 flex gap-2 items-center">
                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${listing.status === 'Available'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          {listing.status}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${listing.type === 'Lend'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                          }`}>
                          {listing.type}
                        </span>
                      </div>

                      {/* Owner Info */}
                      <div className="border-t border-gray-100 pt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaMapMarkerAlt className="text-[#D34E4E]" />
                          <span className="font-medium">Hostel {listing.owner?.hostel}</span>
                          <span className="text-gray-400">•</span>
                          <span>Room {listing.owner?.roomNumber}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FaPhone className="text-[#D34E4E]" />
                          <span>{listing.owner?.phone}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          Owner: {listing.owner?.name}
                        </div>
                      </div>


                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllListings;
