import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onLoadComplete }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Start fade out after 3.5 seconds
        const timer = setTimeout(() => {
            setFadeOut(true);
            // Call onLoadComplete after fade animation completes
            setTimeout(() => {
                if (onLoadComplete) onLoadComplete();
            }, 500);
        }, 3500);

        return () => clearTimeout(timer);
    }, [onLoadComplete]);

    return (
        <div
            className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'
                }`}
        >
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-500/20 rounded-full animate-ping"></div>
                <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary-400/10 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-primary-600/15 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-primary-500/10 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            {/* Logo and Content */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Ripple Circles */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Outer Ripple */}
                    <div className="absolute inset-0 rounded-full border-2 border-primary-500/30 animate-ping" style={{ animationDuration: '2s' }}></div>
                    <div className="absolute inset-4 rounded-full border-2 border-primary-400/20 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
                    <div className="absolute inset-8 rounded-full border border-primary-500/10 animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>

                    {/* Logo Container - Fully Transparent Background */}
                    <div className="relative z-10 w-32 h-32 flex items-center justify-center">
                        {/* Glowing Circle Behind Logo */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-primary-600/20 rounded-full blur-xl animate-pulse"></div>

                        {/* Logo Image */}
                        <img
                            src={`${import.meta.env.BASE_URL}images/logo.png`}
                            alt="Eyas Drapist"
                            className="relative z-10 w-full h-full object-contain drop-shadow-2xl animate-fade-in"
                        />
                    </div>
                </div>

                {/* Brand Name with Fade In */}
                <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-200 via-primary-400 to-primary-600 mb-2">
                        Eyas Drapist
                    </h1>
                    <p className="text-sm text-gray-400 tracking-[0.3em] uppercase">
                        Saree Pre-Pleating & Draping
                    </p>
                </div>

                {/* Loading Wave Animation */}
                <div className="flex gap-1.5 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-wave"></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-wave" style={{ animationDelay: '0.15s' }}></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-wave" style={{ animationDelay: '0.3s' }}></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-wave" style={{ animationDelay: '0.45s' }}></div>
                </div>
            </div>

            {/* Add custom keyframes for wave animation */}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes wave {
                    0%, 100% {
                        transform: translateY(0) scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: translateY(-8px) scale(1.2);
                        opacity: 0.7;
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }

                .animate-wave {
                    animation: wave 1.2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
