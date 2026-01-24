import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles, Scissors, Clock, Heart, Star, ArrowRight, CheckCircle, Smartphone, Camera, Truck } from 'lucide-react';
import { useDataStore } from '../hooks/useDataStore';

const LandingPage = () => {
    const { webpageSettings } = useDataStore();

    // Service Data with Images
    const services = [
        {
            id: 'prepleat',
            title: 'Pre-Pleating Service',
            price: '₹250',
            description: 'The secret to a perfect 5-minute drape. We iron and fold your pleats to perfection.',
            image: `${import.meta.env.BASE_URL}images/new_prepleat.png`,
            icon: <Sparkles className="w-6 h-6" />
        },
        {
            id: 'draping',
            title: 'Professional Draping',
            price: '₹300',
            description: 'Events, Weddings, or Parties. Look stunning with our expert draping styles.',
            image: `${import.meta.env.BASE_URL}images/new_draping_v2.png`,
            icon: <Scissors className="w-6 h-6" />
        },
        {
            id: 'bridal',
            title: 'Bridal Styling',
            price: '₹500+',
            description: 'Complete luxury styling for your big day. Box folding, ironing, and draping included.',
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
        <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white font-sans overflow-x-hidden">

            {/* --- HERO SECTION --- */}
            <header className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden pt-20">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-float-delayed pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-100/40 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 animate-float pointer-events-none" />

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
                    {/* Left: Text Content */}
                    <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-200 shadow-sm text-primary-800 text-sm font-bold tracking-widest uppercase">
                            <Sparkles className="w-4 h-4 text-primary-500" />
                            Namakkal's Premium Drapist
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.1]">
                            Wear Your Saree with <br />
                            <span className="text-gradient-gold italic">Confidence</span>
                        </h1>

                        <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Say goodbye to messy pleats. Experience the elegance of professional pre-pleating and draping services designed for the modern woman.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/book" className="group relative px-8 py-4 bg-secondary-900 text-white rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-secondary-900/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                <span className="relative z-10 flex items-center gap-3">
                                    Book Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link to="/track" className="px-8 py-4 bg-white text-gray-800 border border-gray-200 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2">
                                Track Order
                            </Link>
                        </div>

                        {/* Social Proof */}
                        <div className="pt-4 flex items-center justify-center lg:justify-start gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                                        Use{i}
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                Trusted by <span className="text-gray-900 font-bold">100+ Women</span> this month
                            </div>
                        </div>
                    </div>

                    {/* Right: Hero Image Composition */}
                    <div className="relative hidden lg:block h-[600px]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-100 to-transparent rounded-[3rem] transform rotate-3 scale-95" />
                        <img
                            src={`${import.meta.env.BASE_URL}images/hero_bg_v3.png`}
                            alt="Elegant Saree"
                            className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl transform -rotate-2 hover:rotate-0 transition-all duration-700"
                        />

                        {/* Floating Cards */}
                        <div className="absolute top-10 -left-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Ready in</p>
                                <p className="font-bold text-gray-900">5 Minutes</p>
                            </div>
                        </div>

                        <div className="absolute bottom-20 -right-5 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-float-delayed">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <Heart className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-bold uppercase">Fabric Safe</p>
                                <p className="font-bold text-gray-900">Ironing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- SERVICES STRIP --- */}
            <div className="bg-secondary-900 text-white py-12 overflow-hidden mx-4 rounded-3xl shadow-2xl relative z-20 mt-[-50px]">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around gap-8 text-center md:text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                            <Truck className="w-6 h-6 text-primary-300" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Doorstep Pickup</h4>
                            <p className="text-sm text-gray-300">Available in Namakkal</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                            <Smartphone className="w-6 h-6 text-primary-300" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Instant Booking</h4>
                            <p className="text-sm text-gray-300">Book slot via App</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                            <Camera className="w-6 h-6 text-primary-300" />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Video Updates</h4>
                            <p className="text-sm text-gray-300">See your saree packing</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- ELEGANT SERVICES GRID --- */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-primary-600 font-serif italic text-xl">Our Expertise</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Curated for You</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">Select from our range of premium drape services designed to make you look your best.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div key={service.id} className="group cursor-pointer">
                                <div className="relative h-[400px] mb-6 overflow-hidden rounded-[2rem]">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 right-6 z-20 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        {service.icon}
                                    </div>
                                </div>
                                <div className="space-y-2 text-center md:text-left">
                                    <h3 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{service.title}</h3>
                                    <p className="text-lg font-bold text-primary-600">{service.price}</p>
                                    <p className="text-gray-500 leading-relaxed">{service.description}</p>
                                    <Link to={`/book?service=${service.id}`} className="inline-flex items-center gap-2 text-secondary-900 font-bold mt-2 hover:gap-4 transition-all">
                                        Book This <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- HOW IT WORKS (Visual Timeline) --- */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary-600 font-serif italic text-xl">The Process</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">How It Works</h2>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-primary-100 -translate-y-1/2 z-0" />

                        <div className="grid md:grid-cols-4 gap-8 relative z-10">
                            {[
                                { step: 1, title: 'Book Online', desc: 'Select your service & date', icon: <Calendar className="w-6 h-6" /> },
                                { step: 2, title: 'We Pickup', desc: 'We collect from your door', icon: <Truck className="w-6 h-6" /> },
                                { step: 3, title: 'Magic', desc: 'We pleat, iron & pack', icon: <Sparkles className="w-6 h-6" /> },
                                { step: 4, title: 'Delivery', desc: 'Ready to wear in 5 mins', icon: <CheckCircle className="w-6 h-6" /> }
                            ].map((item, i) => (
                                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg text-center group hover:-translate-y-2 transition-transform duration-300">
                                    <div className="w-16 h-16 mx-auto bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors shadow-inner">
                                        {item.icon}
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-500 text-sm">{item.desc}</p>
                                    <div className="mt-4 inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500">
                                        Step 0{item.step}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* --- GALLERY (Masonry Lookbook) --- */}
            <section className="py-24 px-4 bg-cream-50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <span className="text-primary-600 font-serif italic text-xl">Lookbook</span>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Real Drapes, Real Elegeance</h2>
                        </div>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-secondary-900 font-bold border-b-2 border-secondary-900 pb-1 hover:text-primary-600 hover:border-primary-600 transition-colors">
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
                            <div key={i} className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-md">
                                <img src={src} alt="Gallery" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Heart className="w-8 h-8 text-white fill-current animate-bounce" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="py-24 px-4 bg-white">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-primary-600 font-serif italic text-xl">Doubts?</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Common Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: "How long does pre-pleating take?", a: "Typically 1-2 days. We also offer express 24h service." },
                            { q: "Do you provide box folding?", a: "Yes! All pre-pleated sarees are box folded and ironed perfectly." },
                            { q: "Can I book for weddings?", a: "Absolutely. We specialize in bridal draping for huge events." },
                            { q: "Is pickup free?", a: "Pickup is free within 5km of Namakkal town center." }
                        ].map((faq, i) => (
                            <details key={i} className="group bg-gray-50 rounded-2xl p-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer open:bg-primary-50 transition-colors">
                                <summary className="flex items-center justify-between font-bold text-lg text-gray-900 group-hover:text-primary-700">
                                    {faq.q}
                                    <span className="transition group-open:rotate-180">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </span>
                                </summary>
                                <p className="text-gray-600 mt-4 leading-relaxed animate-fade-in">
                                    {faq.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>

            </section>

            {/* --- TESTIMONIALS (Floral bg) --- */}
            <section className="py-24 bg-primary-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-12">Client Love</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {reviews.map((r, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-primary-100 text-left">
                                <div className="flex gap-1 text-primary-500 mb-4">
                                    {[...Array(r.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-gray-600 italic mb-6">"{r.text}"</p>
                                <div className="font-bold text-gray-900 font-serif">- {r.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FINAL CTA --- */}
            <section className="py-24 text-center px-4">
                <div className="max-w-3xl mx-auto bg-secondary-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-6xl font-serif font-bold">Ready to Dazzle?</h2>
                        <p className="text-primary-200 text-lg">Your perfect saree look is just a click away.</p>
                        <Link to="/book" className="inline-block bg-white text-secondary-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-primary-50 transition-colors hover:scale-105">
                            Book Appointment Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white py-12 text-center text-gray-500 text-sm border-t border-gray-100">
                <p>&copy; 2026 Eyas Saree Drapist. Designed with elegance.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
