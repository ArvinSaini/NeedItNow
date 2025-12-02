import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const fetchMyRequests = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.id || user._id; // Backend returns 'id', not '_id'

    try {
      const response = await fetch(`https://needitnow-ui-ux-project.onrender.com/request/user/${userId}`);
      const data = await response.json();

      if (response.ok) {
        // Backend returns { count, requests }, so extract requests array
        setRequests(data.requests || data || []);
      }
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`https://needitnow-ui-ux-project.onrender.com/request/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setRequests(requests.filter(request => request._id !== id));
      }
    } catch (err) {
      console.error('Error deleting request:', err);
    }
  };

  const handleEdit = (request) => {
    setEditingId(request._id);
    setEditForm({
      title: request.title,
      description: request.description,
      category: request.category,
      urgency: request.urgency,
      status: request.status
    });
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`https://needitnow-ui-ux-project.onrender.com/request/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedRequest = await response.json();
        setRequests(requests.map(r => r._id === id ? updatedRequest.request : r));
        setEditingId(null);
      }
    } catch (err) {
      console.error('Error updating request:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">You haven't created any requests yet</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {requests.map(request => (
        <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
          {editingId === request._id ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Title"
              />
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Description"
                rows="3"
              />
              <select
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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
                value={editForm.urgency}
                onChange={(e) => setEditForm({ ...editForm, urgency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="active">Active</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(request._id)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{request.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  request.urgency === 'high' ? 'bg-red-100 text-red-600' :
                  request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {request.urgency}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{request.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm bg-gray-100 px-3 py-1 rounded">{request.category}</span>
                <span className={`text-sm px-3 py-1 rounded ${
                  request.status === 'active' ? 'bg-blue-100 text-blue-700' :
                  request.status === 'fulfilled' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {request.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(request)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(request._id)}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyRequests;
