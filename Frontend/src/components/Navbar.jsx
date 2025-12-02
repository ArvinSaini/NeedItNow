import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/listings', label: 'Browse' },
    { path: '/requests', label: 'Requests' },
    { path: '/aboutus', label: 'About Me' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-linear-to-r from-[#D34E4E] to-[#F9E7B2] shadow-lg'
        : 'bg-linear-to-r from-[#D34E4E] to-[#F9E7B2]'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#D34E4E] font-bold text-xl shadow-lg">
              N
            </div>
            <span className="text-2xl font-bold text-white hidden sm:block">
              NeedItNow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative font-medium transition-colors ${location.pathname === link.path
                  ? 'text-[#4338ca] font-bold'
                  : 'text-[#4338ca]/80 hover:text-[#4338ca]'
                  }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#4338ca]" />
                )}
              </Link>
            ))}
            <Link
              to="/login"
              className="text-[#4338ca]/80 hover:text-[#4338ca] font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-white text-[#4338ca] px-6 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 border-2 border-[#4338ca]/20"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="w-6 h-6 text-white" />
            ) : (
              <FaBars className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#D34E4E]/20">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 px-4 rounded-lg font-medium transition-colors ${location.pathname === link.path
                  ? 'bg-[#D34E4E] text-white'
                  : 'text-gray-700 hover:bg-[#F9E7B2]/30'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center bg-[#D34E4E] text-white py-2.5 rounded-lg font-bold shadow-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
