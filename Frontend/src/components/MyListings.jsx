import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id || user._id; // Backend returns 'id', not '_id'
    console.log('Fetching listings for user:', userId);

    try {
      const response = await fetch(`https://needitnow-ui-ux-project.onrender.com/product/owner/${userId}`);
      const data = await response.json();
      console.log('MyListings API response:', data);

      if (response.ok) {
        // Backend returns { count, listings }, so extract listings array
        const listingsArray = data.listings || data || [];
        console.log('Setting listings:', listingsArray);
        setListings(listingsArray);
      } else {
        console.error('Error response:', data);
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`https://needitnow-ui-ux-project.onrender.com/product/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setListings(listings.filter(listing => listing._id !== id));
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  const handleEdit = (listing) => {
    setEditingId(listing._id);
    setEditForm({
      title: listing.title,
      description: listing.description,
      category: listing.category,
      type: listing.type,
      price: listing.price || '',
      status: listing.status
    });
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`https://needitnow-backend-ctbfahbeajfzbedw.eastasia-01.azurewebsites.net/product/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedListing = await response.json();
        setListings(listings.map(l => l._id === id ? updatedListing.listing : l));
        setEditingId(null);
      }
    } catch (err) {
      console.error('Error updating listing:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">📦</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No listings yet</h3>
        <p className="text-gray-600 mb-8">Start sharing items with your hostel community!</p>
        <p className="text-gray-500 text-sm">Click "Add Listing" in the sidebar to create your first one</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-600">{listings.length} {listings.length === 1 ? 'item' : 'items'} listed</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
          >
            {editingId === listing._id ? (
              <div className="p-6 space-y-4">
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-coral-500 focus:outline-none"
                  placeholder="Title"
                />
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-coral-500 focus:outline-none"
                  placeholder="Description"
                  rows="3"
                />
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-coral-500 focus:outline-none"
                >
                  <option value="electronics">Electronics</option>
                  <option value="books">Books</option>
                  <option value="sports">Sports</option>
                  <option value="utensils">Utensils</option>
                  <option value="clothing">Clothing</option>
                  <option value="stationery">Stationery</option>
                  <option value="other">Other</option>
                </select>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-coral-500 focus:outline-none"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="borrowed">Borrowed</option>
                </select>
                {editForm.type === 'sell' && (
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-coral-500 focus:outline-none"
                    placeholder="Price"
                  />
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(listing._id)}
                    className="flex-1 bg-[#D34E4E] text-white py-2 rounded-lg hover:bg-[#B33E3E] transition"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="h-32 bg-gradient-to-br from-coral-100 to-coral-200 flex items-center justify-center">
                  <span className="text-5xl">
                    {listing.category === 'electronics' && '📱'}
                    {listing.category === 'books' && '📚'}
                    {listing.category === 'sports' && '⚽'}
                    {listing.category === 'utensils' && '🍴'}
                    {listing.category === 'clothing' && '👕'}
                    {listing.category === 'stationery' && '✏️'}
                    {listing.category === 'other' && '📦'}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{listing.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${listing.type === 'lend' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                      {listing.type}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">{listing.category}</span>
                    <span className={`text-xs px-2 py-1 rounded ${listing.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
                      }`}>
                      {listing.status}
                    </span>
                    {listing.type === 'sell' && listing.price && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold">
                        ₹{listing.price}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(listing)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition text-sm"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition text-sm"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyListings;
