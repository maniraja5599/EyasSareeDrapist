import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, User, Phone, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

import { useDataStore } from '../hooks/useDataStore';

const BookingPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedService = searchParams.get('service') || '';
    const { webpageSettings, actions } = useDataStore();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        service: preselectedService,
        date: '',
        slot: '',
        name: '',
        mobile: '',
        whatsapp: '',
        pickupRequired: false,
        address: '',
        notes: ''
    });

    // Use dynamic services from store, fallback to default if empty (rare)
    const services = webpageSettings?.services || [
        { id: 'prepleat', name: 'Pre-Pleating', price: 250, duration: '30-45 mins' },
        { id: 'draping', name: 'Draping', price: 300, duration: '15-20 mins' },
        { id: 'both', name: 'Complete Package', price: 500, duration: 'Best Value' }
    ];

    const slots = ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'];

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-5xl font-serif font-bold mb-4 text-gradient-primary">
                        {webpageSettings?.bookingTitle || 'Book Your Appointment'}
                    </h1>
                    <p className="text-xl text-gray-600">
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
                                        : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {s}
                                    </div>
                                    <span className="hidden sm:inline font-semibold text-gray-700">
                                        {s === 1 ? 'Service' : s === 2 ? 'Schedule' : 'Details'}
                                    </span>
                                </div>
                                {s < 3 && <div className="w-12 h-1 bg-gray-200 rounded"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <div className="gradient-card animate-slide-up">
                    {/* Step 1: Service Selection */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-display font-bold mb-6">Select Service</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                {services.map((service) => (
                                    <button
                                        key={service.id}
                                        onClick={() => updateField('service', service.id)}
                                        className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${formData.service === service.id
                                            ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/20'
                                            : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-bold text-lg">{service.name}</h3>
                                            {formData.service === service.id && (
                                                <CheckCircle className="w-6 h-6 text-primary-600" />
                                            )}
                                        </div>
                                        <p className="text-3xl font-bold text-primary-600 mb-2">₹{service.price}</p>
                                        <p className="text-sm text-gray-600">{service.duration}</p>
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={nextStep}
                                disabled={!formData.service}
                                className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                                <ArrowRight className="w-5 h-5 inline ml-2" />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Date & Time */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-display font-bold mb-6">Choose Date & Time</h2>

                            <div>
                                <label className="label">
                                    <Calendar className="w-4 h-4 inline mr-2" />
                                    Select Date
                                </label>

                                {/* Date Scroller */}
                                <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 snap-x custom-scrollbar">
                                    {Array.from({ length: 14 }).map((_, i) => {
                                        const date = new Date();
                                        date.setDate(date.getDate() + i);
                                        const dateStr = date.toISOString().split('T')[0];
                                        const isSelected = formData.date === dateStr;

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => updateField('date', dateStr)}
                                                className={`flex-shrink-0 w-20 p-3 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 snap-start ${isSelected
                                                    ? 'bg-primary-500 border-primary-500 text-white shadow-lg scale-105'
                                                    : 'bg-white border-gray-200 hover:border-primary-300 text-gray-600'
                                                    }`}
                                            >
                                                <span className={`text-xs font-semibold ${isSelected ? 'text-primary-100' : 'text-gray-400'}`}>
                                                    {date.toLocaleDateString('en-US', { month: 'short' })}
                                                </span>
                                                <span className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                                    {date.getDate()}
                                                </span>
                                                <span className={`text-xs ${isSelected ? 'text-primary-100' : 'text-gray-500'}`}>
                                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center justify-between mt-2 px-1">
                                    <span className="text-xs text-gray-400">Scroll to see more dates</span>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            onChange={(e) => updateField('date', e.target.value)}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                        <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Pick from Calendar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="label">
                                    <Clock className="w-4 h-4 inline mr-2" />
                                    Select Time Slot
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {slots.map((slot) => (
                                        <button
                                            key={slot}
                                            onClick={() => updateField('slot', slot)}
                                            className={`p-4 rounded-xl border-2 font-semibold transition-all duration-300 ${formData.slot === slot
                                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                : 'border-gray-200 hover:border-primary-300'
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center gap-3">
                                    <span className="text-sm text-gray-500">Or choose a specific time:</span>
                                    <input
                                        type="time"
                                        value={formData.slot.includes(':') && !slots.includes(formData.slot) ? formData.slot : ''}
                                        onChange={(e) => {
                                            const time = e.target.value;
                                            // Convert 24h to 12h format for consistency if needed, or just store as is
                                            // Simple 12h conversion
                                            const [h, m] = time.split(':');
                                            const hour = parseInt(h);
                                            const ampm = hour >= 12 ? 'PM' : 'AM';
                                            const formattedHour = hour % 12 || 12;
                                            const formattedTime = `${formattedHour}:${m} ${ampm}`;
                                            updateField('slot', formattedTime);
                                        }}
                                        className="input-field max-w-[150px] py-2"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={prevStep} className="btn-outline flex-1">
                                    Back
                                </button>
                                <button
                                    onClick={nextStep}
                                    disabled={!formData.date || !formData.slot}
                                    className="btn-primary flex-1 disabled:opacity-50"
                                >
                                    Continue
                                    <ArrowRight className="w-5 h-5 inline ml-2" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Customer Details */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-display font-bold mb-6">Your Details</h2>

                            <div>
                                <label className="label">
                                    <User className="w-4 h-4 inline mr-2" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder="Enter your name"
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <Phone className="w-4 h-4 inline mr-2" />
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.mobile}
                                    onChange={(e) => updateField('mobile', e.target.value)}
                                    placeholder="10-digit mobile number"
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    WhatsApp Number (Optional)
                                </label>
                                <input
                                    type="tel"
                                    value={formData.whatsapp}
                                    onChange={(e) => updateField('whatsapp', e.target.value)}
                                    placeholder="For order updates"
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="label">
                                    <MapPin className="w-4 h-4 inline mr-2" />
                                    Address
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => updateField('address', e.target.value)}
                                    placeholder="Enter your address"
                                    rows="3"
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.pickupRequired}
                                        onChange={(e) => updateField('pickupRequired', e.target.checked)}
                                        className="w-5 h-5 text-primary-600 rounded"
                                    />
                                    <span className="font-medium">I need pickup/delivery service</span>
                                </label>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={prevStep} className="btn-outline flex-1">
                                    Back
                                </button>
                                <button
                                    onClick={() => {
                                        const selectedServiceObj = services.find(s => s.id === formData.service);
                                        const newOrder = actions.addOrder({
                                            customerName: formData.name,
                                            customerMobile: formData.mobile,
                                            service: selectedServiceObj ? selectedServiceObj.name : formData.service,
                                            amount: selectedServiceObj ? selectedServiceObj.price : 0,
                                            date: formData.date,
                                            slotTime: formData.slot,
                                            address: formData.address,
                                            notes: `Pick/Drop: ${formData.pickupRequired ? 'Yes' : 'No'} | WA: ${formData.whatsapp}`
                                        });
                                        navigate(`/track/${newOrder.id}`);
                                    }}
                                    disabled={!formData.name || !formData.mobile}
                                    className="btn-primary flex-1 disabled:opacity-50"
                                >
                                    Confirm Booking
                                    <CheckCircle className="w-5 h-5 inline ml-2" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default BookingPage;
