import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, Scissors, Clock, Heart, Star, ArrowRight, CheckCircle, Smartphone, Camera, Truck, MapPin, User, Zap, Crown, Phone } from 'lucide-react';
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
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10 w-full">
                    {/* Text Content */}
                    <div className="text-center space-y-6 animate-fade-in-up">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-primary-500/30 backdrop-blur-md text-primary-400 text-xs sm:text-sm tracking-[0.15em] uppercase animate-fade-in-up animate-border-uneven">
                            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                            For The <span className="font-black">BOLD</span> & <span className="font-serif italic normal-case font-light">Beautiful</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] tracking-tight">
                            Unique Style. <br />
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
                                    Wear Your Confidence <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                                className="w-full h-full object-cover object-top scale-105 opacity-90 hover:scale-100 transition-transform duration-[2s]"
                            />
                            {/* Gradient Mask for fading into black */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
                        </div>

                        {/* Floating Badge - Cycling Name/CTA */}
                        <a href="tel:+917502551633" className="absolute top-6 right-6 z-30 bg-black/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-primary-500/40 shadow-lg animate-nivedhidha-badge cursor-pointer hover:bg-primary-900/40 transition-colors group">
                            <div className="relative h-5 overflow-hidden">
                                {/* Name - visible initially, then hides */}
                                <div className="flex items-center gap-2 text-primary-400 animate-cycle-name-phone">
                                    <User className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">NIVEDHIDHA</span>
                                </div>
                                {/* CTA - hidden initially, then appears */}
                                <div className="absolute inset-0 flex items-center gap-2 text-primary-400 animate-cycle-phone-name">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">CLICK TO CALL</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5 group-hover:text-primary-300 transition-colors">Your Personal Stylist</p>
                        </a>

                        {/* Rating Badge */}
                        <div className="absolute bottom-6 left-6 z-30 bg-black/60 backdrop-blur-md px-4 py-3 rounded-2xl border border-primary-500/40 shadow-lg animate-fade-in-up">
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5 text-primary-500 fill-primary-500" />
                                <span className="text-white font-bold text-base">5-Star Rated</span>
                            </div>
                            <p className="text-xs text-primary-400 uppercase tracking-wider mt-0.5">Premium Service</p>
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
            <section className="py-16 sm:py-24 px-4 bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12 sm:mb-16 space-y-4 animate-fade-in-up">
                        <span className="text-primary-500 font-serif italic text-lg sm:text-xl">Our Expertise</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white">Curated for You</h2>
                        <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">Select from our range of premium drape services designed to make you look your best.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
                        {services.map((service, index) => (
                            <div
                                key={service.id}
                                className={`group cursor-pointer bg-zinc-900/50 p-4 rounded-[2rem] sm:rounded-[2.5rem] hover:bg-zinc-900 border border-white/5 hover:border-primary-500/30 active:border-primary-500/50 active:scale-[0.98] transition-all duration-500 touch-transition will-animate animate-stagger-${index + 1}`}
                            >
                                <div className="relative h-[280px] sm:h-[350px] mb-6 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">
                                    <div className="absolute inset-0 bg-black/20 md:group-hover:bg-black/0 transition-colors z-10" />
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-700 md:group-hover:scale-110 active:scale-105 opacity-90 md:group-hover:opacity-100"
                                    />
                                    {/* Icon always visible on mobile, scales on hover/active */}
                                    <div className="absolute top-4 right-4 z-20 w-10 h-10 bg-primary-900/30 backdrop-blur-md rounded-full flex items-center justify-center border border-primary-500/40 md:group-hover:scale-110 md:group-hover:bg-black/50 active:scale-110 transition-transform">
                                        {React.cloneElement(service.icon, { className: "w-5 h-5 text-primary-400 animate-icon-float" })}
                                    </div>
                                </div>
                                <div className="space-y-3 px-2 pb-4">
                                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white md:group-hover:text-primary-400 transition-colors">{service.title}</h3>
                                    <p className="text-base sm:text-lg font-bold text-primary-400">{service.price}</p>
                                    <p className="text-gray-400 leading-relaxed text-sm">{service.description}</p>
                                    <Link to={`/book?service=${service.id}`} className="inline-flex items-center gap-2 text-white font-bold mt-2 hover:gap-4 active:gap-4 transition-all md:group-hover:text-primary-400 active:text-primary-400 text-sm sm:text-base">
                                        Book This <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PROCESS TIMELINE SECTION --- */}
            <section className="py-12 sm:py-16 md:py-24 bg-zinc-950 relative border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-8 sm:mb-12 md:mb-20 animate-fade-in-up">
                        <span className="text-primary-500 font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-xs sm:text-sm">The Experience</span>
                        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-serif font-bold text-white mt-2 sm:mt-3">
                            How It Works
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent -translate-y-1/2" />

                        {/* Mobile: Stack vertically, Desktop: 4 columns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-12 relative z-10">
                            {[
                                { step: '01', title: 'Book Online', desc: 'Choose your preferred slot in seconds.', icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6 animate-icon-pulse" /> },
                                { step: '02', title: 'We Arrive', desc: 'Our stylist comes to your location.', icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6 animate-icon-bounce" /> },
                                { step: '03', title: 'The Draping', desc: 'Expert pleating with safety pins.', icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-icon-spin" /> },
                                { step: '04', title: 'Shine', desc: 'Step out looking like royalty.', icon: <Star className="w-5 h-5 sm:w-6 sm:h-6 animate-icon-pulse" /> },
                            ].map((item, index) => (
                                <div key={index} className={`bg-black border border-white/10 p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl relative group hover:border-primary-500/50 active:border-primary-500/70 active:scale-[0.98] transition-all touch-transition animate-stagger-${index + 1}`}>
                                    <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-primary-900/20 rounded-full flex items-center justify-center text-primary-400 mb-4 sm:mb-6 md:group-hover:scale-110 active:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    {/* Step number visible on mobile */}
                                    <span className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6 text-2xl sm:text-3xl lg:text-4xl font-serif text-primary-500/10 font-bold select-none md:group-hover:text-primary-500/20 transition-colors">
                                        {item.step}
                                    </span>
                                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed md:group-hover:text-gray-300">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- GALLERY (Masonry Lookbook) --- */}
            <section className="py-16 md:py-24 px-4 bg-black relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Header - Fixed for mobile */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4 border-b border-white/10 pb-6 md:pb-8">
                        <div className="w-full sm:w-auto">
                            <span className="text-primary-500 font-serif italic text-lg md:text-xl">Lookbook</span>
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-white mt-2 leading-tight">
                                Real Drapes,<br className="sm:hidden" /> Real Elegance
                            </h2>
                        </div>
                        <a href="https://www.instagram.com/eyas_sareedrapist_namakkal/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white font-bold border-b border-primary-500 pb-1 hover:text-primary-400 transition-colors text-sm md:text-base whitespace-nowrap mt-2 sm:mt-0">
                            View Instagram <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Gallery Grid - Unique images with lazy loading */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        {[
                            { src: `${import.meta.env.BASE_URL}images/hero_bg_v2.png`, alt: 'Elegant Saree Draping Style 1' },
                            { src: `${import.meta.env.BASE_URL}images/hero_bg_v3.png`, alt: 'Beautiful Saree Draping Style 2' },
                            { src: `${import.meta.env.BASE_URL}images/new_hero_bg.png`, alt: 'Premium Saree Styling 3' },
                            { src: `${import.meta.env.BASE_URL}images/hero_main_v3.png`, alt: 'Professional Saree Draping 4' },
                        ].map((item, i) => (
                            <div key={i} ref={addToObserver} className="relative group rounded-2xl overflow-hidden md:grayscale md:hover:grayscale-0 transition-all duration-700 cursor-pointer reveal-on-scroll aspect-[4/3] animate-stagger-{i+1}">
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    loading="lazy"
                                    className="w-full h-full object-cover transform md:group-hover:scale-110 active:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 md:opacity-60 md:group-hover:opacity-0 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="py-24 bg-zinc-950 border-t border-white/5">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4">
                            Questions?
                        </h2>
                        <p className="text-gray-400">Everything you need to know about our premium service.</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: "Do you travel to venues?", a: "Yes, we travel to any venue within Namakkal district." },
                            { q: "How long does it take?", a: "A standard drape takes about 7-10 minutes per person." },
                            { q: "Do you provide safety pins?", a: "Absolutely. We bring our own premium pins and accessories." },
                            { q: "Can I book for a group?", a: "Yes! We have special packages for bridal parties." },
                        ].map((faq, i) => (
                            <div key={i} className="bg-black border border-white/10 rounded-xl overflow-hidden hover:border-primary-500/30 transition-colors">
                                <details className="group">
                                    <summary className="flex justify-between items-center p-6 cursor-pointer list-none">
                                        <span className="font-semibold text-white group-hover:text-primary-400 transition-colors">{faq.q}</span>
                                        <span className="text-primary-500 group-open:rotate-180 transition-transform">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                        </span>
                                    </summary>
                                    <div className="px-6 pb-6 text-gray-400 border-t border-white/5 pt-4">
                                        <p>{faq.a}</p>
                                    </div>
                                </details>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS --- */}
            <section className="py-16 sm:py-24 bg-black relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-8 sm:mb-12 animate-fade-in-up">Client Love</h2>
                    <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
                        {reviews.map((r, i) => (
                            <div key={i} className={`bg-zinc-900/50 p-6 sm:p-8 rounded-2xl border border-white/10 text-left hover:border-primary-500/30 active:border-primary-500/50 active:scale-[0.98] transition-all touch-transition animate-stagger-${i + 1}`}>
                                <div className="flex gap-1 text-primary-500 mb-4">
                                    {[...Array(r.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-gray-300 italic mb-6 text-sm sm:text-base">"{r.text}"</p>
                                <div className="font-bold text-white font-serif text-sm sm:text-base">- {r.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-16 sm:py-24 text-center px-4 bg-zinc-950">
                <div className="max-w-3xl mx-auto bg-gradient-to-r from-primary-900 to-black rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-20 text-white relative overflow-hidden shadow-2xl border border-primary-500/30 animate-scale-in">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 space-y-6 sm:space-y-8">
                        <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-primary-500">Ready to Dazzle?</h2>
                        <p className="text-gray-300 text-base sm:text-lg">Your perfect saree look is just a click away.</p>
                        <Link to="/book" className="inline-block bg-primary-500 text-black px-8 sm:px-12 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-white transition-all hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.4)] touch-transition">
                            Book Appointment Now
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
