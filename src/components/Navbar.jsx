import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Home, Search, Menu, X, User, Navigation, LogOut, ArrowLeft, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Stable spacer with constant height to prevent layout jumps. 
                Matches the height of the navbar in its default state (h-20 on mobile, h-24 on md) */}
            <div className="h-20 md:h-24 w-full bg-black" />

            <nav className={`fixed z-50 bg-black shadow-2xl transition-all duration-700 ease-in-out border-primary-600/50 
                ${isScrolled
                    ? 'top-4 left-4 right-4 rounded-2xl border md:top-6 md:left-6 md:right-6'
                    : 'top-0 left-0 right-0 w-full border-b'
                }`}
            >
                <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-in-out ${isScrolled ? 'py-1' : ''}`}>
                    <div className={`flex justify-between items-center gap-4 md:gap-8 transition-all duration-700 ease-in-out ${isScrolled ? 'h-16 md:h-20' : 'h-20 md:h-24'}`}>
                        {/* Logo & Branding */}
                        <div className="flex items-center space-x-3 md:space-x-6 group shrink-0">
                            <Link to="/" onClick={() => window.scrollTo(0, 0)} className={`block bg-primary-900/20 rounded-2xl border border-primary-500/30 transition-all duration-700 ease-in-out group-hover:scale-105 shadow-[0_0_15px_rgba(212,175,55,0.1)] ${isScrolled ? 'p-1' : 'p-1 md:p-2'}`}>
                                <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Eyas Drapist Logo" className={`object-contain drop-shadow-md brightness-110 transition-all duration-700 ease-in-out ${isScrolled ? 'w-10 h-10 md:w-12 md:h-12' : 'w-12 h-12 md:w-16 md:h-16'}`} />
                            </Link>

                            <div className="block text-left">
                                <Link to="/" onClick={() => window.scrollTo(0, 0)} className={`block font-serif font-black text-primary-400 tracking-wider group-hover:text-primary-300 transition-all duration-700 ease-in-out drop-shadow-[0_0_8px_rgba(212,175,55,0.6)] ${isScrolled ? 'text-2xl md:text-3xl' : 'text-2xl sm:text-3xl md:text-5xl'}`}>
                                    Eyas Drapist
                                </Link>
                                <div className={`flex items-center z-10 relative transition-all duration-300 ${isScrolled ? 'gap-2 mt-0.5' : 'gap-2 mt-1'}`}>
                                    <a href="tel:+917502551633" title="Click to Call" className={`flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 hover:from-primary-400 hover:via-primary-300 hover:to-primary-400 transition-all duration-300 group/phone shadow-lg shadow-primary-500/30 hover:shadow-primary-400/40 hover:scale-105 ${isScrolled ? 'px-2 py-1' : 'gap-1 px-2 py-1'}`}>
                                        <Phone className={`text-black transition-transform group-hover/phone:scale-110 ${isScrolled ? 'w-3 h-3 md:w-3.5 md:h-3.5' : 'w-3 h-3 md:w-4 md:h-4'}`} fill="currentColor" />
                                        <span className={`font-black tracking-wide text-black uppercase font-serif transition-colors ${isScrolled ? 'text-[8px] md:text-[9px]' : 'text-[9px] md:text-xs'}`}>
                                            Nivedhidha
                                        </span>
                                    </a>

                                    <a href="https://maps.app.goo.gl/gSMHQpU9iGgsXWBB6" target="_blank" rel="noopener noreferrer" title="Location" className={`flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 hover:from-primary-400 hover:via-primary-300 hover:to-primary-400 transition-all duration-300 group/map shadow-lg shadow-primary-500/30 hover:shadow-primary-400/40 hover:scale-105 ${isScrolled ? 'px-2 py-1' : 'gap-1 px-2 py-1'}`}>
                                        <Navigation className={`text-black transition-transform group-hover/map:scale-110 group-hover/map:rotate-12 ${isScrolled ? 'w-3 h-3 md:w-3.5 md:h-3.5' : 'w-3 h-3 md:w-4 md:h-4'}`} fill="currentColor" />
                                        <span className={`font-black tracking-wide text-black uppercase font-serif transition-colors ${isScrolled ? 'text-[8px] md:text-[9px]' : 'text-[9px] md:text-xs'}`}>
                                            Namakkal
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Navigation - Desktop Only */}
                        <div className="hidden md:flex items-center space-x-2">
                            <Link to="/" onClick={() => window.scrollTo(0, 0)} className={`rounded-xl font-semibold transition-all duration-700 ease-in-out ${isScrolled ? 'px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm' : 'px-3 py-2 md:px-4 md:py-2'} ${isActive('/') ? 'bg-primary-600 text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'text-gray-300 hover:bg-primary-900/20 hover:text-primary-400'}`}>
                                <Home className={`inline md:mr-2 transition-all duration-700 ease-in-out ${isScrolled ? 'w-3.5 h-3.5 md:w-4 md:h-4' : 'w-4 h-4 md:w-5 md:h-5'}`} />
                                <span className="hidden md:inline">Home</span>
                            </Link>
                            <Link to="/book" className={`rounded-xl font-semibold transition-all duration-700 ease-in-out ${isScrolled ? 'px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm' : 'px-3 py-2 md:px-4 md:py-2'} ${isActive('/book') ? 'bg-primary-600 text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'text-gray-300 hover:bg-primary-900/20 hover:text-primary-400'}`}>
                                <Calendar className={`inline md:mr-2 transition-all duration-700 ease-in-out ${isScrolled ? 'w-3.5 h-3.5 md:w-4 md:h-4' : 'w-4 h-4 md:w-5 md:h-5'}`} />
                                <span className="hidden md:inline">Book</span>
                            </Link>
                            <Link to="/track" className={`rounded-xl font-semibold transition-all duration-700 ease-in-out ${isScrolled ? 'px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm' : 'px-3 py-2 md:px-4 md:py-2'} ${isActive('/track') ? 'bg-primary-600 text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'text-gray-300 hover:bg-primary-900/20 hover:text-primary-400'}`}>
                                <Search className={`inline md:mr-2 transition-all duration-700 ease-in-out ${isScrolled ? 'w-3.5 h-3.5 md:w-4 md:h-4' : 'w-4 h-4 md:w-5 md:h-5'}`} />
                                <span className="hidden md:inline">Track</span>
                            </Link>
                        </div>

                        {/* Login/User Section - Always Visible */}
                        <div className="flex items-center">

                            {user ? (
                                <div className="flex items-center gap-1 md:gap-2 ml-2 md:ml-4 pl-2 md:pl-4 border-l border-primary-900">
                                    {/* User Name - Now visible on mobile too */}
                                    <Link
                                        to="/profile"
                                        className={`text-sm font-bold text-primary-400 bg-primary-900/20 px-2 md:px-3 py-1 rounded-full border border-primary-800 hover:bg-primary-900/40 transition-all duration-700 ease-in-out max-w-[80px] md:max-w-none truncate ${isScrolled ? 'text-xs' : 'text-sm'}`}
                                        title={user.displayName || user.name || user.email}
                                    >
                                        {/* Show first name or first part of email on mobile */}
                                        <span className="md:hidden">
                                            {(user.displayName || user.name || user.email?.split('@')[0] || 'User').split(' ')[0]}
                                        </span>
                                        {/* Show full name on desktop */}
                                        <span className="hidden md:inline">
                                            {user.displayName || user.name || user.email?.split('@')[0] || 'User'}
                                        </span>
                                    </Link>

                                    {user.role === 'admin' && (
                                        <Link to="/admin" className={`rounded-lg bg-primary-600 text-black hover:bg-primary-500 font-medium transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(212,175,55,0.3)] ${isScrolled ? 'px-2 py-1.5 text-xs' : 'px-3 py-2 text-sm'}`} title="Dashboard">
                                            <span className="hidden md:inline">Dashboard</span>
                                            <span className="md:hidden">Adm</span>
                                        </Link>
                                    )}
                                    <button onClick={logout} className={`rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 font-medium transition-all duration-700 ease-in-out ${isScrolled ? 'px-2 py-1.5 text-xs' : 'px-2 py-2 md:px-3 md:py-2 text-sm'}`} title="Logout">
                                        <span className="hidden md:inline">Logout</span>
                                        <LogOut className={`md:hidden transition-all duration-700 ease-in-out ${isScrolled ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 ml-2 md:ml-4 pl-2 md:pl-4 border-l border-primary-900">
                                    <Link to="/login" className={`rounded-xl text-primary-400 hover:bg-primary-900/20 font-semibold transition-all duration-700 ease-in-out border border-primary-800 ${isScrolled ? 'px-2 py-1.5 md:px-3 md:py-1.5 text-xs' : 'px-2 py-2 md:px-4 md:py-2'}`} title="Log In">
                                        <User className={`md:hidden transition-all duration-700 ease-in-out ${isScrolled ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                                        <span className="hidden md:inline">Log In</span>
                                    </Link>
                                    <Link to="/signup" className={`hidden sm:inline-block rounded-xl bg-primary-600 text-black hover:bg-primary-500 font-semibold shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] transition-all duration-700 ease-in-out ${isScrolled ? 'px-2 py-1.5 md:px-3 md:py-1.5 text-xs md:text-sm' : 'px-3 py-2 md:px-4 md:py-2 text-xs md:text-base'}`}>
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
