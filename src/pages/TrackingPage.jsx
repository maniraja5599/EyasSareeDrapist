import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Package, CheckCircle, Clock, Loader2 } from 'lucide-react';

const TrackingPage = () => {
    const { bookingId: urlBookingId } = useParams();
    const [bookingId, setBookingId] = useState(urlBookingId || '');
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);

        // Fetch fresh data from localStorage
        const savedOrders = localStorage.getItem('eyas_orders');
        const allOrders = savedOrders ? JSON.parse(savedOrders) : [];
        const foundOrder = allOrders.find(o => o.id.toLowerCase() === bookingId.toLowerCase());

        setTimeout(() => {
            if (foundOrder) {
                setBooking({
                    ...foundOrder,
                    slot: foundOrder.slotTime // Map slotTime to slot for UI compatibility
                });
            } else {
                alert('Booking not found! Please check the ID.');
                setBooking(null);
            }
            setLoading(false);
        }, 800);
    };

    const statuses = [
        { id: 'booked', label: 'Booked', icon: CheckCircle },
        { id: 'received', label: 'Saree Received', icon: Package },
        { id: 'in_progress', label: 'In Progress', icon: Clock },
        { id: 'ready', label: 'Ready', icon: CheckCircle },
        { id: 'completed', label: 'Completed', icon: CheckCircle }
    ];

    const getCurrentStep = () => {
        const statusIndex = statuses.findIndex(s => s.id === booking?.status);
        return statusIndex >= 0 ? statusIndex : 0;
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-5xl font-serif font-bold mb-4 text-gradient-primary">
                        Track Your Order
                    </h1>
                    <p className="text-xl text-gray-600">
                        Enter your booking ID to check the status
                    </p>
                </div>

                {/* Search Form */}
                <div className="glass-card mb-8 animate-slide-up">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={bookingId}
                                onChange={(e) => setBookingId(e.target.value)}
                                placeholder="Enter Booking ID (e.g., EYS-ABC123)"
                                className="input-field"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!bookingId || loading}
                            className="btn-primary disabled:opacity-50 flex items-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Search className="w-5 h-5" />
                            )}
                            Track
                        </button>
                    </form>
                </div>

                {/* Results */}
                {booking && (
                    <div className="gradient-card animate-scale-in">
                        {/* Booking Info */}
                        <div className="mb-8 pb-8 border-b border-gray-200">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                                    <p className="font-bold text-lg">{booking.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Service</p>
                                    <p className="font-bold text-lg">{booking.service}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Scheduled</p>
                                    <p className="font-bold text-lg">{booking.date} at {booking.slot}</p>
                                </div>
                            </div>
                        </div>

                        {/* Status Timeline */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-display font-bold mb-6">Order Status</h3>

                            {statuses.map((status, index) => {
                                const Icon = status.icon;
                                const isActive = index <= getCurrentStep();
                                const isCurrent = index === getCurrentStep();

                                return (
                                    <div key={status.id} className="flex gap-4 relative">
                                        {index < statuses.length - 1 && (
                                            <div className={`absolute left-6 top-12 bottom-0 w-0.5 ${isActive ? 'bg-primary-500' : 'bg-gray-200'
                                                }`} />
                                        )}

                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isActive
                                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                                            : 'bg-gray-200 text-gray-400'
                                            }`}>
                                            <Icon className="w-6 h-6" />
                                        </div>

                                        <div className="flex-1 pb-8">
                                            <h4 className={`font-bold text-lg mb-1 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {status.label}
                                            </h4>
                                            {isCurrent && (
                                                <p className="text-sm text-primary-600 font-semibold">Current Status</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {booking.status === 'ready' && (
                            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
                                <p className="text-lg font-semibold text-green-900 mb-4">
                                    🎉 Your saree is ready for pickup!
                                </p>
                                <button className="btn-primary">
                                    Make Payment
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackingPage;
