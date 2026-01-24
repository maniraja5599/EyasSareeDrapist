import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, Scissors, Clock, Heart, Star, ArrowRight, CheckCircle, Smartphone, Camera, Truck, MapPin } from 'lucide-react';
import { useDataStore } from '../hooks/useDataStore';

const LandingPage = () => {
    const { webpageSettings } = useDataStore();

    const observerRef = React.useRef(null);

    React.useEffect(() => {
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.1 });

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
            price: '₹250',
            description: 'Why struggle? Get razor-sharp pleats ironed and folded, ready to slip on in 5 minutes.',
            image: `${import.meta.env.BASE_URL}images/new_prepleat.png`,
            icon: <Sparkles className="w-6 h-6" />
        },
        {
            id: 'draping',
            title: 'The Royal Drape',
            price: '₹300',
            description: 'Steal the spotlight at any party. Expert draping that stays flawless all night long.',
            image: `${import.meta.env.BASE_URL}images/new_draping_v2.png`,
            icon: <Scissors className="w-6 h-6" />
        },
        {
            id: 'bridal',
            title: 'Bridal Radiance',
            price: '₹500+',
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
            {/* --- HERO SECTION --- */}
            {/* --- HERO SECTION --- */}
            {/* --- HERO SECTION --- */}
            {/* --- HERO SECTION --- */}
            <header className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden pt-20 pb-20 bg-black">
                {/* Background Glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full mb-12">
                    {/* Left: Text Content */}
                    <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
                        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-primary-500/30 backdrop-blur-md text-primary-400 text-sm font-bold tracking-[0.2em] uppercase animate-fade-in-up animate-border-glow">
                            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                            For The Bold & Beautiful
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-8xl font-serif font-bold text-white leading-tight tracking-tight">
                            Unique Style. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-yellow-400 to-primary-600 drop-shadow-lg filter">
                                Pure Confidence.
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-lg mx-auto lg:mx-0 font-normal mt-6 md:mt-6">
                            <span className="block mb-3">Trust our expertise.</span>
                            <span className="text-white font-bold bg-primary-600/20 px-3 py-1.5 rounded-lg border border-primary-500/30 inline-block mb-4">100% Satisfaction Guaranteed</span>
                            <span className="block mt-3 text-sm sm:text-base leading-relaxed">
                                If you're not completely happy with our draping, <span className="text-yellow-400 font-bold">you don't pay.</span> That's our promise.
                            </span>
                        </p>


                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            <Link to="/book" className="group relative px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-primary-600 to-primary-500 text-black rounded-full font-bold text-base md:text-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all duration-300 hover:scale-105 max-w-xs sm:max-w-none mx-auto sm:mx-0">
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    Wear Your Confidence <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link to="/track" className="px-8 py-4 md:px-10 md:py-5 bg-transparent text-white border border-primary-800 rounded-full font-bold text-base md:text-lg hover:bg-white/5 hover:border-primary-400 transition-all flex items-center justify-center gap-2 max-w-xs sm:max-w-none mx-auto sm:mx-0">
                                Track Order
                            </Link>
                        </div>
                    </div>

                    {/* Right: Immersive Image Composition */}
                    <div className="relative h-[400px] lg:h-[600px] w-full lg:w-auto mt-12 lg:mt-0">
                        {/* Golden Border Frame */}
                        <div className="absolute inset-4 border border-primary-500/30 rounded-[3rem] z-20 pointer-events-none" />

                        {/* Main Image with Gradient Overlay */}
                        <div className="absolute inset-0 rounded-[3rem] overflow-hidden shadow-2xl shadow-primary-900/20">
                            <img
                                src={`${import.meta.env.BASE_URL}images/hero_generated_v1.png`}
                                alt="Cinematic Saree"
                                className="w-full h-full object-cover scale-110 opacity-90 hover:scale-100 transition-transform duration-[2s]"
                            />
                            {/* Gradient Mask for fading into black */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        </div>

                        {/* Floating Gold Element */}
                        <div className="absolute bottom-10 left-10 z-30 bg-black/80 backdrop-blur-xl p-4 rounded-2xl border border-primary-500/30 flex items-center gap-4">
                            <div className="text-primary-400">
                                <Star className="w-6 h-6 fill-current" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-lg">5-Star Rated</p>
                                <p className="text-primary-400/80 text-xs uppercase tracking-wider">Premium Service</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- SERVICES STRIP --- */}
            <div className="bg-zinc-900 text-white py-12 overflow-hidden mx-4 rounded-3xl shadow-2xl relative z-20 mt-12 lg:mt-[-80px] border border-white/10">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around gap-8 text-center md:text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-600/20 rounded-full flex items-center justify-center border border-primary-500/30">
                            <Truck className="w-6 h-6 text-primary-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-white">Doorstep Pickup</h4>
                            <p className="text-sm text-gray-400">Available in Namakkal</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-600/20 rounded-full flex items-center justify-center border border-primary-500/30">
                            <Smartphone className="w-6 h-6 text-primary-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-white">Instant Booking</h4>
                            <p className="text-sm text-gray-400">Book slot via App</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-600/20 rounded-full flex items-center justify-center border border-primary-500/30">
                            <Camera className="w-6 h-6 text-primary-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg text-white">Video Updates</h4>
                            <p className="text-sm text-gray-400">See your saree packing</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ELEGANT SERVICES GRID --- */}
            <section className="py-24 px-4 bg-black">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-primary-500 font-serif italic text-xl">Our Expertise</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Curated for You</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">Select from our range of premium drape services designed to make you look your best.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={service.id} className="group cursor-pointer bg-zinc-900/50 p-4 rounded-[2.5rem] hover:bg-zinc-900 border border-white/5 hover:border-primary-500/30 transition-all duration-500">
                                <div className="relative h-[350px] mb-6 overflow-hidden rounded-[2rem]">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10" />
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                    />
                                    <div className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10">
                                        {React.cloneElement(service.icon, { className: "w-5 h-5 text-white" })}
                                    </div>
                                </div>
                                <div className="space-y-3 px-2 pb-4">
                                    <h3 className="text-2xl font-serif font-bold text-white group-hover:text-primary-400 transition-colors">{service.title}</h3>
                                    <p className="text-lg font-bold text-primary-400">{service.price}</p>
                                    <p className="text-gray-400 leading-relaxed text-sm">{service.description}</p>
                                    <Link to={`/book?service=${service.id}`} className="inline-flex items-center gap-2 text-white font-bold mt-2 hover:gap-4 transition-all group-hover:text-primary-400">
                                        Book This <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PROCESS TIMELINE SECTION --- */}
            <section className="py-24 bg-zinc-950 relative border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-20">
                        <span className="text-primary-500 font-bold tracking-[0.2em] uppercase text-sm">The Experience</span>
                        <h2 className="text-3xl lg:text-5xl font-serif font-bold text-white mt-3">
                            How It Works
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent -translate-y-1/2" />

                        <div className="grid lg:grid-cols-4 gap-12 relative z-10">
                            {[
                                { step: '01', title: 'Book Online', desc: 'Choose your preferred slot in seconds.', icon: <Calendar className="w-6 h-6" /> },
                                { step: '02', title: 'We Arrive', desc: 'Our stylist comes to your location.', icon: <MapPin className="w-6 h-6" /> },
                                { step: '03', title: 'The Draping', desc: 'Expert pleating with safety pins.', icon: <Sparkles className="w-6 h-6" /> },
                                { step: '04', title: 'Shine', desc: 'Step out looking like royalty.', icon: <Star className="w-6 h-6" /> },
                            ].map((item, index) => (
                                <div key={index} className="bg-black border border-white/10 p-8 rounded-2xl relative group hover:border-primary-500/50 transition-colors">
                                    <div className="w-14 h-14 bg-primary-900/20 rounded-full flex items-center justify-center text-primary-400 mb-6 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </div>
                                    <span className="absolute top-6 right-6 text-4xl font-serif text-white/5 font-bold select-none group-hover:text-primary-500/20 transition-colors">
                                        {item.step}
                                    </span>
                                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- GALLERY (Masonry Lookbook) --- */}
            <section className="py-24 px-4 bg-black relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/10 pb-8">
                        <div>
                            <span className="text-primary-500 font-serif italic text-xl">Lookbook</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-2">Real Drapes, Real Elegance</h2>
                        </div>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white font-bold border-b border-primary-500 pb-1 hover:text-primary-400 transition-colors">
                            View Instagram <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>

                    <div className="columns-1 md:columns-3 gap-8 space-y-8">
                        {[
                            `${import.meta.env.BASE_URL}images/new_draping_v2.png`,
                            `${import.meta.env.BASE_URL}images/new_luxury.png`,
                            `${import.meta.env.BASE_URL}images/new_prepleat.png`,
                            `${import.meta.env.BASE_URL}images/hero_bg_v3.png`,
                        ].map((src, i) => (
                            <div key={i} ref={addToObserver} className="break-inside-avoid relative group rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer reveal-on-scroll">
                                <img src={src} alt="Gallery" className="w-full h-auto object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-0 transition-opacity" />
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
            <section className="py-24 bg-black relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl font-serif font-bold text-white mb-12">Client Love</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {reviews.map((r, i) => (
                            <div key={i} className="bg-zinc-900/50 p-8 rounded-2xl border border-white/10 text-left hover:border-primary-500/30 transition-all">
                                <div className="flex gap-1 text-primary-500 mb-4">
                                    {[...Array(r.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-gray-300 italic mb-6">"{r.text}"</p>
                                <div className="font-bold text-white font-serif">- {r.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-24 text-center px-4 bg-zinc-950">
                <div className="max-w-3xl mx-auto bg-gradient-to-r from-primary-900 to-black rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl border border-primary-500/30">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-primary-500">Ready to Dazzle?</h2>
                        <p className="text-gray-300 text-lg">Your perfect saree look is just a click away.</p>
                        <Link to="/book" className="inline-block bg-primary-500 text-black px-12 py-4 rounded-full font-bold text-lg hover:bg-white transition-all hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                            Book Appointment Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black py-12 text-center text-gray-600 text-sm border-t border-white/10">
                <p>&copy; 2026 Eyas Saree Drapist. Designed with elegance in Namakkal.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
