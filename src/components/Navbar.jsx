import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Home, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const [isOpen, setIsOpen] = useState(false);

    // Close menu when route changes
    React.useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    return (
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/50 transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-24">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-4 group">
                        <div className="p-2 bg-white/40 rounded-2xl border border-white/50 transition-transform group-hover:scale-105 shadow-inner">
                            <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Eyas Drapist Logo" className="w-14 h-14 object-contain drop-shadow-sm" />
                        </div>
                        <div className="block">
                            <div className="text-2xl font-serif font-bold text-secondary-900 tracking-wide group-hover:text-primary-600 transition-colors">
                                Eyas Drapist
                            </div>
                            <div className="text-sm text-secondary-600 font-medium tracking-widest uppercase opacity-90">Namakkal</div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-2">
                        <Link to="/" className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${isActive('/') ? 'bg-secondary-900 text-white shadow-lg' : 'text-secondary-800 hover:bg-white/50 hover:text-primary-600'}`}>
                            <Home className="w-5 h-5 inline mr-2" />
                            <span>Home</span>
                        </Link>
                        <Link to="/book" className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${isActive('/book') ? 'bg-secondary-900 text-white shadow-lg' : 'text-secondary-800 hover:bg-white/50 hover:text-primary-600'}`}>
                            <Calendar className="w-5 h-5 inline mr-2" />
                            <span>Book</span>
                        </Link>
                        <Link to="/track" className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${isActive('/track') ? 'bg-secondary-900 text-white shadow-lg' : 'text-secondary-800 hover:bg-white/50 hover:text-primary-600'}`}>
                            <Search className="w-5 h-5 inline mr-2" />
                            <span>Track</span>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-secondary-200">
                                <span className="text-sm font-bold text-secondary-900 bg-white/50 px-3 py-1 rounded-full border border-white">
                                    {user.name || user.username}
                                </span>
                                <button onClick={logout} className="px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 font-medium transition-colors">
                                    Logout
                                </button>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="px-3 py-2 rounded-lg text-sm bg-primary-600 text-white hover:bg-primary-700 font-medium transition-colors shadow-md">
                                        Dashboard
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-secondary-200">
                                <Link to="/login" className="px-4 py-2 rounded-xl text-secondary-800 hover:bg-white/50 font-semibold transition-all">
                                    Log In
                                </Link>
                                <Link to="/signup" className="px-4 py-2 rounded-xl bg-secondary-900 text-white hover:bg-black font-semibold shadow-lg hover:shadow-xl transition-all">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-secondary-900 hover:bg-white/50 transition-colors focus:outline-none"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-200 shadow-2xl animate-slide-down rounded-b-2xl">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link to="/" className={`block px-4 py-3 rounded-xl font-semibold transition-all ${isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                            <Home className="w-5 h-5 inline mr-3" />
                            Home
                        </Link>
                        <Link to="/book" className={`block px-4 py-3 rounded-xl font-semibold transition-all ${isActive('/book') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                            <Calendar className="w-5 h-5 inline mr-3" />
                            Book Appointment
                        </Link>
                        <Link to="/track" className={`block px-4 py-3 rounded-xl font-semibold transition-all ${isActive('/track') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                            <Search className="w-5 h-5 inline mr-3" />
                            Track Order
                        </Link>

                        <div className="border-t border-gray-100 my-2 pt-2">
                            {user ? (
                                <>
                                    <div className="px-4 py-2 text-sm text-gray-500 font-medium">
                                        Signed in as <span className="text-primary-600 font-bold">{user.name || user.username}</span>
                                    </div>
                                    {user.role === 'admin' && (
                                        <Link to="/admin" className="block px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button onClick={logout} className="w-full text-left px-4 py-3 rounded-xl font-semibold text-red-500 hover:bg-red-50">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 px-2 mt-2">
                                    <Link to="/login" className="text-center px-4 py-3 rounded-xl border border-primary-200 text-primary-700 font-bold hover:bg-primary-50">
                                        Log In
                                    </Link>
                                    <Link to="/signup" className="text-center px-4 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-lg">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
