import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Home, Search } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-primary-50/95 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <img src="/images/logo.png" alt="Eyas Drapist Logo" className="w-12 h-12 rounded-2xl shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:shadow-primary-500/40 transition-all duration-300 group-hover:scale-105 object-contain bg-white/10 backdrop-blur-sm" />
                        <div className="hidden sm:block">
                            <div className="text-xl font-serif font-bold text-gradient-primary">
                                Eyas Drapist
                            </div>
                            <div className="text-xs text-gray-500">Namakkal</div>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-2">
                        <Link
                            to="/"
                            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${isActive('/')
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <Home className="w-5 h-5 inline mr-2" />
                            <span className="hidden sm:inline">Home</span>
                        </Link>

                        <Link
                            to="/book"
                            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${isActive('/book')
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <Calendar className="w-5 h-5 inline mr-2" />
                            <span className="hidden sm:inline">Book</span>
                        </Link>

                        <Link
                            to="/track"
                            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${isActive('/track')
                                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <Search className="w-5 h-5 inline mr-2" />
                            <span className="hidden sm:inline">Track</span>
                        </Link>

                        <Link
                            to="/admin/login"
                            className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors opacity-70 hover:opacity-100"
                        >
                            Admin
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
