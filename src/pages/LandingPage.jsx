import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, Scissors, CheckCircle, Instagram, Phone, MapPin, ArrowRight, Star, Clock, Heart } from 'lucide-react';
import { useDataStore } from '../hooks/useDataStore';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);
    const { webpageSettings } = useDataStore();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper to merge dynamic settings with static assets (icons/images)
    const getServices = () => {
        const staticAssets = {
            'prepleat': {
                icon: <Sparkles className="w-8 h-8" />,
                image: '/images/new_prepleat.png',
                defaultDesc: 'Perfectly pressed pleats that stay intact for days.'
            },
            'draping': {
                icon: <Scissors className="w-8 h-8" />,
                image: '/images/new_draping_v2.png',
                defaultDesc: 'Expert styling for weddings and special occasions.'
            },
            'both': {
                icon: <Star className="w-8 h-8" />,
                image: '/images/new_luxury.png',
                defaultDesc: 'The ultimate package: Pre-pleating + Professional Draping.'
            }
        };

        const servicesFromStore = webpageSettings?.services || [
            { id: 'prepleat', name: 'Pre-Pleating', price: 250 },
            { id: 'draping', name: 'Saree Draping', price: 300 },
            { id: 'both', name: 'Complete Luxury', price: 500 }
        ];

        return servicesFromStore.map(s => ({
            id: s.id,
            title: s.name, // Mapping 'name' from store to 'title' for this view
            price: `₹${s.price}`,
            description: staticAssets[s.id]?.defaultDesc || 'Professional Service',
            icon: staticAssets[s.id]?.icon || <Star className="w-8 h-8" />,
            image: staticAssets[s.id]?.image || '/images/hero_bg_v3.png'
        }));
    };

    const services = getServices();

    return (
        <div className="min-h-screen bg-cream-50 font-sans selection:bg-primary-200">

            {/* HERO SECTION */}
            <header className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image with Parallax-like fix */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/feature-detail.jpg"
                        alt="Saree Texture"
                        className="w-full h-full object-cover opacity-90 scale-105 animate-pulse-slow"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-secondary-900/50 to-secondary-900/90 mix-blend-multiply" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cream-100 text-sm font-medium tracking-widest uppercase mb-6 animate-slide-up">
                        <Sparkles className="w-4 h-4 text-primary-300" />
                        Premium Saree Draping
                    </div>

                    <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                        The Art of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 via-primary-100 to-primary-300 italic">Elegance</span>
                    </h1>

                    <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Experience the perfect pleats. Wherever you go, carry the grace of tradition with a modern touch.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        <Link
                            to="/book"
                            className="group relative px-8 py-4 bg-white text-secondary-900 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Book Appointment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>

                        <Link
                            to="/track"
                            className="px-8 py-4 rounded-full border border-white/30 text-white font-medium hover:bg-white/10 backdrop-blur-sm transition-all flex items-center gap-2"
                        >
                            Track Order <Clock className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
                        <div className="w-1 h-2 bg-white rounded-full" />
                    </div>
                </div>
            </header>

            {/* MARQUEE STRIP */}
            <div className="bg-primary-900 text-primary-100 py-4 overflow-hidden relative z-20">
                <div className="flex animate-marquee whitespace-nowrap gap-12 text-sm font-bold tracking-[0.2em] uppercase">
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className="flex items-center gap-4 opacity-70">
                            <Star className="w-3 h-3 text-primary-400" />
                            Premium Pre-Pleating
                            <Star className="w-3 h-3 text-primary-400" />
                            Professional Draping
                        </span>
                    ))}
                </div>
            </div>

            {/* SERVICES SHOWCASE */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-primary-600 font-bold tracking-widest uppercase text-sm mb-2 block">Our Expertise</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-secondary-900">Curated Services</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div key={service.id} className="group relative rounded-[2rem] overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                            {/* Image Background */}
                            <div className="h-96 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-6 right-6 z-20 bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 text-white">
                                    {service.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                                <h3 className="text-3xl font-serif font-bold text-white mb-2">{service.title}</h3>
                                <p className="text-gray-300 mb-6 line-clamp-2">{service.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-primary-300">{service.price}</span>
                                    <Link
                                        to={`/book?service=${service.id}`}
                                        className="bg-white text-secondary-900 p-3 rounded-full hover:bg-primary-400 transition-colors"
                                    >
                                        <ArrowRight className="w-6 h-6" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURES GRID */}
            <section className="bg-secondary-900 text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 leading-tight">
                            Why Choose <br />
                            <span className="text-primary-400">Eyas Drapist?</span>
                        </h2>
                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-400">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Time-Saving Elegance</h3>
                                    <p className="text-gray-400 leading-relaxed">Get ready in under 5 minutes with our perfectly pre-pleated sarees. We save your time without compromising on style.</p>
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-400">
                                    <Heart className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Fabric Care</h3>
                                    <p className="text-gray-400 leading-relaxed">We use gentle steam pressing techniques that ensure your expensive silks and fabrics are treated with utmost care.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            <img src="/images/new_prepleat.png" className="rounded-2xl w-full h-64 object-cover transform translate-y-8" alt="Saree Detail" />
                            <img src="/images/new_luxury.png" className="rounded-2xl w-full h-64 object-cover shadow-2xl" alt="Draping" />
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-24 px-4 text-center">
                <div className="max-w-4xl mx-auto relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                        <h2 className="text-[12rem] font-serif font-bold text-secondary-900">BOOK</h2>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-secondary-900 mb-6">
                            Ready to Transform?
                        </h2>
                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            Don't stress about the drapes. Let us handle the pleats so you can shine at your event.
                        </p>
                        <Link
                            to="/book"
                            className="inline-flex items-center gap-3 bg-secondary-900 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-primary-600 transition-colors shadow-2xl shadow-secondary-900/30"
                        >
                            <Calendar className="w-6 h-6" />
                            Book Your Slot Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-white border-t border-gray-100 py-12 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <img src="/images/logo.png" alt="Eyas Drapist" className="w-12 h-12 object-contain" />
                            <span className="text-2xl font-serif font-bold text-secondary-900">Eyas Drapist</span>
                        </div>
                        <p className="text-gray-500 max-w-sm">
                            Bringing the timeless elegance of sarees to the modern woman with professional pleating and draping services.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-gray-600">
                            <li><Link to="/" className="hover:text-primary-600">Home</Link></li>
                            <li><Link to="/book" className="hover:text-primary-600">Book Appointment</Link></li>
                            <li><Link to="/track" className="hover:text-primary-600">Track Order</Link></li>
                            <li><Link to="/admin/login" className="hover:text-primary-600 text-sm opacity-50">Admin Login</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Contact</h4>
                        <ul className="space-y-4 text-gray-600">
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary-600" />
                                <a href="tel:+917502551633" className="hover:text-primary-600 transition-colors">+91 75025 51633</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Instagram className="w-4 h-4 text-primary-600" />
                                <a href="https://www.instagram.com/eyas_sareedrapist_namakkal" target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 transition-colors">@eyas_sareedrapist_namakkal</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary-600" /> Namakkal, TN
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-100 mt-12 pt-8 text-center text-gray-400 text-sm">
                    © 2026 Eyas Saree Drapist. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
