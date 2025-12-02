import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaBook, FaTshirt, FaUtensils, FaLaptop, FaBicycle, FaGamepad, FaArrowRight, FaUsers, FaHandshake, FaShieldAlt } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const Home = () => {
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const features = [
        {
            icon: <FaHandshake className="w-8 h-8" />,
            title: "Borrow & Lend",
            description: "Share textbooks, notes, and study materials with fellow students",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: <FaUsers className="w-8 h-8" />,
            title: "Community Driven",
            description: "Connect with hostel mates and build a sharing economy",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: <FaShieldAlt className="w-8 h-8" />,
            title: "Safe & Secure",
            description: "Trade within your trusted hostel community",
            color: "from-green-500 to-emerald-500"
        }
    ];

    const categories = [
        { name: "Books", icon: <FaBook />, color: "from-blue-500 to-cyan-500", count: "120+" },
        { name: "Clothing", icon: <FaTshirt />, color: "from-purple-500 to-pink-500", count: "85+" },
        { name: "Food", icon: <FaUtensils />, color: "from-orange-500 to-red-500", count: "45+" },
        { name: "Electronics", icon: <FaLaptop />, color: "from-green-500 to-emerald-500", count: "67+" },
        { name: "Sports", icon: <FaBicycle />, color: "from-yellow-500 to-amber-500", count: "34+" },
        { name: "Games", icon: <FaGamepad />, color: "from-indigo-500 to-blue-500", count: "52+" }
    ];

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-[#F9E7B2]/20 via-white to-[#D34E4E]/5">
                <Navbar />

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Content */}
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={staggerContainer}
                            >
                                <motion.div
                                    variants={fadeInUp}
                                    className="inline-flex items-center gap-2 bg-[#F9E7B2]/50 text-[#D34E4E] px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-[#D34E4E]/20"
                                >
                                    <span className="w-2 h-2 bg-[#D34E4E] rounded-full animate-pulse"></span>
                                    Join 500+ Students
                                </motion.div>

                                <motion.h1
                                    variants={fadeInUp}
                                    className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                                >
                                    Your Hostel's
                                    <span className="block text-[#D34E4E]">
                                        Sharing Hub
                                    </span>
                                </motion.h1>

                                <motion.p
                                    variants={fadeInUp}
                                    className="text-xl text-gray-600 mb-8 leading-relaxed"
                                >
                                    Borrow, lend, buy, and sell within your hostel community. Connect with neighbors and make student life easier together.
                                </motion.p>

                                <motion.div
                                    variants={fadeInUp}
                                    className="flex flex-wrap gap-4"
                                >
                                    <Link
                                        to="/signup"
                                        className="group bg-[#E87C7C] hover:bg-[#E66A6A] text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-xl shadow-[#E87C7C]/30 hover:shadow-[#E87C7C]/50 hover:-translate-y-1 inline-flex items-center gap-2"
                                    >
                                        Get Started Free
                                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        to="/listings"
                                        className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 inline-flex items-center gap-2 border-2 border-gray-200"
                                    >
                                        Browse Items
                                    </Link>
                                </motion.div>

                                <motion.div
                                    variants={fadeInUp}
                                    className="mt-12 flex flex-wrap items-center gap-6"
                                >
                                    <div className="flex items-center gap-3 bg-[#F9E7B2]/30 backdrop-blur-sm px-5 py-3 rounded-xl border border-[#D34E4E]/20">
                                        <div className="w-10 h-10 bg-[#D34E4E] rounded-lg flex items-center justify-center text-white text-xl">
                                            ✓
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">Trusted Platform</div>
                                            <div className="text-xs text-gray-600">Hostel-Verified</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 bg-[#F9E7B2]/30 backdrop-blur-sm px-5 py-3 rounded-xl border border-[#D34E4E]/20">
                                        <div className="w-10 h-10 bg-[#D34E4E] rounded-lg flex items-center justify-center text-white text-xl">
                                            ⚡
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">Instant Connect</div>
                                            <div className="text-xs text-gray-600">Quick Deals</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Right Visual */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative"
                            >
                                <div className="relative bg-gradient-to-br from-[#D34E4E] to-[#F9E7B2] rounded-3xl p-1 shadow-2xl">
                                    <div className="bg-white rounded-3xl p-8">
                                        <div className="grid grid-cols-2 gap-4">
                                            {categories.slice(0, 4).map((cat) => (
                                                <div
                                                    key={cat.name}
                                                    className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-100 hover:border-indigo-200 transition-all hover:-translate-y-1 cursor-pointer"
                                                >
                                                    <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center text-white text-2xl mb-3 shadow-lg`}>
                                                        {cat.icon}
                                                    </div>
                                                    <div className="font-semibold text-gray-900">{cat.name}</div>
                                                    <div className="text-sm text-gray-500">{cat.count} items</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full blur-2xl opacity-60"></div>
                                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400 rounded-full blur-2xl opacity-60"></div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="text-center mb-16"
                        >
                            <motion.h2
                                variants={fadeInUp}
                                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                            >
                                Why Choose <span className="text-[#D34E4E]">NeedItNow</span>?
                            </motion.h2>
                            <motion.p
                                variants={fadeInUp}
                                className="text-xl text-gray-600 max-w-2xl mx-auto"
                            >
                                The simplest way to share, trade, and connect with your hostel community
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid md:grid-cols-3 gap-8"
                        >
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={fadeInUp}
                                    className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[#D34E4E]/30 hover:-translate-y-2"
                                >
                                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="text-center mb-16"
                        >
                            <motion.h2
                                variants={fadeInUp}
                                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                            >
                                Browse by <span className="text-[#D34E4E]">Category</span>
                            </motion.h2>
                            <motion.p
                                variants={fadeInUp}
                                className="text-xl text-gray-600"
                            >
                                Find exactly what you need from your hostel community
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
                        >
                            {categories.map((cat) => (
                                <motion.div
                                    key={cat.name}
                                    variants={fadeInUp}
                                    className="group cursor-pointer"
                                >
                                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-center hover:-translate-y-2 border-2 border-gray-100 hover:border-[#D34E4E]/30">
                                        <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-white text-3xl shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                                            {cat.icon}
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-1">{cat.name}</h3>
                                        <p className="text-sm text-gray-500">{cat.count}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative bg-gradient-to-r from-[#D34E4E] to-[#F9E7B2] rounded-3xl p-12 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

                            <div className="relative text-center">
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                    Ready to Get Started?
                                </h2>
                                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                                    Join your hostel community today and start sharing, trading, and connecting with neighbors
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    <Link
                                        to="/signup"
                                        className="bg-white text-[#D34E4E] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center gap-2"
                                    >
                                        Create Free Account
                                        <FaArrowRight />
                                    </Link>
                                    <Link
                                        to="/listings"
                                        className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all inline-flex items-center gap-2"
                                    >
                                        Explore Items
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative bg-gradient-to-br from-gray-900 via-[#2C3E50] to-gray-900 text-gray-300 py-16 overflow-hidden"
            >
                {/* Decorative animated blobs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-0 right-0 w-96 h-96 bg-[#D34E4E]/20 rounded-full blur-3xl"
                ></motion.div>
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-0 left-0 w-96 h-96 bg-[#F9E7B2]/20 rounded-full blur-3xl"
                ></motion.div>

                <div className="w-full relative">
                    {/* Main Footer Content */}
                    <div className="w-full mb-12 px-8 sm:px-12 lg:px-16">
                        <div className="grid md:grid-cols-2 gap-12 items-start">
                            {/* Brand Section */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <motion.div
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                        className="w-14 h-14 bg-gradient-to-br from-[#D34E4E] to-[#F9E7B2] rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl"
                                    >
                                        N
                                    </motion.div>
                                    <span className="text-3xl font-bold text-white">NeedItNow</span>
                                </div>
                                <p className="text-gray-400 text-lg leading-relaxed mb-6 max-w-md">
                                    Your hostel's premier sharing community platform. Connect, share, and trade with your neighbors.
                                </p>
                            </motion.div>

                            {/* Quick Links */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="md:ml-auto"
                            >
                                <h3 className="font-bold text-white mb-6 text-2xl">Quick Links</h3>
                                <ul className="grid grid-cols-2 gap-4">
                                    <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                        <Link to="/listings" className="text-gray-400 hover:text-[#D34E4E] transition-colors flex items-center gap-2 text-lg group">
                                            <span className="w-2 h-2 bg-[#D34E4E] rounded-full group-hover:scale-150 transition-transform"></span>
                                            Browse Items
                                        </Link>
                                    </motion.li>
                                    <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                        <Link to="/signup" className="text-gray-400 hover:text-[#D34E4E] transition-colors flex items-center gap-2 text-lg group">
                                            <span className="w-2 h-2 bg-[#D34E4E] rounded-full group-hover:scale-150 transition-transform"></span>
                                            Sign Up
                                        </Link>
                                    </motion.li>
                                    <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                        <Link to="/login" className="text-gray-400 hover:text-[#D34E4E] transition-colors flex items-center gap-2 text-lg group">
                                            <span className="w-2 h-2 bg-[#D34E4E] rounded-full group-hover:scale-150 transition-transform"></span>
                                            Login
                                        </Link>
                                    </motion.li>
                                    <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                        <Link to="/dashboard" className="text-gray-400 hover:text-[#D34E4E] transition-colors flex items-center gap-2 text-lg group">
                                            <span className="w-2 h-2 bg-[#D34E4E] rounded-full group-hover:scale-150 transition-transform"></span>
                                            Dashboard
                                        </Link>
                                    </motion.li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="border-t border-gray-700/50 pt-8 w-full px-8 sm:px-12 lg:px-16"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-gray-400 text-base">
                                &copy; 2025 NeedItNow. All rights reserved.
                            </p>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <span>Made with</span>
                                <motion.span
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ duration: 1, repeat: Infinity }}
                                    className="text-[#D34E4E]"
                                >
                                    ❤️
                                </motion.span>
                                <span>for students</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.footer>
        </>
    );
};

export default Home;
