import React, { useState, useEffect } from 'react';
import { FaUserShield, FaBan, FaCheckCircle, FaTrash, FaSearch } from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, blocked
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.userId);
      }
    } catch (e) {
      console.error('Error decoding token:', e);
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://needitnow-backend-ctbfahbeajfzbedw.eastasia-01.azurewebsites.net/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    if (!confirm('Are you sure you want to block this user?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://needitnow-backend-ctbfahbeajfzbedw.eastasia-01.azurewebsites.net/admin/users/${userId}/block`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://needitnow-backend-ctbfahbeajfzbedw.eastasia-01.azurewebsites.net/admin/users/${userId}/unblock`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://needitnow-backend-ctbfahbeajfzbedw.eastasia-01.azurewebsites.net/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.hostel.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' ? true :
      filterStatus === 'active' ? !user.isBlocked :
        user.isBlocked;

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
              <p className="text-blue-100 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold mt-2">{users.length}</p>
            </div>
            <FaUserShield className="text-5xl opacity-30" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Active Users</p>
              <p className="text-3xl font-bold mt-2">{users.filter(u => !u.isBlocked).length}</p>
            </div>
            <FaCheckCircle className="text-5xl opacity-30" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Blocked Users</p>
              <p className="text-3xl font-bold mt-2">{users.filter(u => u.isBlocked).length}</p>
            </div>
            <FaBan className="text-5xl opacity-30" />
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
              placeholder="Search by name, email, or hostel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#D34E4E] focus:ring-2 focus:ring-[#D34E4E]/20 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${filterStatus === 'all'
                  ? 'bg-[#D34E4E] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${filterStatus === 'active'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('blocked')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${filterStatus === 'blocked'
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              Blocked
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">User</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Hostel</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Role</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700">{user.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{user.hostel}</p>
                      {user.roomNumber && (
                        <p className="text-sm text-gray-500">Room {user.roomNumber}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.isBlocked
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                      }`}>
                      {user.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.isBlocked ? (
                        <button
                          onClick={() => handleUnblockUser(user._id)}
                          className="p-2 text-white rounded-lg transition-colors shadow-md"
                          style={{ backgroundColor: '#22c55e' }}
                          title="Unblock User"
                        >
                          <FaCheckCircle />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBlockUser(user._id)}
                          className={`p-2 text-white rounded-lg transition-colors shadow-md ${user._id === currentUserId ? 'cursor-not-allowed' : ''}`}
                          style={{ backgroundColor: user._id === currentUserId ? '#9ca3af' : '#f59e0b' }}
                          title={user._id === currentUserId ? "You cannot block yourself" : "Block User"}
                          disabled={user._id === currentUserId}
                        >
                          <FaBan />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className={`p-2 text-white rounded-lg transition-colors shadow-md ${user._id === currentUserId ? 'cursor-not-allowed' : ''}`}
                        style={{ backgroundColor: user._id === currentUserId ? '#9ca3af' : '#ef4444' }}
                        title={user._id === currentUserId ? "You cannot delete yourself" : "Delete User"}
                        disabled={user._id === currentUserId}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
