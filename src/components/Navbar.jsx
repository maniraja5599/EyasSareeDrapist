import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Home, Search, Menu, X, User, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    // const user = { name: "Test User" }; const logout = () => { }; // MOCK FOR VERIFICATION

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-black shadow-2xl border-b border-primary-600/50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20 md:h-24 gap-4 md:gap-8">
                    {/* Logo & Branding */}
                    <div className="flex items-center space-x-2 md:space-x-4 group shrink-0">
                        <Link to="/" onClick={() => window.scrollTo(0, 0)} className="block p-1 md:p-2 bg-primary-900/20 rounded-2xl border border-primary-500/30 transition-transform group-hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                            <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Eyas Drapist Logo" className="w-10 h-10 md:w-14 md:h-14 object-contain drop-shadow-md brightness-110" />
                        </Link>

                        <div className="block text-left">
                            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="block text-base sm:text-xl md:text-2xl font-serif font-bold text-primary-400 tracking-wide group-hover:text-primary-300 transition-colors">
                                Eyas Drapist
                            </Link>
                            <div className="flex items-center gap-2 mt-0.5 text-[8px] sm:text-[10px] tracking-wider uppercase z-10 relative">
                                <a href="tel:+917502551633" className="flex items-center gap-1 text-white font-bold hover:text-primary-400 transition-colors cursor-pointer">
                                    <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-500" />
                                    NIVEDHIDHA
                                </a>
                                <span className="text-primary-800 text-[8px]">|</span>
                                <a href="https://maps.app.goo.gl/gSMHQpU9iGgsXWBB6" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-400 font-medium hover:text-primary-300 transition-colors cursor-pointer">
                                    <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-500" />
                                    NAMAKKAL
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Wait, the previous structure layout relied on flexbox. 
                       I need to reconstruct it carefully. 
                       The goal:
                       [Logo] [Block: [Title] [Subtitle]]
                    */}

                    {/* Navigation */}
                    <div className="flex items-center space-x-1 md:space-x-2">
                        <Link to="/" onClick={() => window.scrollTo(0, 0)} className={`px-3 py-2 md:px-4 md:py-2 rounded-xl font-semibold transition-all duration-300 ${isActive('/') ? 'bg-primary-600 text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'text-gray-300 hover:bg-primary-900/20 hover:text-primary-400'}`}>
                            <Home className="w-4 h-4 md:w-5 md:h-5 inline md:mr-2" />
                            <span className="hidden md:inline">Home</span>
                        </Link>
                        <Link to="/book" className={`px-3 py-2 md:px-4 md:py-2 rounded-xl font-semibold transition-all duration-300 ${isActive('/book') ? 'bg-primary-600 text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'text-gray-300 hover:bg-primary-900/20 hover:text-primary-400'}`}>
                            <Calendar className="w-4 h-4 md:w-5 md:h-5 inline md:mr-2" />
                            <span className="hidden md:inline">Book</span>
                        </Link>
                        <Link to="/track" className={`px-3 py-2 md:px-4 md:py-2 rounded-xl font-semibold transition-all duration-300 ${isActive('/track') ? 'bg-primary-600 text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'text-gray-300 hover:bg-primary-900/20 hover:text-primary-400'}`}>
                            <Search className="w-4 h-4 md:w-5 md:h-5 inline md:mr-2" />
                            <span className="hidden md:inline">Track</span>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-1 md:gap-2 ml-2 md:ml-4 pl-2 md:pl-4 border-l border-primary-900">
                                <Link to="/profile" className="hidden md:inline text-sm font-bold text-primary-400 bg-primary-900/20 px-3 py-1 rounded-full border border-primary-800 hover:bg-primary-900/40 transition-colors">
                                    {user.name || user.username}
                                </Link>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="px-3 py-2 rounded-lg text-sm bg-primary-600 text-black hover:bg-primary-500 font-medium transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]" title="Dashboard">
                                        <span className="hidden md:inline">Dashboard</span>
                                        <span className="md:hidden">Adm</span>
                                    </Link>
                                )}
                                <button onClick={logout} className="px-2 py-2 md:px-3 md:py-2 rounded-lg text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 font-medium transition-colors" title="Logout">
                                    <span className="hidden md:inline">Logout</span>
                                    <LogOut className="md:hidden w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-2 md:ml-4 pl-2 md:pl-4 border-l border-primary-900">
                                <Link to="/login" className="px-2 py-2 md:px-4 md:py-2 rounded-xl text-primary-400 hover:bg-primary-900/20 font-semibold transition-all border border-primary-800" title="Log In">
                                    <User className="w-4 h-4 md:hidden" />
                                    <span className="hidden md:inline">Log In</span>
                                </Link>
                                <Link to="/signup" className="hidden sm:inline-block px-3 py-2 md:px-4 md:py-2 rounded-xl bg-primary-600 text-black hover:bg-primary-500 font-semibold shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] transition-all text-xs md:text-base">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
