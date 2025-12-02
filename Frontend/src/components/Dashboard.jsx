import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaList, FaPlus, FaEnvelope, FaPlusCircle, FaSignOutAlt, FaUser, FaUsers, FaBox, FaClipboardList, FaThList, FaClipboardCheck } from 'react-icons/fa';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import MyListings from './MyListings';
import AddListing from './AddListing';
import MyRequests from './MyRequests';
import AddRequest from './AddRequest';
import ManageUsers from './ManageUsers';
import ManageListings from './ManageListings';
import ManageRequests from './ManageRequests';
import BrowseListings from './BrowseListings';
import BrowseRequests from './BrowseRequests';

// NavButton component moved outside to prevent recreation on every render
// eslint-disable-next-line no-unused-vars
const NavButton = ({ tab, icon: IconComponent, label, isActive, onTabChange }) => (
  <button
    onClick={() => onTabChange(tab)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold group ${isActive
      ? 'bg-white text-[#D34E4E] shadow-2xl transform scale-105'
      : 'bg-white/10 hover:bg-white/20 hover:translate-x-2'
      }`}
  >
    <IconComponent className={`text-lg ${isActive ? 'text-[#D34E4E]' : 'text-white group-hover:scale-110 transition-transform'}`} />
    <span className="text-sm">{label}</span>
  </button>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('myListings');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F9E7B2]/20 to-[#D34E4E]/10">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#D34E4E] mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9E7B2]/30 via-[#FFE5E5] to-[#D34E4E]/10 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-96 bg-gradient-to-b from-[#D34E4E] via-[#E87C7C] to-[#D34E4E] text-white p-6 flex flex-col shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

        {/* Logo */}
        <div className="mb-4 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#D34E4E] text-xl font-bold shadow-2xl transform hover:rotate-6 transition-transform cursor-pointer">
              N
            </div>
            <div>
              <span className="text-xl font-bold block">NeedItNow</span>
              <p className="text-white/70 text-xs">Hostel Sharing Platform</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="mb-4 pb-3 border-b border-white/20 relative z-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 hover:bg-white/20 transition-all group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-white to-[#F9E7B2] rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <FaUser className="text-[#D34E4E] text-xl" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-base mb-1">{user?.name}</p>
                <p className="text-xs text-white/80 mb-1">{user?.hostel} - Room {user?.roomNumber}</p>
                {user?.role === 'admin' && (
                  <span className="inline-block px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-lg">
                    👑 Admin
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 relative z-10 overflow-hidden">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 px-2">Browse</p>
          <NavButton tab="allListings" icon={FaThList} label="All Listings" isActive={activeTab === 'allListings'} onTabChange={setActiveTab} />
          <NavButton tab="allRequests" icon={FaClipboardCheck} label="All Requests" isActive={activeTab === 'allRequests'} onTabChange={setActiveTab} />

          <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 px-2 pt-2">My Items</p>
          <NavButton tab="myListings" icon={FaList} label="My Listings" isActive={activeTab === 'myListings'} onTabChange={setActiveTab} />
          <NavButton tab="addListing" icon={FaPlus} label="Add Listing" isActive={activeTab === 'addListing'} onTabChange={setActiveTab} />
          <NavButton tab="myRequests" icon={FaEnvelope} label="My Requests" isActive={activeTab === 'myRequests'} onTabChange={setActiveTab} />
          <NavButton tab="addRequest" icon={FaPlusCircle} label="Add Request" isActive={activeTab === 'addRequest'} onTabChange={setActiveTab} />

          {/* Admin Section */}
          {user?.role === 'admin' && (
            <>
              <div className="pt-2 pb-1 px-2 border-t border-white/20 mt-2">
                <p className="text-yellow-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <span>⚡</span> Admin Panel
                </p>
              </div>
              <NavButton tab="manageUsers" icon={FaUsers} label="Manage Users" isActive={activeTab === 'manageUsers'} onTabChange={setActiveTab} />
              <NavButton tab="manageListings" icon={FaBox} label="Manage Listings" isActive={activeTab === 'manageListings'} onTabChange={setActiveTab} />
              <NavButton tab="manageRequests" icon={FaClipboardList} label="Manage Requests" isActive={activeTab === 'manageRequests'} onTabChange={setActiveTab} />
            </>
          )}
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="relative z-10 flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-600/90 hover:bg-red-600 transition-all mt-3 font-semibold hover:shadow-2xl hover:scale-105 group"
        >
          <FaSignOutAlt className="text-base group-hover:translate-x-1 transition-transform" />
          <span className="text-sm">Logout</span>
        </button>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50/50">
        {/* Header */}
        <div className="bg-white shadow-lg border-b-2 border-[#D34E4E]/20 px-8 py-5 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#D34E4E] to-[#E87C7C] bg-clip-text text-transparent mb-1">
                {activeTab === 'allListings' && '🛒 All Listings'}
                {activeTab === 'allRequests' && '🔍 All Requests'}
                {activeTab === 'myListings' && '📦 My Listings'}
                {activeTab === 'addListing' && '➕ Create New Listing'}
                {activeTab === 'myRequests' && '📬 My Requests'}
                {activeTab === 'addRequest' && '✨ Create New Request'}
                {activeTab === 'manageUsers' && '👥 Manage Users'}
                {activeTab === 'manageListings' && '📦 Manage All Listings'}
                {activeTab === 'manageRequests' && '📋 Manage All Requests'}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                {activeTab === 'allListings' && 'Browse and respond to all community listings'}
                {activeTab === 'allRequests' && 'See what others are looking for and help them out'}
                {activeTab === 'myListings' && 'Manage all your shared items'}
                {activeTab === 'addListing' && 'Share an item with your community'}
                {activeTab === 'myRequests' && 'Track your item requests'}
                {activeTab === 'addRequest' && 'Request an item you need'}
                {activeTab === 'manageUsers' && 'View and manage all platform users'}
                {activeTab === 'manageListings' && 'Oversee all product listings'}
                {activeTab === 'manageRequests' && 'Monitor all user requests'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="font-bold text-[#D34E4E]">{user?.name}</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'allListings' && <BrowseListings key="browse" />}
            {activeTab === 'allRequests' && <BrowseRequests key="browseRequests" />}
            {activeTab === 'myListings' && <MyListings key="myListings" />}
            {activeTab === 'addListing' && <AddListing key="addListing" onSuccess={() => setActiveTab('myListings')} />}
            {activeTab === 'myRequests' && <MyRequests key="myRequests" />}
            {activeTab === 'addRequest' && <AddRequest key="addRequest" onSuccess={() => setActiveTab('myRequests')} />}
            {activeTab === 'manageUsers' && <ManageUsers />}
            {activeTab === 'manageListings' && <ManageListings />}
            {activeTab === 'manageRequests' && <ManageRequests />}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
