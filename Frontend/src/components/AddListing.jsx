import React, { useState } from 'react';

const AddListing = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'electronics',
    type: 'lend',
    price: '',
    status: 'available'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      const submitData = { ...formData };
      // Convert empty price to undefined
      if (!submitData.price || submitData.price === '') {
        delete submitData.price;
      }

      const response = await fetch('https://needitnow-backend-ctbfahbeajfzbedw.eastasia-01.azurewebsites.net/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Listing created successfully!');
        setFormData({
          title: '',
          description: '',
          category: 'electronics',
          type: 'lend',
          price: '',
          status: 'available'
        });
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        setError(data.error || 'Failed to create listing');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-2 border-green-200 text-green-700 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Item Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-coral-500 transition"
              placeholder="e.g., Scientific Calculator, Cricket Bat"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-coral-500 transition"
              placeholder="Describe your item in detail..."
              rows="4"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-coral-500 transition"
              >
                <option value="electronics">Electronics</option>
                <option value="books">Books</option>
                <option value="sports">Sports</option>
                <option value="utensils">Utensils</option>
                <option value="clothing">Clothing</option>
                <option value="stationery">Stationery</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-coral-500 transition"
              >
                <option value="lend">Lend</option>
                <option value="sell">Sell</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Price (₹) {formData.type === 'sell' ? '*' : '(Optional for lending)'}
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-coral-500 transition"
              placeholder={formData.type === 'lend' ? 'Leave empty for free lending or enter rental price' : 'Enter selling price in rupees'}
              required={formData.type === 'sell'}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-coral-500 transition"
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="borrowed">Borrowed</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: '#D34E4E', color: 'white' }}
            className="w-full py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddListing;
