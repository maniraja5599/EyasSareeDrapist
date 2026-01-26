import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Search } from 'lucide-react';

const BottomNav = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-lg border-t border-primary-600/50 shadow-[0_-4px_20px_rgba(0,0,0,0.3)] md:hidden">
            <div className="flex justify-around items-center h-16 px-2">
                {/* Home */}
                <Link
                    to="/"
                    onClick={() => window.scrollTo(0, 0)}
                    className={`flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-xl transition-all duration-300 ${isActive('/')
                            ? 'bg-primary-600 text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                            : 'text-gray-400 hover:text-primary-400 hover:bg-primary-900/20'
                        }`}
                >
                    <Home className={`mb-1 transition-all ${isActive('/') ? 'w-6 h-6' : 'w-5 h-5'}`} />
                    <span className={`text-xs font-semibold ${isActive('/') ? 'font-bold' : ''}`}>Home</span>
                </Link>

                {/* Book */}
                <Link
                    to="/book"
                    className={`flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-xl transition-all duration-300 ${isActive('/book')
                            ? 'bg-primary-600 text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                            : 'text-gray-400 hover:text-primary-400 hover:bg-primary-900/20'
                        }`}
                >
                    <Calendar className={`mb-1 transition-all ${isActive('/book') ? 'w-6 h-6' : 'w-5 h-5'}`} />
                    <span className={`text-xs font-semibold ${isActive('/book') ? 'font-bold' : ''}`}>Book</span>
                </Link>

                {/* Track */}
                <Link
                    to="/track"
                    className={`flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-xl transition-all duration-300 ${isActive('/track')
                            ? 'bg-primary-600 text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                            : 'text-gray-400 hover:text-primary-400 hover:bg-primary-900/20'
                        }`}
                >
                    <Search className={`mb-1 transition-all ${isActive('/track') ? 'w-6 h-6' : 'w-5 h-5'}`} />
                    <span className={`text-xs font-semibold ${isActive('/track') ? 'font-bold' : ''}`}>Track</span>
                </Link>
            </div>
        </nav>
    );
};

export default BottomNav;
