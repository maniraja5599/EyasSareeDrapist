import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, User, Phone, MapPin, ArrowRight, CheckCircle, Ruler } from 'lucide-react';

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useDataStore } from '../hooks/useDataStore';
import { useAuth } from '../contexts/AuthContext';
import { useScrollRestoration } from '../hooks/useScrollRestoration';
import { usePersistedState } from '../hooks/usePersistedState';

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

    // Use persisted state for form data - saves to localStorage
    const [formData, setFormData] = usePersistedState('booking_form_data', {
        service: preselectedService,
        date: '',
        slot: '',
        name: user?.displayName || user?.name || '',
        mobile: user?.mobile || '',
        email: user?.email || '',
        whatsapp: user?.whatsapp || user?.mobile || '',
        whatsappSameAsMobile: true,
        sareeCount: 1,
        pickupRequired: false,
        address: user?.address || '',
        latitude: user?.latitude || null,
        longitude: user?.longitude || null,
        paymentMethod: 'cash',
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
                latitude: prev.latitude || user.latitude || null,
                longitude: prev.longitude || user.longitude || null,
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
        { id: 'prepleat', name: 'Pre-Pleating Only', price: 600, duration: '30-45 mins', discount: 50 },
        { id: 'draping', name: 'Draping Only', price: 1600, duration: '15-20 mins', discount: 50 },
        { id: 'both', name: 'Pre-Pleat + Draping', price: 3000, duration: 'Best Value', discount: 50 }
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
        // Explicitly clear service selection if not provided in URL
        // This prevents persisted state from pre-selecting a service when not intended
        if (!preselectedService) {
            setFormData(prev => ({ ...prev, service: '' }));
        }
    }, [preselectedService]);

    // Scroll to top when step changes
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <div className="min-h-screen bg-black text-white py-6 sm:py-10 px-4 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-10 animate-fade-in">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold mb-2 sm:mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-primary-600">
                        {webpageSettings?.bookingTitle || 'Book Your Appointment'}
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base text-gray-400 font-light">
                        {webpageSettings?.bookingSubtitle || 'Choose your service and preferred time slot'}
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-6 sm:mb-10">
                    <div className="flex items-center justify-center gap-2 sm:gap-4">
                        {[1, 2, 3].map((s) => (
                            <React.Fragment key={s}>
                                <div className={`flex items-center gap-2 sm:gap-3 ${step >= s ? 'opacity-100' : 'opacity-40'}`}>
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all duration-300 ${step >= s
                                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                                        : 'bg-zinc-800 text-gray-500 border border-white/5'
                                        }`}>
                                        {s}
                                    </div>
                                    <span className={`hidden sm:inline font-semibold text-[10px] sm:text-xs md:text-sm ${step >= s ? 'text-white' : 'text-gray-500'}`}>
                                        {s === 1 ? 'Service' : s === 2 ? 'Schedule' : 'Details'}
                                    </span>
                                </div>
                                {s < 3 && <div className={`w-8 sm:w-12 h-1 rounded ${step > s ? 'bg-primary-500' : 'bg-zinc-800'}`}></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <div className="gradient-card border-white/5 bg-zinc-900/50 backdrop-blur-xl animate-slide-up p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl">
                    {/* Step 1: Service Selection */}
                    {step === 1 && (
                        <div className="space-y-4 sm:space-y-6">
                            <h2 className="text-lg sm:text-xl font-serif font-bold text-white mb-4 sm:mb-6">Select Service</h2>
                            <div className="grid md:grid-cols-3 gap-3 sm:gap-4">
                                {services.map((service) => (
                                    <button
                                        key={service.id}
                                        onClick={() => updateField('service', service.id)}
                                        className={`p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${formData.service === service.id
                                            ? 'border-primary-500 bg-primary-500/10 shadow-lg shadow-primary-500/20'
                                            : 'border-white/20 bg-zinc-800/50 hover:border-primary-500/50 hover:bg-zinc-800'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                                            <h3 className="font-bold text-sm sm:text-base text-white">{service.name}</h3>
                                            {formData.service === service.id && (
                                                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" />
                                            )}
                                        </div>

                                        <p className="text-xs sm:text-sm text-gray-400 font-light">{service.duration}</p>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={nextStep}
                                disabled={!formData.service}
                                className="btn-primary w-full mt-4 sm:mt-6 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl text-xs sm:text-sm"
                            >
                                Continue to Schedule
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 inline ml-2" />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Date & Time */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-lg sm:text-xl font-serif font-bold text-white mb-6">Choose Date & Time</h2>

                            {/* Sticky Selection Summary - Compact */}
                            <div className="sticky top-0 z-20 bg-zinc-900/95 backdrop-blur-md border border-primary-500/20 rounded-xl p-3 mb-4 shadow-lg transform transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                                            <Calendar className="w-4 h-4 text-primary-400" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">Selected Slot</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-white">
                                                    {formData.date ? new Date(formData.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Select Date'}
                                                </span>
                                                {formData.slot && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                                        <span className="text-xs font-bold text-primary-400">{formData.slot}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {formData.date && formData.slot && (
                                        <CheckCircle className="w-5 h-5 text-green-500 animate-pulse" />
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary-500/80 mb-2">
                                    <Calendar className="w-3 h-3" />
                                    Select Date
                                </label>

                                {/* Date Scroller - Compact */}
                                <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 snap-x scrollbar-hide">
                                    {Array.from({ length: 14 }).map((_, i) => {
                                        const date = new Date();
                                        date.setDate(date.getDate() + i);
                                        const dateStr = date.toISOString().split('T')[0];
                                        const isSelected = formData.date === dateStr;

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => updateField('date', dateStr)}
                                                className={`flex-shrink-0 w-12 sm:w-14 p-1.5 rounded-lg border transition-all duration-300 flex flex-col items-center justify-center gap-0.5 snap-start ${isSelected
                                                    ? 'bg-primary-500 border-primary-500 text-black shadow-lg scale-105'
                                                    : 'bg-black/40 border-white/5 text-gray-400 hover:border-primary-500/30'
                                                    }`}
                                            >
                                                <span className={`text-[8px] font-bold uppercase tracking-widest ${isSelected ? 'text-black/60' : 'text-gray-500'}`}>
                                                    {date.toLocaleDateString('en-US', { month: 'short' })}
                                                </span>
                                                <span className={`text-base font-black ${isSelected ? 'text-black' : 'text-white'}`}>
                                                    {date.getDate()}
                                                </span>
                                                <span className={`text-[8px] font-bold uppercase tracking-widest ${isSelected ? 'text-black/60' : 'text-gray-500'}`}>
                                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Calendar Picker - Compact */}
                                <div className="mt-2 text-right">
                                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 border border-white/5 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors">
                                        <Calendar className="w-3 h-3 text-primary-500" />
                                        <span className="text-[10px] font-bold text-gray-400">Pick Date:</span>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => updateField('date', e.target.value)}
                                            className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer w-[90px]"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                {/* Visual Clock Time Picker - Compact */}
                                <div className="mt-2 p-3 sm:p-4 bg-black/40 border border-white/5 rounded-2xl">
                                    <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary-500/80 mb-3">
                                        <Clock className="w-3 h-3" />
                                        Select Time
                                    </label>

                                    {/* Hour Selection */}
                                    <div className="mb-3">
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1.5">Hour</p>
                                        <div className="grid grid-cols-6 gap-1.5">
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
                                                    className={`py-1.5 rounded-md border text-xs font-bold transition-all ${formData.slot?.startsWith(`${hour}:`)
                                                        ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                                                        : 'border-white/10 bg-zinc-900 text-gray-400 hover:border-primary-500/30'
                                                        }`}
                                                >
                                                    {hour}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Minute Selection */}
                                        <div>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1.5">Minute</p>
                                            <div className="grid grid-cols-4 gap-1.5">
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
                                                        className={`py-1.5 rounded-md border text-xs font-bold transition-all ${formData.slot?.includes(`:${minute} `)
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
                                        <div>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1.5">Period</p>
                                            <div className="grid grid-cols-2 gap-1.5">
                                                {['AM', 'PM'].map((period) => (
                                                    <button
                                                        key={period}
                                                        type="button"
                                                        onClick={() => {
                                                            const currentSlot = formData.slot || '12:00 AM';
                                                            const timePart = currentSlot.split(' ')[0] || '12:00';
                                                            updateField('slot', `${timePart} ${period}`);
                                                        }}
                                                        className={`py-1.5 rounded-md border text-xs font-black transition-all ${formData.slot?.includes(period)
                                                            ? 'border-primary-500 bg-primary-500/20 text-primary-400 shadow-lg'
                                                            : 'border-white/10 bg-zinc-900 text-gray-400 hover:border-primary-500/30'
                                                            }`}
                                                    >
                                                        {period}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selected Time Display - Very Compact */}
                                    {formData.slot && !slots.includes(formData.slot) && (
                                        <div className="mt-3 py-2 px-3 bg-primary-500/10 border border-primary-500/30 rounded-lg flex items-center justify-center gap-2">
                                            <Clock className="w-3.5 h-3.5 text-primary-400" />
                                            <span className="text-sm font-black text-primary-400">{formData.slot}</span>
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

                            {/* Sticky Selection Summary - Compact */}
                            <div className="sticky top-0 z-20 bg-zinc-900/95 backdrop-blur-md border border-primary-500/20 rounded-xl p-3 mb-6 shadow-lg transform transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                                            <Calendar className="w-4 h-4 text-primary-400" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">Booking Slot</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-white">
                                                    {formData.date ? new Date(formData.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Select Date'}
                                                </span>
                                                {formData.slot && (
                                                    <>
                                                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                                        <span className="text-xs font-bold text-primary-400">{formData.slot}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setStep(2)}
                                        className="px-3 py-1.5 rounded-lg bg-zinc-800 text-[10px] font-bold text-gray-300 hover:bg-zinc-700 hover:text-white transition-all border border-white/5"
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>

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
                            <div className="grid grid-cols-1 gap-6">
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
                                                    updateField('latitude', latitude);
                                                    updateField('longitude', longitude);

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
                                            const basePrice = selectedServiceObj ? Number(selectedServiceObj.price) : 0;
                                            const discount = selectedServiceObj && selectedServiceObj.discount ? Number(selectedServiceObj.discount) : 0;

                                            // Apply discount if any
                                            const discountedPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;
                                            const finalPricePerSaree = Math.round(discountedPrice);
                                            const totalAmount = finalPricePerSaree * formData.sareeCount;

                                            console.log('[BOOKING] Creating order...');
                                            const newOrder = await actions.addOrder({
                                                customerId: customerId,
                                                customerName: formData.name,
                                                customerMobile: formData.mobile,
                                                customerEmail: customerEmail,
                                                customerWhatsapp: formData.whatsapp,
                                                service: selectedServiceObj ? selectedServiceObj.name : formData.service,
                                                amount: totalAmount,
                                                originalAmount: basePrice * formData.sareeCount, // Track original price before discount
                                                discountApplied: discount, // Track discount %
                                                sareeCount: formData.sareeCount,
                                                date: formData.date,
                                                slotTime: formData.slot,
                                                slotTime: formData.slot,
                                                address: formData.address,
                                                location: {
                                                    lat: formData.latitude,
                                                    lng: formData.longitude
                                                },
                                                measurements: formData.measurements,
                                                notes: `Pick/Drop: ${formData.pickupRequired ? 'Yes' : 'No'} | WA: ${formData.whatsapp}`,
                                                notes: `Pick/Drop: ${formData.pickupRequired ? 'Yes' : 'No'} | WA: ${formData.whatsapp}`,
                                                paymentMethod: 'pay_at_venue',
                                                paidAmount: 0,
                                                paymentStatus: 'Pending'
                                            });

                                            console.log('[BOOKING] Order created:', newOrder);
                                            // Always redirect to tracking page since payment is removed
                                            console.log('[BOOKING] Redirecting to tracking page:', `/track/${newOrder.id}`);
                                            navigate(`/track/${newOrder.id}`);
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
