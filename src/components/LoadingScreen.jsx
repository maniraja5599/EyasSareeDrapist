import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onLoadComplete }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Start fade out after 2 seconds
        const timer = setTimeout(() => {
            setFadeOut(true);
            // Call onLoadComplete after fade animation completes
            setTimeout(() => {
                if (onLoadComplete) onLoadComplete();
            }, 500);
        }, 2000);

        return () => clearTimeout(timer);
    }, [onLoadComplete]);

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'
                }`}
        >
            {/* Background Glow Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[600px] h-[600px] bg-primary-600/20 rounded-full blur-[150px] animate-pulse"></div>
            </div>

            {/* Logo and Loading */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Logo Circle */}
                <div className="relative">
                    {/* Rotating Ring */}
                    <div className="absolute inset-0 animate-spin-slow">
                        <svg className="w-32 h-32" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="2"
                                strokeDasharray="70 200"
                                strokeLinecap="round"
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="1" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    {/* Logo Container */}
                    <div className="relative w-40 h-40 bg-gradient-to-br from-primary-500/20 to-primary-600/10 rounded-full flex items-center justify-center border-2 border-primary-500/30 shadow-2xl shadow-primary-500/20 animate-pulse">
                        {/* Actual Company Logo */}
                        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center p-2 shadow-lg">
                            <img
                                src={`${import.meta.env.BASE_URL}images/logo.png`}
                                alt="Eyas Drapist"
                                className="w-full h-full object-contain animate-pulse"
                            />
                        </div>
                    </div>
                </div>

                {/* Brand Name */}
                <div className="text-center">
                    <h1 className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-200 via-primary-400 to-primary-600 mb-2">
                        Eyas Drapist
                    </h1>
                    <p className="text-sm text-gray-400 tracking-widest uppercase">
                        Saree Pre-Pleating & Draping
                    </p>
                </div>

                {/* Loading Dots */}
                <div className="flex gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
