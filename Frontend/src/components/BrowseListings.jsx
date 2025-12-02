import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaBook, FaTshirt, FaUtensils, FaLaptop, FaBicycle, FaGamepad, FaTools, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const BrowseListings = () => {
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
      const response = await fetch('https://needitnow-ui-ux-project.onrender.com/product');
      const data = await response.json();

      const listingsArray = data.listings || data || [];

      setListings(listingsArray);
      setFilteredListings(listingsArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
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
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredListings(filtered);
  }, [selectedCategory, selectedType, searchQuery, listings]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D34E4E]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9E7B2]/20 via-white to-[#D34E4E]/10">
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search listings..."
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

        {/* Type Filter */}
        <div className="mb-8 flex justify-center gap-4">
          <button
            onClick={() => setSelectedType('All')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${selectedType === 'All'
                ? 'bg-[#D34E4E] text-white shadow-xl'
                : 'bg-white text-gray-700 hover:shadow-lg'
              }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedType('lend')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${selectedType === 'lend'
                ? 'bg-[#D34E4E] text-white shadow-xl'
                : 'bg-white text-gray-700 hover:shadow-lg'
              }`}
          >
            Lend
          </button>
          <button
            onClick={() => setSelectedType('sell')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${selectedType === 'sell'
                ? 'bg-[#D34E4E] text-white shadow-xl'
                : 'bg-white text-gray-700 hover:shadow-lg'
              }`}
          >
            Sell
          </button>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Found <span className="font-bold text-[#D34E4E]">{filteredListings.length}</span> listings
          </p>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No listings found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden hover:scale-105"
              >
                <div className={`h-2 bg-gradient-to-r ${categories[listing.category]?.color || categories.Other.color}`}></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{listing.title}</h3>
                      <div className="flex gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${listing.type === 'lend'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                          }`}>
                          {listing.type === 'lend' ? '🤝 Lend' : '💰 Sell'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                          {listing.category}
                        </span>
                      </div>
                    </div>
                    {(listing.price || listing.price === 0) && (
                      <div className="text-2xl font-bold text-[#D34E4E]">
                        ₹{listing.price}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{listing.description}</p>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaMapMarkerAlt className="text-[#D34E4E]" />
                      <span>Hostel {listing.owner?.hostel} - Room {listing.owner?.roomNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaPhone className="text-[#D34E4E]" />
                      <span>{listing.owner?.phone}</span>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-700">Contact: {listing.owner?.name}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${listing.status === 'available'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                      }`}>
                      {listing.status === 'available' ? '✅ Available' : '❌ Not Available'}
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

export default BrowseListings;
