import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaBuilding, FaDoorOpen, FaArrowRight } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    hostel: '',
    roomNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('https://needitnow.onrender.com/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(data.error || data.message || 'Failed to create account');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: 'name', type: 'text', placeholder: 'Full Name', icon: <FaUser /> },
    { name: 'email', type: 'email', placeholder: 'Email Address', icon: <FaEnvelope /> },
    { name: 'password', type: 'password', placeholder: 'Password', icon: <FaLock /> },
    { name: 'phone', type: 'tel', placeholder: 'Phone Number', icon: <FaPhone /> },
    { name: 'hostel', type: 'text', placeholder: 'Hostel Name', icon: <FaBuilding /> },
    { name: 'roomNumber', type: 'text', placeholder: 'Room Number', icon: <FaDoorOpen /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9E7B2]/30 via-white to-[#D34E4E]/10 relative overflow-hidden">
      <Navbar />

      {/* Animated Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#D34E4E]/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-[#F9E7B2] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-[#D34E4E]/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          {/* Glassmorphism Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 bg-[#D34E4E] rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-xl"
              >
                N
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Join your hostel community today</p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6"
              >
                {error}
              </motion.div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                {inputFields.map((field) => (
                  <div key={field.name} className={field.name === 'email' || field.name === 'password' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                      {field.name.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        {field.icon}
                      </div>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-[#D34E4E] focus:ring-4 focus:ring-[#D34E4E]/10 outline-none transition-all"
                        placeholder={field.placeholder}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-1 border-gray-300 rounded text-[#D34E4E] focus:ring-[#D34E4E]"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-[#D34E4E] hover:text-[#c24040] font-semibold">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-[#D34E4E] hover:text-[#c24040] font-semibold">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: '#D34E4E' }}
                className="w-full hover:bg-[#c24040] text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <FaArrowRight />}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-6 text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#D34E4E] hover:text-[#c24040] font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
