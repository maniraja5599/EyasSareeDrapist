import React, { useState } from 'react';
import { Search, Loader2, CheckCircle2, Clock, Package, MapPin } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const StatusTracker = () => {
    const [bookingId, setBookingId] = useState('');
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!bookingId) return;

        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const docRef = doc(db, "bookings", bookingId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                // Calculate steps based on status
                const steps = [
                    { label: 'Booked', date: data.createdAt?.toDate().toLocaleDateString() || 'N/A', done: true },
                    { label: 'In Progress', date: '', done: false },
                    { label: 'Ready for Pickup', date: '', done: false },
                    { label: 'Completed', date: '', done: false }
                ];

                // Simple status logic for demo
                if (data.status === 'In Progress') {
                    steps[1].done = true;
                    steps[1].current = true;
                } else if (data.status === 'Ready') {
                    steps[1].done = true;
                    steps[2].done = true;
                    steps[2].current = true;
                } else if (data.status === 'Completed') {
                    steps.forEach(s => s.done = true);
                } else {
                    steps[0].current = true;
                }

                setOrder({
                    id: docSnap.id,
                    customer: data.name,
                    service: data.service,
                    status: data.status,
                    steps: steps
                });
            } else {
                setError('Order not found. Please check the ID.');
            }
        } catch (err) {
            console.error(err);
            setError('Error fetching order. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream-50 pt-28 pb-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-secondary-900 mb-4">
                        Track Your <span className="text-primary-600 italic">Elegance</span>
                    </h1>
                    <p className="text-gray-500 text-lg">Enter your Booking ID to check the real-time status of your order.</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 md:p-10 animate-slide-up">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-10">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Enter Booking ID (e.g. EDS-8X2A)"
                                value={bookingId}
                                onChange={(e) => setBookingId(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all shadow-sm font-mono text-lg"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold py-4 px-8 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Package className="w-6 h-6" />}
                            <span>Track Order</span>
                        </button>
                    </form>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 mb-8 flex items-center gap-3 animate-fade-in">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            {error}
                        </div>
                    )}

                    {order && (
                        <div className="animate-fade-in">
                            {/* Order Summary Card */}
                            <div className="bg-gradient-to-br from-secondary-50 to-cream-50 rounded-2xl p-6 border border-secondary-100 mb-10">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Service</p>
                                        <p className="font-bold text-gray-900">{order.service}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Customer</p>
                                        <p className="font-bold text-gray-900">{order.customer}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Order Date</p>
                                        <p className="font-bold text-gray-900 font-mono">{order.steps[0].date}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Current Status</p>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Ready' ? 'bg-indigo-100 text-indigo-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="relative pl-4 md:pl-8 space-y-12 before:absolute before:left-[27px] md:before:left-[43px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100">
                                {order.steps.map((step, index) => {
                                    // Determine icon and color based on state
                                    const isCompleted = step.done;
                                    const isCurrent = step.current;
                                    const isPending = !step.done && !step.current;

                                    return (
                                        <div key={index} className="relative flex gap-6 items-start group">
                                            {/* Connector Line (Dynamic) */}
                                            {index < order.steps.length - 1 && (
                                                <div className={`absolute left-[27px] md:left-[43px] top-10 bottom-[-48px] w-0.5 transition-colors duration-500 ${isCompleted ? 'bg-primary-500' : 'bg-transparent'
                                                    }`} style={{ zIndex: 1 }}></div>
                                            )}

                                            {/* Icon Bubble */}
                                            <div className={`relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center border-4 transition-all duration-500 shadow-sm ${isCompleted ? 'bg-primary-500 border-primary-100 text-white shadow-primary-500/20' :
                                                    isCurrent ? 'bg-white border-primary-500 text-primary-600 shadow-lg scale-110' :
                                                        'bg-white border-gray-100 text-gray-300'
                                                }`}>
                                                {isCompleted ? <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" /> :
                                                    index === 0 ? <Package className="w-6 h-6 md:w-8 md:h-8" /> :
                                                        index === 1 ? <Clock className="w-6 h-6 md:w-8 md:h-8" /> :
                                                            index === 2 ? <MapPin className="w-6 h-6 md:w-8 md:h-8" /> :
                                                                <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8" />}
                                            </div>

                                            {/* Content */}
                                            <div className={`pt-3 transition-opacity duration-500 ${isPending ? 'opacity-50 blur-[0.5px]' : 'opacity-100'}`}>
                                                <h4 className={`text-lg md:text-xl font-bold mb-1 ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                                                    }`}>
                                                    {step.label}
                                                </h4>
                                                {step.date && <p className="text-secondary-600 font-medium text-sm">{step.date}</p>}
                                                {isCurrent && (
                                                    <span className="inline-block mt-2 text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded animate-pulse">
                                                        In Progress
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatusTracker;
