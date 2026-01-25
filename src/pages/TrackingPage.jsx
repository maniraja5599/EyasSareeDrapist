import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Clock, Loader2, Search } from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const TrackingPage = () => {
    const { bookingId: urlBookingId } = useParams();
    const [searchTerm, setSearchTerm] = useState(urlBookingId || '');
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(null);
    const [history, setHistory] = useState([]);
    const [settings, setSettings] = useState(null);
    const navigate = useNavigate();

    // Auto-fetch if ID is in URL
    React.useEffect(() => {
        if (urlBookingId) {
            setSearchTerm(urlBookingId);
            performSearch(urlBookingId);
        }
    }, [urlBookingId]);

    const performSearch = async (term) => {
        setLoading(true);
        setBooking(null);
        setHistory([]);

        try {
            // 1. Try fetching as Booking ID first
            const docRef = doc(db, "bookings", term);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setBooking({
                    id: docSnap.id,
                    ...data,
                    slot: data.slotTime || data.slot
                });
            } else {
                // 2. Not a direct ID, try searching by Mobile or Email
                // Note: This requires an index on multiple fields OR multiple queries. 
                // We'll do two parallel queries for simplicity and merge.

                const bookingsRef = collection(db, 'bookings');

                // Query for Mobile
                const mobileQuery = query(
                    bookingsRef,
                    where('customerMobile', '==', term),
                    orderBy('createdAt', 'desc')
                );

                // Query for Email
                const emailQuery = query(
                    bookingsRef,
                    where('customerEmail', '==', term),
                    orderBy('createdAt', 'desc')
                );

                const [mobileSnaps, emailSnaps] = await Promise.all([
                    getDocs(mobileQuery),
                    getDocs(emailQuery)
                ]);

                const foundBookings = new Map();

                mobileSnaps.forEach(doc => {
                    foundBookings.set(doc.id, { id: doc.id, ...doc.data() });
                });

                emailSnaps.forEach(doc => {
                    foundBookings.set(doc.id, { id: doc.id, ...doc.data() });
                });

                const results = Array.from(foundBookings.values())
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                if (results.length === 1) {
                    // If only one, show it directly
                    setBooking(results[0]);
                } else if (results.length > 1) {
                    // If multiple, show history list
                    setHistory(results);
                } else {
                    // If manually triggered (not auto-load)
                    alert('No booking found with that ID, Mobile, or Email.');
                }
            }
        } catch (err) {
            console.error("Error fetching booking:", err);
            // Ignore index errors if they happen during dev, but warn user
            if (err.code === 'failed-precondition') {
                alert("System is updating indexes. Please try searching by ID for now.");
            } else {
                alert("Error searching. Please check your input.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;
        performSearch(searchTerm.trim());
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

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) { return dateString; }
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-5xl font-serif font-bold mb-4 text-gradient-primary">
                        Track Your Order
                    </h1>
                    <p className="text-xl text-gray-600">
                        Enter Booking ID, Mobile Number, or Email
                    </p>
                </div>

                {/* Search Form */}
                <div className="glass-card mb-8 animate-slide-up">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Order ID / Mobile / Email"
                                className="input-field"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!searchTerm || loading}
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

                {/* History List (if multiple results) */}
                {history.length > 0 && !booking && (
                    <div className="animate-slide-up">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Your Booking History</h3>
                        <div className="grid gap-4">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex justify-between items-center group"
                                    onClick={() => setBooking(item)}
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-bold text-lg text-primary-700">#{item.id}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 capitalize`}>
                                                {item.status?.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <p className="text-gray-600">
                                            {item.service} • {item.date} {item.slotTime || item.slot}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="btn-outline text-sm group-hover:bg-primary-50">
                                            View Details
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Single Booking Details (Existing View) */}
                {booking && (
                    <div className="gradient-card animate-scale-in">

                        {/* Back to History if applicable */}
                        {history.length > 0 && (
                            <button
                                onClick={() => setBooking(null)}
                                className="mb-6 text-gray-500 hover:text-primary-600 flex items-center gap-2 text-sm font-medium"
                            >
                                ← Back to History
                            </button>
                        )}

                        {/* Booking Info */}
                        <div className="mb-8 pb-8 border-b border-gray-200">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Booking ID</p>
                                    <p className="font-bold text-lg">{booking.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Scheduled</p>
                                    <p className="font-bold text-lg">{booking.date} at {booking.slotTime || booking.slot}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Customer Details</p>
                                    <p className="font-bold text-lg">{booking.customerName}</p>
                                    <p className="text-gray-600">{booking.customerMobile}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Service & Address</p>
                                    <p className="font-bold text-lg">{booking.service}</p>
                                    {booking.address && <p className="text-sm text-gray-600 mt-1">{booking.address}</p>}
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

                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                                        {(() => {
                                            const upiId = settings?.upiId || 'eyas@upi';
                                            const name = encodeURIComponent(settings?.companyName || 'Eyas');
                                            const note = encodeURIComponent(`Order ${booking.id}`);
                                            // Exact legacy format as suggested by user with cu=INR
                                            const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&am=${booking.amount}&cu=INR&tn=${note}`;
                                            return (
                                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(upiUrl)}`} alt="Payment QR" className="w-32 h-32" />
                                            );
                                        })()}
                                    </div>
                                    <div className="text-center md:text-left">
                                        <p className="font-bold text-xl mb-2">Amount to Pay: ₹{booking.amount}</p>
                                        <p className="text-sm text-gray-600 mb-4">Scan to pay instantly</p>
                                        <button
                                            onClick={() => navigate(`/pay/${booking.id}`)}
                                            className="btn-primary"
                                        >
                                            View Payment Options
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackingPage;
