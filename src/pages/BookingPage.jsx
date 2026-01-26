import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, User, Phone, MapPin, ArrowRight, CheckCircle, Ruler } from 'lucide-react';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useDataStore } from '../hooks/useDataStore';
import { useAuth } from '../contexts/AuthContext';
import { useScrollRestoration } from '../hooks/useScrollRestoration';

const BookingPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedService = searchParams.get('service') || '';
    const { webpageSettings, actions } = useDataStore();
    const { user, loginWithGoogle } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Enable scroll position restoration
    useScrollRestoration();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        service: preselectedService,
        date: '',
        slot: '',
        name: user?.displayName || user?.name || '',
        mobile: user?.mobile || '',
        email: user?.email || '',
        whatsapp: user?.whatsapp || user?.mobile || '',
        whatsappSameAsMobile: true, // New checkbox
        sareeCount: 1, // New field for number of sarees
        pickupRequired: false,
        address: user?.address || '',
        paymentMethod: 'cash', // 'cash', 'online', or 'advance'
        paidAmount: 0,
        measurements: {
            waist: '',
            hip: '',
            length: '',
            blouseSize: '',
            notes: ''
        },
        notes: ''
    });

    // Update form if user logs in after page load, but don't overwrite existing inputs
    React.useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: prev.name || user.displayName || user.name || user.email?.split('@')[0] || '',
                email: prev.email || user.email || '',
                mobile: prev.mobile || user.mobile || '',
                whatsapp: prev.whatsappSameAsMobile ? (prev.mobile || user.mobile || '') : (prev.whatsapp || user.whatsapp || ''),
                address: prev.address || user.address || '',
                measurements: {
                    waist: user.measurements?.waist || prev.measurements.waist || '',
                    hip: user.measurements?.hip || prev.measurements.hip || '',
                    length: user.measurements?.length || prev.measurements.length || '',
                    blouseSize: user.measurements?.blouseSize || prev.measurements.blouseSize || '',
                    notes: user.measurements?.notes || prev.measurements.notes || ''
                }
            }));
        }
    }, [user]);

    // Use dynamic services from store, fallback to default if empty (rare)
    const services = webpageSettings?.services || [
        { id: 'prepleat', name: 'Only Pre-Pleating', price: 300, duration: '30-45 mins' },
        { id: 'draping', name: 'Only Draping', price: 600, duration: '15-20 mins' },
        { id: 'both', name: 'Complete Package', price: 800, duration: 'Best Value' }
    ];

    const slots = ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'];

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateMeasurement = (field, value) => {
        setFormData(prev => ({
            ...prev,
            measurements: { ...prev.measurements, [field]: value }
        }));
    };

    // Scroll to top when page loads
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Scroll to top when step changes
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl sm:text-6xl font-serif font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-primary-600">
                        {webpageSettings?.bookingTitle || 'Book Your Appointment'}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-400 font-light">
                        {webpageSettings?.bookingSubtitle || 'Choose your service and preferred time slot'}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-12">
                    <div className="flex items-center justify-center gap-4">
                        {[1, 2, 3].map((s) => (
                            <React.Fragment key={s}>
                                <div className={`flex items-center gap-3 ${step >= s ? 'opacity-100' : 'opacity-40'}`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${step >= s
                                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                                        : 'bg-zinc-800 text-gray-500 border border-white/5'
                                        }`}>
                                        {s}
                                    </div>
                                    <span className={`hidden sm:inline font-semibold ${step >= s ? 'text-white' : 'text-gray-500'}`}>
                                        {s === 1 ? 'Service' : s === 2 ? 'Schedule' : 'Details'}
                                    </span>
                                </div>
                                {s < 3 && <div className={`w-12 h-1 rounded ${step > s ? 'bg-primary-500' : 'bg-zinc-800'}`}></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <div className="gradient-card border-white/5 bg-zinc-900/50 backdrop-blur-xl animate-slide-up p-6 sm:p-10 rounded-[2.5rem]">
                    {/* Step 1: Service Selection */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-serif font-bold text-white mb-6">Select Service</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                {services.map((service) => (
                                    <button
                                        key={service.id}
                                        onClick={() => updateField('service', service.id)}
                                        className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${formData.service === service.id
                                            ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/20'
                                            : 'border-white/5 bg-black/40 hover:border-primary-500/30'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-lg text-white">{service.name}</h3>
                                            {formData.service === service.id && (
                                                <CheckCircle className="w-6 h-6 text-primary-500" />
                                            )}
                                        </div>
                                        <p className="text-3xl font-bold text-primary-400 mb-2">₹{service.price}</p>
                                        <p className="text-sm text-gray-400 font-light">{service.duration}</p>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={nextStep}
                                disabled={!formData.service}
                                className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-5 rounded-2xl"
                            >
                                Continue to Schedule
                                <ArrowRight className="w-5 h-5 inline ml-2" />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Date & Time */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-serif font-bold text-white mb-6">Choose Date & Time</h2>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary-500/80 mb-4">
                                    <Calendar className="w-4 h-4" />
                                    Select Date
                                </label>

                                {/* Date Scroller */}
                                <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 snap-x scrollbar-hide">
                                    {Array.from({ length: 14 }).map((_, i) => {
                                        const date = new Date();
                                        date.setDate(date.getDate() + i);
                                        const dateStr = date.toISOString().split('T')[0];
                                        const isSelected = formData.date === dateStr;

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => updateField('date', dateStr)}
                                                className={`flex-shrink-0 w-24 p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 snap-start ${isSelected
                                                    ? 'bg-primary-500 border-primary-500 text-black shadow-lg scale-105'
                                                    : 'bg-black/40 border-white/5 text-gray-400 hover:border-primary-500/30'
                                                    }`}
                                            >
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-black/60' : 'text-gray-500'}`}>
                                                    {date.toLocaleDateString('en-US', { month: 'short' })}
                                                </span>
                                                <span className={`text-2xl font-black ${isSelected ? 'text-black' : 'text-white'}`}>
                                                    {date.getDate()}
                                                </span>
                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-black/60' : 'text-gray-500'}`}>
                                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Calendar Picker - Desktop Friendly */}
                                <div className="mt-4">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-primary-500/10 border border-primary-500/30 rounded-xl hover:bg-primary-500/20 transition-all animate-pulse hover:animate-none cursor-pointer">
                                        <Calendar className="w-4 h-4 text-primary-500 flex-shrink-0" />
                                        <span className="text-xs sm:text-sm font-bold text-primary-500 mr-2">Pick from Calendar:</span>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => updateField('date', e.target.value)}
                                            className="flex-1 bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>

                                {/* Visual Clock Time Picker - No Typing Required */}
                                <div className="mt-6 p-6 bg-black/40 border border-white/5 rounded-2xl">
                                    <label className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-primary-500/80 mb-4">
                                        <Clock className="w-4 h-4" />
                                        Select Custom Time
                                    </label>

                                    {/* Hour Selection */}
                                    <div className="mb-4">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Hour</p>
                                        <div className="grid grid-cols-6 gap-2">
                                            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((hour) => (
                                                <button
                                                    key={hour}
                                                    type="button"
                                                    onClick={() => {
                                                        const currentSlot = formData.slot || '';
                                                        const hasAMPM = currentSlot.includes('AM') || currentSlot.includes('PM');
                                                        const ampm = hasAMPM ? (currentSlot.includes('PM') ? 'PM' : 'AM') : 'AM';
                                                        const minute = hasAMPM ? currentSlot.split(':')[1]?.split(' ')[0] || '00' : '00';
                                                        updateField('slot', `${hour}:${minute} ${ampm}`);
                                                    }}
                                                    className={`p-3 rounded-lg border-2 font-bold transition-all ${formData.slot?.startsWith(`${hour}:`)
                                                        ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                                                        : 'border-white/10 bg-zinc-900 text-gray-400 hover:border-primary-500/30'
                                                        }`}
                                                >
                                                    {hour}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Minute Selection */}
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Minute</p>
                                        <div className="grid grid-cols-4 gap-2">
                                            {['00', '15', '30', '45'].map((minute) => (
                                                <button
                                                    key={minute}
                                                    type="button"
                                                    onClick={() => {
                                                        const currentSlot = formData.slot || '';
                                                        const hasAMPM = currentSlot.includes('AM') || currentSlot.includes('PM');
                                                        const ampm = hasAMPM ? (currentSlot.includes('PM') ? 'PM' : 'AM') : 'AM';
                                                        const hour = hasAMPM ? currentSlot.split(':')[0] : '12';
                                                        updateField('slot', `${hour}:${minute} ${ampm}`);
                                                    }}
                                                    className={`p-3 rounded-lg border-2 font-bold transition-all ${formData.slot?.includes(`:${minute} `)
                                                        ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                                                        : 'border-white/10 bg-zinc-900 text-gray-400 hover:border-primary-500/30'
                                                        }`}
                                                >
                                                    :{minute}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* AM/PM Selection */}
                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Period</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['AM', 'PM'].map((period) => (
                                                <button
                                                    key={period}
                                                    type="button"
                                                    onClick={() => {
                                                        const currentSlot = formData.slot || '12:00 AM';
                                                        const timePart = currentSlot.split(' ')[0] || '12:00';
                                                        updateField('slot', `${timePart} ${period}`);
                                                    }}
                                                    className={`p-4 rounded-xl border-2 font-black text-lg transition-all ${formData.slot?.includes(period)
                                                        ? 'border-primary-500 bg-primary-500/20 text-primary-400 shadow-lg'
                                                        : 'border-white/10 bg-zinc-900 text-gray-400 hover:border-primary-500/30'
                                                        }`}
                                                >
                                                    {period}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Selected Time Display */}
                                    {formData.slot && !slots.includes(formData.slot) && (
                                        <div className="mt-4 p-4 bg-primary-500/10 border-2 border-primary-500/50 rounded-xl">
                                            <p className="text-center text-2xl font-black text-primary-400">
                                                <Clock className="w-5 h-5 inline mr-2" />
                                                {formData.slot}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    onClick={prevStep}
                                    className="w-full px-8 py-4 rounded-2xl border-2 border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={nextStep}
                                    disabled={!formData.date || !formData.slot}
                                    className="w-full btn-primary disabled:opacity-50 text-black font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                                >
                                    Review
                                    <ArrowRight className="w-5 h-5 inline ml-2" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Customer Details */}
                    {step === 3 && (
                        <div className="space-y-8">
                            <h2 className="text-2xl font-serif font-bold text-white mb-6">Final Details</h2>

                            {!user && (
                                <div className="mb-8">
                                    <button
                                        onClick={async () => {
                                            try {
                                                await loginWithGoogle();
                                            } catch (error) {
                                                console.error("Google Login Error:", error);
                                                alert("Login failed. Please try again.");
                                            }
                                        }}
                                        className="w-full bg-white text-black font-black py-5 px-6 rounded-2xl transition-all duration-300 hover:bg-gray-100 hover:scale-[1.02] flex items-center justify-center gap-4 shadow-xl"
                                    >
                                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                                        Express Secure Booking with Google
                                    </button>

                                    <div className="relative my-8">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-white/5"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-4 bg-zinc-900 text-gray-500 font-bold uppercase tracking-widest text-[10px]">Or Continue Manually</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
                                        <User className="w-3 h-3" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-gray-700"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
                                        <Phone className="w-3 h-3" />
                                        Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.mobile}
                                        onChange={(e) => {
                                            updateField('mobile', e.target.value);
                                            // Auto-sync WhatsApp if checkbox is checked
                                            if (formData.whatsappSameAsMobile) {
                                                updateField('whatsapp', e.target.value);
                                            }
                                        }}
                                        placeholder="10-digit mobile number"
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-gray-700"
                                    />
                                </div>
                            </div>

                            {/* WhatsApp Number */}
                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
                                    <Phone className="w-3 h-3" />
                                    WhatsApp Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.whatsapp}
                                    onChange={(e) => {
                                        updateField('whatsapp', e.target.value);
                                        updateField('whatsappSameAsMobile', false);
                                    }}
                                    disabled={formData.whatsappSameAsMobile}
                                    placeholder="WhatsApp number"
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-gray-700 disabled:opacity-50"
                                />
                                <div className="flex items-center gap-2 mt-2">
                                    <input
                                        type="checkbox"
                                        id="whatsappSame"
                                        checked={formData.whatsappSameAsMobile}
                                        onChange={(e) => {
                                            updateField('whatsappSameAsMobile', e.target.checked);
                                            if (e.target.checked) {
                                                updateField('whatsapp', formData.mobile);
                                            }
                                        }}
                                        className="w-4 h-4 accent-primary-500 bg-black border-white/10"
                                    />
                                    <label htmlFor="whatsappSame" className="text-xs text-gray-400 cursor-pointer">
                                        Same as mobile number
                                    </label>
                                </div>
                            </div>

                            {/* Saree Count */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
                                        <Calendar className="w-3 h-3" />
                                        Number of Sarees
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => updateField('sareeCount', Math.max(1, formData.sareeCount - 1))}
                                            className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 text-white font-bold hover:bg-primary-500/20 hover:border-primary-500 transition-all text-lg"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            value={formData.sareeCount}
                                            onChange={(e) => updateField('sareeCount', Math.max(1, parseInt(e.target.value) || 1))}
                                            className="w-16 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => updateField('sareeCount', formData.sareeCount + 1)}
                                            className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 text-white font-bold hover:bg-primary-500/20 hover:border-primary-500 transition-all text-lg"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Total Price */}
                                <div>
                                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">
                                        Total Amount
                                    </label>
                                    <div className="bg-gradient-to-r from-primary-500/20 to-primary-600/20 border-2 border-primary-500/50 rounded-2xl p-5 text-center h-[68px] flex flex-col items-center justify-center">
                                        <p className="text-2xl md:text-3xl font-black text-primary-400">
                                            ₹{(() => {
                                                const selectedService = services.find(s => s.id === formData.service);
                                                const basePrice = selectedService?.price || 0;
                                                return (basePrice * formData.sareeCount).toLocaleString();
                                            })()}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formData.sareeCount} saree{formData.sareeCount > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
                                        <MapPin className="w-3 h-3" />
                                        Address
                                    </label>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if ("geolocation" in navigator) {
                                                try {
                                                    const position = await new Promise((resolve, reject) => {
                                                        navigator.geolocation.getCurrentPosition(resolve, reject);
                                                    });

                                                    const { latitude, longitude } = position.coords;

                                                    // Use reverse geocoding to get address
                                                    const response = await fetch(
                                                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                                                    );
                                                    const data = await response.json();

                                                    if (data.display_name) {
                                                        updateField('address', data.display_name);
                                                    } else {
                                                        updateField('address', `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                                                    }
                                                } catch (error) {
                                                    alert("Unable to get your location. Please enter manually.");
                                                }
                                            } else {
                                                alert("Geolocation is not supported by your browser.");
                                            }
                                        }}
                                        className="text-xs text-primary-400 hover:text-primary-300 font-semibold flex items-center gap-1 px-3 py-1.5 bg-primary-500/10 rounded-lg border border-primary-500/30 hover:bg-primary-500/20 transition-all"
                                    >
                                        <MapPin className="w-3 h-3" fill="currentColor" />
                                        Get Location
                                    </button>
                                </div>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => updateField('address', e.target.value)}
                                    placeholder="Enter your address for pickup/delivery"
                                    rows="3"
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-gray-700"
                                />
                            </div>

                            <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary-500/80 flex items-center gap-2">
                                    <Ruler className="w-4 h-4" />
                                    Measurements & Notes (Optional)
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {['waist', 'hip', 'length', 'blouseSize'].map((key) => (
                                        <div key={key}>
                                            <input
                                                type="text"
                                                placeholder={key.toUpperCase()}
                                                value={formData.measurements[key]}
                                                onChange={(e) => updateMeasurement(key, e.target.value)}
                                                className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-primary-500/50 transition-all placeholder:text-gray-700"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3 bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                                    <input
                                        type="checkbox"
                                        id="pickup"
                                        checked={formData.pickupRequired}
                                        onChange={(e) => updateField('pickupRequired', e.target.checked)}
                                        className="w-5 h-5 accent-primary-500 bg-black border-white/10"
                                    />
                                    <label htmlFor="pickup" className="text-sm text-gray-300 font-medium cursor-pointer">
                                        I need pickup/delivery service <span className="text-primary-500 font-bold ml-1">(Travel separate)</span>
                                    </label>
                                </div>
                            </div>

                            {/* Payment Method Selection */}
                            <div className="p-6 bg-gradient-to-br from-primary-500/10 via-black/40 to-black/40 border border-primary-500/30 rounded-3xl space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-primary-500 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Payment Method
                                </h3>

                                <div className="grid md:grid-cols-3 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => { updateField('paymentMethod', 'online'); updateField('paidAmount', 0); }}
                                        className={`p-4 rounded-xl border-2 font-bold transition-all ${formData.paymentMethod === 'online'
                                            ? 'border-primary-500 bg-primary-500/20 text-primary-400 shadow-lg'
                                            : 'border-white/10 bg-black/40 text-gray-400 hover:border-primary-500/30'
                                            }`}
                                    >
                                        💳 Pay Now
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => { updateField('paymentMethod', 'cash'); updateField('paidAmount', 0); }}
                                        className={`p-4 rounded-xl border-2 font-bold transition-all ${formData.paymentMethod === 'cash'
                                            ? 'border-primary-500 bg-primary-500/20 text-primary-400 shadow-lg'
                                            : 'border-white/10 bg-black/40 text-gray-400 hover:border-primary-500/30'
                                            }`}
                                    >
                                        💵 Cash on Delivery
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => updateField('paymentMethod', 'advance')}
                                        className={`p-4 rounded-xl border-2 font-bold transition-all ${formData.paymentMethod === 'advance'
                                            ? 'border-primary-500 bg-primary-500/20 text-primary-400 shadow-lg'
                                            : 'border-white/10 bg-black/40 text-gray-400 hover:border-primary-500/30'
                                            }`}
                                    >
                                        📊 Advance Payment
                                    </button>
                                </div>

                                {/* Advance Payment Amount Input */}
                                {formData.paymentMethod === 'advance' && (
                                    <div className="mt-4 p-4 bg-black/60 border border-primary-500/20 rounded-xl">
                                        <label className="block text-xs text-gray-400 font-bold mb-2 uppercase tracking-wider">
                                            Enter Advance Amount (Optional)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 font-bold">₹</span>
                                            <input
                                                type="number"
                                                value={formData.paidAmount || ''}
                                                onChange={(e) => updateField('paidAmount', parseInt(e.target.value) || 0)}
                                                placeholder="0"
                                                min="0"
                                                className="w-full pl-8 pr-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">
                                            Leave blank to pay advance later. You can pay partial amount now.
                                        </p>
                                    </div>
                                )}

                                {formData.paymentMethod === 'cash' && (
                                    <p className="text-sm text-gray-400 bg-black/40 p-3 rounded-lg border border-white/5">
                                        💡 You will pay when your order is ready for delivery
                                    </p>
                                )}
                            </div>

                            {error && (
                                <div className="p-5 bg-red-900/20 border border-red-500/30 text-red-500 text-sm font-bold rounded-2xl">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-4 pt-4">
                                <button onClick={prevStep} className="px-8 py-5 rounded-2xl border-2 border-white/10 text-white font-bold hover:bg-white/5 flex-1 transition-all" disabled={loading}>
                                    Back
                                </button>
                                <button
                                    onClick={async () => {
                                        console.log('[BOOKING] Button clicked');
                                        console.log('[BOOKING] Form data:', formData);
                                        console.log('[BOOKING] User:', user);

                                        setLoading(true);
                                        setError('');
                                        try {
                                            let customerId;
                                            let customerEmail = '';
                                            if (user && user.uid) {
                                                customerId = user.uid;
                                                customerEmail = user.email;
                                                await setDoc(doc(db, 'customers', user.uid), {
                                                    name: formData.name || user.displayName,
                                                    email: user.email,
                                                    mobile: formData.mobile,
                                                    whatsapp: formData.whatsapp,
                                                    address: formData.address,
                                                    lastBookingAt: new Date().toISOString()
                                                }, { merge: true });
                                            } else {
                                                const existingCustomer = await actions.findCustomerByMobile(formData.mobile);
                                                if (existingCustomer) {
                                                    customerId = existingCustomer.id;
                                                    customerEmail = existingCustomer.email || '';
                                                } else {
                                                    const newCustomer = await actions.addCustomer({
                                                        name: formData.name,
                                                        mobile: formData.mobile,
                                                        email: '',
                                                        address: formData.address,
                                                        whatsapp: formData.whatsapp,
                                                        referral: 'Website Booking',
                                                        isGuest: true
                                                    });
                                                    customerId = newCustomer.id;
                                                }
                                            }

                                            const selectedServiceObj = services.find(s => s.id === formData.service);
                                            const basePrice = selectedServiceObj ? selectedServiceObj.price : 0;
                                            const totalAmount = basePrice * formData.sareeCount;

                                            console.log('[BOOKING] Creating order...');
                                            const newOrder = await actions.addOrder({
                                                customerId: customerId,
                                                customerName: formData.name,
                                                customerMobile: formData.mobile,
                                                customerEmail: customerEmail,
                                                customerWhatsapp: formData.whatsapp,
                                                service: selectedServiceObj ? selectedServiceObj.name : formData.service,
                                                amount: totalAmount,
                                                sareeCount: formData.sareeCount,
                                                date: formData.date,
                                                slotTime: formData.slot,
                                                address: formData.address,
                                                measurements: formData.measurements,
                                                notes: `Pick/Drop: ${formData.pickupRequired ? 'Yes' : 'No'} | WA: ${formData.whatsapp}`,
                                                paymentMethod: formData.paymentMethod,
                                                paidAmount: formData.paidAmount || 0,
                                                paymentStatus: formData.paidAmount > 0 ? 'Partial' : 'Pending'
                                            });

                                            console.log('[BOOKING] Order created:', newOrder);
                                            // Redirect based on payment method
                                            if (formData.paymentMethod === 'online' || formData.paymentMethod === 'advance') {
                                                // Go to payment page for online/advance payments
                                                console.log('[BOOKING] Redirecting to payment page:', `/payment/${newOrder.id}`);
                                                navigate(`/payment/${newOrder.id}`);
                                            } else {
                                                // Go to tracking for cash on delivery
                                                console.log('[BOOKING] Redirecting to tracking page:', `/track/${newOrder.id}`);
                                                navigate(`/track/${newOrder.id}`);
                                            }
                                        } catch (err) {
                                            console.error("[BOOKING] Error:", err);
                                            setError(err.message || "Booking failed. Please try again.");
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    disabled={!formData.name || !formData.mobile || loading}
                                    className="btn-primary flex-[1.5] text-black font-bold py-4 text-sm sm:text-base rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.3)] disabled:opacity-50 relative overflow-hidden"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <span>Confirm Booking</span>
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
