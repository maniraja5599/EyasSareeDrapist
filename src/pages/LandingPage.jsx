import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, Scissors, Clock, Heart, Star, ArrowRight, CheckCircle, Smartphone, Camera, Truck, MapPin, User, Zap, Crown, Phone, Instagram } from 'lucide-react';
import { useDataStore } from '../hooks/useDataStore';
import { useScrollRestoration } from '../hooks/useScrollRestoration';


const LandingPage = () => {
    // Enable scroll position restoration
    useScrollRestoration();
    const { webpageSettings } = useDataStore();

    const observerRef = React.useRef(null);

    React.useEffect(() => {
        // Push state to create a "stay" buffer for mobile back button
        window.history.pushState(null, '', window.location.pathname);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.1 });

        observerRef.current = observer;

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, []);

    const addToObserver = (el) => {
        if (el && observerRef.current) {
            observerRef.current.observe(el);
        }
    };

    // Service Data with Images
    // Service Data with Images
    const services = [
        {
            id: 'prepleat',
            title: 'Perfectly Pleated',
            price: '₹300',
            description: 'Why struggle? Get razor-sharp pleats ironed and folded, ready to slip on in 5 minutes.',
            image: `${import.meta.env.BASE_URL}images/new_prepleat.png`,
            icon: <Sparkles className="w-6 h-6" />
        },
        {
            id: 'draping',
            title: 'The Royal Drape',
            price: '₹600',
            description: 'Steal the spotlight at any party. Expert draping that stays flawless all night long.',
            image: `${import.meta.env.BASE_URL}images/new_draping_v2.png`,
            icon: <Scissors className="w-6 h-6" />
        },
        {
            id: 'bridal',
            title: 'Bridal Radiance',
            price: '₹800+',
            description: 'Your big day deserves perfection. Luxury styling to make you look and feel like a queen.',
            image: `${import.meta.env.BASE_URL}images/new_luxury.png`,
            icon: <Heart className="w-6 h-6" />
        }
    ];

    const reviews = [
        { name: "Priya S.", text: "Saved me hours! The pleats were so sharp.", stars: 5 },
        { name: "Anitha R.", text: "Felt so confident at my reception. Thank you!", stars: 5 },
        { name: "Deepa K.", text: "Best draping service in Namakkal.", stars: 5 }
    ];

    return (
        <div className="min-h-screen bg-black font-sans overflow-x-hidden text-white">

            {/* --- HERO SECTION --- */}
            <header className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center px-4 sm:px-8 overflow-hidden pt-20 sm:pt-24 pb-12 sm:pb-16 bg-black">
                {/* Background Glows */}


                <div className="max-w-7xl mx-auto relative z-10 w-full">
                    {/* Text Content */}
                    <div className="text-center space-y-6 animate-fade-in-up">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-primary-500/30 backdrop-blur-md text-primary-400 text-xs sm:text-sm tracking-[0.15em] uppercase animate-fade-in-up animate-border-uneven">
                            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                            For The <span className="font-black">BOLD</span> & <span className="font-serif italic normal-case font-light">Beautiful</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] tracking-tight">
                            <span className="relative inline-block align-bottom">
                                <span className="text-typewriter font-serif">
                                    Unique Style.
                                </span>
                            </span> <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-yellow-400 to-primary-600 drop-shadow-lg filter">
                                Pure Confidence.
                            </span>
                        </h1>

                        <div className="space-y-3 max-w-lg mx-auto">
                            <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                                Trust our expertise.
                            </p>
                            <span className="text-white font-bold bg-primary-600/20 px-4 py-2 rounded-lg border border-primary-500/30 inline-block text-sm sm:text-base">
                                100% Satisfaction Guaranteed
                            </span>
                            <p className="text-sm sm:text-base text-gray-400 leading-relaxed pt-2">
                                Professional saree draping at your doorstep. Perfect pleats, elegant style, every single time.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2 max-w-md mx-auto">
                            <Link to="/book" className="group relative px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-black rounded-full font-bold text-sm sm:text-base hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all duration-300 hover:scale-105">
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    <Crown className="w-5 h-5 text-black fill-black/20 animate-pulse" />
                                    Book Your Confidence <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link to="/track" className="px-6 py-3 bg-transparent text-white border border-primary-800 rounded-full font-bold text-sm sm:text-base hover:bg-white/5 hover:border-primary-400 transition-all flex items-center justify-center gap-2">
                                Track Order
                            </Link>
                        </div>
                    </div>

                    {/* Image Below Buttons */}
                    <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] w-full max-w-2xl mx-auto mt-12">
                        {/* Golden Border Frame */}
                        <div className="absolute inset-4 border border-primary-500/30 rounded-[2rem] lg:rounded-[3rem] z-20 pointer-events-none" />

                        {/* Main Image with Gradient Overlay */}
                        <div className="absolute inset-0 rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl shadow-primary-900/20">
                            <img
                                src={`${import.meta.env.BASE_URL}images/founder_final.png`}
                                alt="Founder & Stylist"
                                loading="eager"
                                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-[2s]"
                            />
                            {/* Gradient Mask for fading into black */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
                        </div>

                        {/* Floating Badge - Cycling Name/CTA */}
                        <a href="tel:+917502551633" className="absolute top-6 right-6 z-30 bg-black/60 backdrop-blur-md px-3 py-2 rounded-2xl border border-primary-500/40 shadow-lg animate-nivedhidha-badge cursor-pointer hover:bg-primary-900/40 transition-colors group">
                            <div className="relative h-5 overflow-hidden">
                                {/* Name - visible initially, then hides */}
                                <div className="flex items-center justify-center gap-2 text-primary-400 animate-cycle-name-phone">
                                    <User className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">NIVEDHIDHA</span>
                                </div>
                                {/* CTA - hidden initially, then appears */}
                                <div className="absolute inset-0 flex items-center justify-center gap-2 text-primary-400 animate-cycle-phone-name">
                                    <Phone className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">CLICK TO CALL</span>
                                </div>
                            </div>
                            <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5 group-hover:text-primary-300 transition-colors text-center">Your Personal Stylist</p>
                        </a>

                        {/* Rating Badge */}
                        <div className="absolute bottom-6 left-6 z-30 bg-black/60 backdrop-blur-md px-3 py-2 rounded-2xl border border-primary-500/40 shadow-lg animate-fade-in-up">
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-primary-500 fill-primary-500" />
                                <span className="text-white font-bold text-sm">5-Star Rated</span>
                            </div>
                            <p className="text-[10px] text-primary-400 uppercase tracking-wider mt-0.5">Premium Service</p>
                        </div>
                    </div>

                    {/* NIVEDHIDHA Description */}
                    <div className="max-w-3xl mx-auto mt-12 text-center space-y-4 px-4">
                        <div className="inline-flex items-center gap-2 text-primary-400 mb-2">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary-500"></div>
                            <span className="text-xs uppercase tracking-widest font-semibold">Meet Your Stylist</span>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary-500"></div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                            Nivedhidha - <span className="text-primary-400">Certified Saree Draping Specialist</span>
                        </h3>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
                            With years of expertise in traditional and contemporary saree draping, Nivedhidha brings artistry and precision to every pleat. Specializing in bridal styling, party looks, and classic drapes, she ensures you look and feel your absolute best for every occasion.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <CheckCircle className="w-4 h-4 text-primary-500" />
                                <span>500+ Happy Clients</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <CheckCircle className="w-4 h-4 text-primary-500" />
                                <span>Expert in 15+ Drape Styles</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <CheckCircle className="w-4 h-4 text-primary-500" />
                                <span>Certified Professional</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- SERVICES STRIP --- */}
            <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-white py-12 overflow-hidden mx-4 rounded-3xl shadow-2xl relative z-20 mt-12 lg:mt-[-80px] border border-primary-500/20">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around gap-8 text-center md:text-left">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-primary-600/30 to-primary-900/20 rounded-2xl flex items-center justify-center border border-primary-500/40 group-hover:scale-110 transition-transform shadow-lg shadow-primary-900/20">
                            <Truck className="w-6 h-6 text-primary-400 animate-icon-bounce" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-white group-hover:text-primary-400 transition-colors leading-tight">Free Pickup & Drop</h4>
                            <p className="text-sm text-gray-400 mt-1">For 3+ sarees in Namakkal</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-primary-600/30 to-primary-900/20 rounded-2xl flex items-center justify-center border border-primary-500/40 group-hover:scale-110 transition-transform shadow-lg shadow-primary-900/20">
                            <Smartphone className="w-6 h-6 text-primary-400 animate-icon-wiggle" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-white group-hover:text-primary-400 transition-colors leading-tight">Quick & Easy Booking</h4>
                            <p className="text-sm text-gray-400 mt-1">Reserve in 60 seconds</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-primary-600/30 to-primary-900/20 rounded-2xl flex items-center justify-center border border-primary-500/40 group-hover:scale-110 transition-transform shadow-lg shadow-primary-900/20">
                            <Zap className="w-6 h-6 text-primary-400 animate-icon-pulse" strokeWidth={2} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-lg text-white group-hover:text-primary-400 transition-colors leading-tight">Express Pre-Pleat</h4>
                            <p className="text-sm text-gray-400 mt-1">Ready-to-wear in minutes</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ELEGANT SERVICES GRID --- */}
            <section className="py-16 px-4 bg-black relative overflow-hidden">
                {/* Background glow similar to hero */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Hero-style section header */}
                    <div className="text-center mb-16 space-y-4 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 text-primary-400 mb-6">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary-500"></div>
                            <span className="text-xs uppercase tracking-widest font-semibold">Our Expertise</span>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary-500"></div>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-yellow-400 to-primary-600">
                            Curated for You
                        </h2>
                        <p className="text-gray-300 max-w-xl mx-auto leading-relaxed">
                            Select from our range of premium drape services designed to make you look your best.
                        </p>
                    </div>

                    {/* Service cards with glassmorphism */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={service.id}
                                className="group cursor-pointer bg-gradient-to-b from-zinc-900 via-zinc-900/80 to-black backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 hover:border-primary-500/50 shadow-lg hover:shadow-primary-900/20 transition-all duration-500 hover:-translate-y-2"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Image with golden frame */}
                                <div className="relative h-[350px] mb-6 overflow-hidden rounded-[2rem]">
                                    <div className="absolute inset-4 border border-primary-500/30 rounded-[2rem] z-20 pointer-events-none" />
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />

                                    {/* Floating icon badge */}
                                    <div className="absolute top-4 right-4 z-20 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-primary-500/40 group-hover:scale-110 transition-transform">
                                        {React.cloneElement(service.icon, { className: "w-6 h-6 text-primary-400 animate-icon-float" })}
                                    </div>
                                </div>

                                {/* Text content */}
                                <div className="space-y-3 px-2">
                                    <h3 className="text-2xl font-serif font-bold text-white group-hover:text-primary-400 transition-colors">
                                        {service.title}
                                    </h3>

                                    <p className="text-gray-400 leading-relaxed">{service.description}</p>
                                    <Link
                                        to={`/book?service=${service.id}`}
                                        className="inline-flex items-center gap-2 text-white font-bold mt-4 hover:gap-4 transition-all group-hover:text-primary-400"
                                    >
                                        Book This <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* --- GALLERY (Masonry Lookbook) --- */}
            <section className="py-16 px-4 bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5"></div>
                <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-primary-600/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Hero-style header */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 text-primary-400 mb-4">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary-500"></div>
                            <span className="text-xs uppercase tracking-widest font-semibold">Lookbook</span>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary-500"></div>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-yellow-400 to-primary-600 mb-4">
                            Real Drapes, Real Elegance
                        </h2>
                        <a href="https://www.instagram.com/eyas_sareedrapist_namakkal/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white font-bold hover:text-primary-400 transition-colors group">
                            View Instagram <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    {/* Connect on Instagram Card */}
                    <div className="flex justify-center animate-fade-in-up relative">
                        {/* Decorative floating elements */}
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

                        <div className="w-full max-w-3xl relative group">
                            {/* Gradient Border Glow */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-purple-600 to-yellow-500 rounded-[2.5rem] opacity-75 blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                            <div className="relative bg-black rounded-[2.5rem] p-8 sm:p-16 overflow-hidden">
                                {/* Background Mesh */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-purple-900/40 to-transparent rounded-full blur-[80px] pointer-events-none"></div>

                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                    {/* Icon Section */}
                                    <div className="relative shrink-0">
                                        <div className="w-28 h-28 bg-gradient-to-tr from-yellow-400 via-pink-600 to-purple-700 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.3)]">
                                            <Instagram className="w-20 h-20 text-white drop-shadow-md" />
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="text-center md:text-left space-y-6 flex-1">
                                        <div>
                                            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-purple-200 mb-2">
                                                Follow Our Journey
                                            </h3>
                                            <p className="text-gray-400 text-lg leading-relaxed">
                                                Join our community for daily styling tips, behind-the-scenes, and bridal inspiration.
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                            <a
                                                href="https://www.instagram.com/eyas_sareedrapist_namakkal/"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-3.5 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] group/btn"
                                            >
                                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover/btn:text-pink-600 transition-colors">
                                                    @eyas_sareedrapist_namakkal
                                                </span>
                                                <ArrowRight className="w-4 h-4 text-pink-600 group-hover/btn:translate-x-1 transition-transform" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="py-24 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    {/* Hero-style header */}
                    <div className="text-center mb-16 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 text-primary-400 mb-4">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary-500"></div>
                            <span className="text-xs uppercase tracking-widest font-semibold">Got Questions?</span>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary-500"></div>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-yellow-400 to-primary-600">
                            We Have Answers
                        </h2>
                        <p className="text-gray-300 mt-4">Everything you need to know about our premium service.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: "Do you travel to venues?", a: "Yes, we travel to any venue within Namakkal district." },
                            { q: "How long does it take?", a: "A standard drape takes about 7-10 minutes per person." },
                            { q: "Do you provide safety pins?", a: "Absolutely. We bring our own premium pins and accessories." },
                            { q: "Can I book for a group?", a: "Yes! We have special packages for bridal parties." },
                        ].map((faq, i) => (
                            <div
                                key={i}
                                className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden hover:border-primary-500/30 transition-all shadow-2xl shadow-black/20 animate-fade-in-up"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <details className="group">
                                    <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                                        <span className="font-bold text-white group-hover:text-primary-400 transition-colors">{faq.q}</span>
                                        <span className="text-primary-500 group-open:rotate-180 transition-transform">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </span>
                                    </summary>
                                    <div className="px-6 pb-6 text-gray-300 border-t border-white/5 pt-4">
                                        <p>{faq.a}</p>
                                    </div>
                                </details>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS --- */}
            <section className="py-16 bg-black relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    {/* Hero-style header */}
                    <div className="mb-16 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 text-primary-400 mb-4">
                            <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary-500"></div>
                            <span className="text-xs uppercase tracking-widest font-semibold">Testimonials</span>
                            <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary-500"></div>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-yellow-400 to-primary-600">
                            Client Love
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {reviews.map((r, i) => (
                            <div
                                key={i}
                                className="bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 text-left hover:border-primary-500/30 shadow-2xl shadow-black/40 transition-all group animate-fade-in-up"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="flex gap-1 text-primary-500 mb-4">
                                    {[...Array(r.stars)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                                </div>
                                <p className="text-gray-300 italic mb-6 leading-relaxed">"{r.text}"</p>
                                <div className="font-bold text-white font-serif">- {r.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-24 text-center px-4 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />

                <div className="max-w-3xl mx-auto bg-zinc-900/50 backdrop-blur-xl rounded-[3rem] p-12 sm:p-16 md:p-20 text-white relative overflow-hidden shadow-2xl border border-primary-500/30 animate-scale-in hover:border-primary-500/50 transition-colors duration-500">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-yellow-400 to-primary-600 animate-text-shimmer bg-[length:200%_auto]">
                            Ready to Dazzle?
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed max-w-xl mx-auto">
                            Your perfect saree look is just a click away.
                        </p>
                        <Link
                            to="/book"
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-500 text-black px-8 py-3 rounded-full font-bold text-sm sm:text-base hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transition-all hover:scale-105 group"
                        >
                            <Crown className="w-4 h-4 text-black fill-black/20 animate-pulse" />
                            Book Appointment Now
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-12 text-center text-gray-600 text-sm border-t border-white/10">
                <p>
                    &copy; 2026 Eyas Saree Drapist. Designed with elegance in Namakkal.
                    <span className="mx-2">|</span>
                    <Link to="/admin/login" className="hover:text-gray-400 transition-colors">Admin</Link>
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
