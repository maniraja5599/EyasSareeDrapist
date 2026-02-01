import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Clock, Loader2, Search, ArrowRight, MapPin } from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useDataStore } from '../hooks/useDataStore';
import { useScrollRestoration } from '../hooks/useScrollRestoration';
import { usePersistedState } from '../hooks/usePersistedState';

const TrackingPage = () => {
    const { bookingId: urlBookingId } = useParams();

    // Use persisted state for search term
    const [searchTerm, setSearchTerm] = usePersistedState(
        'tracking_search_term',
        urlBookingId || ''
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [booking, setBooking] = useState(null);
    const [history, setHistory] = useState([]);
    const { shopSettings } = useDataStore();
    const navigate = useNavigate();
    const { user, loginWithGoogle } = useAuth();

    // Enable scroll position restoration
    useScrollRestoration();

    // Auto-fetch if ID is in URL
    React.useEffect(() => {
        if (urlBookingId) {
            setSearchTerm(urlBookingId);
            performSearch(urlBookingId);
        }
    }, [urlBookingId]);

    // Auto-fetch orders for logged-in users
    React.useEffect(() => {
        if (user && user.email && !urlBookingId) {
            // Automatically load user's orders based on their email
            performSearch(user.email);
        }
    }, [user, urlBookingId]);

    const performSearch = async (term) => {
        setLoading(true);
        setError(''); // reset error from previous attempts

        try {
            // 1. Try fetching as Booking ID first (e.g. EYS-1234)
            const docRef = doc(db, "bookings", term);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const foundBooking = {
                    id: docSnap.id,
                    ...data,
                    slot: data.slotTime || data.slot
                };
                setBooking(foundBooking);

                // Fetch full history for this customer automatically
                if (foundBooking.customerMobile || foundBooking.customerEmail) {
                    const bookingsRef = collection(db, 'bookings');
                    const queries = [];
                    if (foundBooking.customerMobile) {
                        queries.push(getDocs(query(bookingsRef, where('customerMobile', '==', foundBooking.customerMobile))));
                    }
                    if (foundBooking.customerEmail) {
                        queries.push(getDocs(query(bookingsRef, where('customerEmail', '==', foundBooking.customerEmail))));
                    }

                    const results = await Promise.all(queries);
                    const historyMap = new Map();
                    results.forEach(snap => {
                        snap.forEach(doc => {
                            historyMap.set(doc.id, { id: doc.id, ...doc.data() });
                        });
                    });

                    const historyList = Array.from(historyMap.values())
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    setHistory(historyList);
                }
            } else {
                // 2. Not a direct ID, try searching by Mobile or Email
                const bookingsRef = collection(db, 'bookings');

                // Query for Mobile & Email in parallel
                const [mobileSnaps, emailSnaps] = await Promise.all([
                    getDocs(query(bookingsRef, where('customerMobile', '==', term))),
                    getDocs(query(bookingsRef, where('customerEmail', '==', term)))
                ]);

                const foundBookings = new Map();
                mobileSnaps.forEach(doc => foundBookings.set(doc.id, { id: doc.id, ...doc.data() }));
                emailSnaps.forEach(doc => foundBookings.set(doc.id, { id: doc.id, ...doc.data() }));

                const results = Array.from(foundBookings.values())
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                if (results.length > 0) {
                    setHistory(results);
                    // If only one result, show it directly as active track too
                    if (results.length === 1) {
                        setBooking(results[0]);
                    }
                } else {
                    setError('No active bookings found for this ID/Mobile/Email.');
                }
            }
        } catch (err) {
            console.error("Search failed:", err);
            setError('Something went wrong. Please try again later.');
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
        <div className="min-h-screen bg-black text-white py-12 px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-600/5 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-primary-200 via-primary-400 to-primary-600">
                        {user ? `Hello ${user.displayName?.split(' ')[0] || 'Dear'}!` : 'Track Your Style'}
                    </h1>
                    <p className="text-base sm:text-lg text-gray-400 font-light tracking-wide">
                        {user
                            ? 'Your journey of elegance is tracked below'
                            : 'Experience professional care with every pleat'}
                    </p>
                </div>

                {/* Login Prompt for Unauthenticated Users */}
                {!user && (
                    <div className="max-w-md mx-auto mb-8 animate-fade-in">
                        <button
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    setError('');
                                    await loginWithGoogle();
                                    // Navigation happens automatically via AuthContext or useEffect
                                } catch (error) {
                                    console.error("Google Login Error:", error);
                                    setError("Sign-in failed. Please try again or use manual tracking.");
                                    setLoading(false);
                                }
                            }}
                            className="w-full bg-white text-gray-900 border border-gray-300 font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:bg-gray-50 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-3 group mb-6"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                            <span className="text-lg">Sign in to View My Orders</span>
                        </button>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-700"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">Or Track Manually</span>
                            <div className="flex-grow border-t border-gray-700"></div>
                        </div>
                    </div>
                )}

                {/* Search Form */}
                <div className="glass-card mb-8 animate-slide-up bg-zinc-900/50 border-white/5 backdrop-blur-xl rounded-3xl p-1 bg-gradient-to-r from-primary-500/10 to-transparent">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500/50" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Order ID / Mobile / Email"
                                className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-gray-600"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!searchTerm || loading}
                            className="bg-primary-600 text-black px-10 py-5 rounded-2xl font-bold hover:bg-white transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3 overflow-hidden group relative"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span className="relative z-10">Locate Order</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                                </>
                            )}
                            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        </button>
                    </form>
                </div>

                {/* Content Section */}
                <div className="space-y-12">
                    {/* Active Booking Details */}
                    {booking && (
                        <div className="gradient-card animate-scale-in">
                            {/* Back to History if applicable - only show if there ARE other items */}
                            {history.length > 1 && (
                                <button
                                    onClick={() => setBooking(null)}
                                    className="mb-6 text-gray-500 hover:text-primary-600 flex items-center gap-2 text-sm font-medium"
                                >
                                    ← Clear Selection
                                </button>
                            )}

                            {/* Booking Info */}
                            <div className="mb-12 p-8 bg-zinc-900/40 rounded-[2rem] border border-white/5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Booking Reference</p>
                                        <p className="text-xl font-mono font-bold text-primary-400 tracking-tighter">{booking.id}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Appointment</p>
                                        <p className="text-lg font-bold text-white">{booking.date}</p>
                                        <p className="text-xs text-primary-500 font-bold uppercase">{booking.slotTime || booking.slot}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Customer</p>
                                        <p className="text-lg font-bold text-white truncate">{booking.customerName}</p>
                                        <p className="text-xs text-gray-400 font-mono tracking-wider">{booking.customerMobile}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Service Selected</p>
                                        <p className="text-lg font-bold text-white truncate">{booking.service}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Location</p>
                                        <a
                                            href={booking.location?.lat && booking.location?.lng
                                                ? `https://www.google.com/maps/search/?api=1&query=${booking.location.lat},${booking.location.lng}`
                                                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-bold text-primary-400 hover:text-primary-300 flex items-center gap-1"
                                        >
                                            <MapPin className="w-4 h-4" />
                                            View on Map
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="space-y-6 bg-black/40 rounded-3xl p-6 sm:p-10 border border-white/5">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="h-0.5 w-10 bg-primary-500"></div>
                                    <h3 className="text-xl font-serif font-bold text-white tracking-widest uppercase">Live Status</h3>
                                </div>

                                <div className="space-y-0">
                                    {statuses.map((status, index) => {
                                        const Icon = status.icon;
                                        const isActive = index <= getCurrentStep();
                                        const isCurrent = index === getCurrentStep();

                                        return (
                                            <div key={status.id} className="flex gap-6 relative group">
                                                {index < statuses.length - 1 && (
                                                    <div className={`absolute left-[23px] top-12 bottom-0 w-1 transition-all duration-700 ${isActive ? 'bg-primary-500 shadow-[0_0_10px_rgba(212,175,55,0.3)]' : 'bg-white/5'
                                                        }`} />
                                                )}

                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-700 relative z-10 ${isActive
                                                    ? 'bg-primary-500 text-black shadow-xl shadow-primary-500/20 rotate-3 group-hover:rotate-0'
                                                    : 'bg-zinc-900 text-gray-700 border border-white/5'
                                                    }`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>

                                                <div className="flex-1 pb-12 transition-colors duration-500">
                                                    <h4 className={`font-bold text-xl mb-1 ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                                        {status.label}
                                                    </h4>
                                                    {isCurrent && (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                                                            <p className="text-sm text-primary-400 font-bold uppercase tracking-widest">In Motion</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {booking.status === 'ready' && (
                                <div className="mt-8 p-8 bg-gradient-to-br from-primary-900/40 via-zinc-900 to-black rounded-[2rem] border border-primary-500/30 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary-500/20 transition-all"></div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 text-primary-400 mb-4">
                                            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                                            <span className="text-sm font-bold uppercase tracking-[0.2em]">Ready for Pickup</span>
                                        </div>

                                        <h4 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-6">
                                            Your Saree is <span className="text-primary-400 italic">Flawless</span> & Waiting
                                        </h4>

                                        <div className="flex flex-col md:flex-row items-center gap-10">
                                            <div className="relative">
                                                <div className="absolute -inset-4 bg-primary-500/10 rounded-2xl blur-xl group-hover:bg-primary-500/20 transition-all"></div>
                                                <div className="relative bg-white p-3 rounded-2xl shadow-2xl">
                                                    {(() => {
                                                        const upiId = shopSettings?.upiId || '7502551633@ybl';
                                                        const name = encodeURIComponent(shopSettings?.companyName || 'Eyas');
                                                        const note = encodeURIComponent(`Order ${booking.id}`);
                                                        const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&am=${booking.amount}&cu=INR&tn=${note}`;
                                                        return (
                                                            <img
                                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiUrl)}`}
                                                                alt="Payment QR"
                                                                className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
                                                            />
                                                        );
                                                    })()}
                                                </div>
                                                <p className="text-[10px] text-center text-gray-500 mt-2 font-mono uppercase tracking-widest">Scan to Pay Instantly</p>
                                            </div>

                                            <div className="flex-1 space-y-6 text-center md:text-left">
                                                <div>
                                                    <p className="text-gray-400 text-sm uppercase tracking-widest mb-1">Amount to Pay</p>
                                                    <p className="text-4xl font-bold text-white">₹{booking.amount}</p>
                                                </div>

                                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                                    <button
                                                        onClick={() => navigate(`/pay/${booking.id}`)}
                                                        className="px-8 py-3 bg-primary-500 text-black rounded-full font-bold hover:bg-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                                                    >
                                                        Pay Now
                                                    </button>
                                                    <a
                                                        href={`https://wa.me/91${shopSettings?.whatsapp || '7502551633'}?text=Hi, I am inquiring about my ready order ${booking.id}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="px-8 py-3 bg-zinc-800 text-white rounded-full font-bold border border-white/10 hover:bg-zinc-700 transition-all flex items-center gap-2"
                                                    >
                                                        <span className="w-5 h-5 flex items-center justify-center bg-green-500 rounded-full">
                                                            <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.479 5.228 3.479 8.404c0 6.557-5.332 11.89-11.888 11.89-2.015 0-3.991-.511-5.741-1.48L0 24.057zm6.136-4.39l.413.245c1.554.922 3.329 1.41 5.163 1.41 5.419 0 9.83-4.412 9.83-9.831 0-2.624-1.022-5.09-2.879-6.948-1.856-1.857-4.323-2.879-6.948-2.879-5.42 0-9.831 4.412-9.831 9.83 0 1.898.531 3.747 1.54 5.352l.277.44-1.01 3.692 3.791-1.01zM17.3 14.77c-.244-.122-1.453-.717-1.68-.8-.225-.081-.389-.122-.553.122s-.634.8-.777.962c-.143.165-.285.185-.529.063-.244-.122-1.03-.38-1.961-1.21-.724-.645-1.213-1.442-1.355-1.686-.143-.244-.015-.376.107-.497.111-.109.244-.285.367-.428.122-.143.163-.244.244-.407.081-.163.04-.306-.02-.428-.06-.122-.553-1.332-.757-1.826-.201-.486-.407-.42-.553-.427h-.47c-.163 0-.427.061-.652.306-.225.244-.858.838-.858 2.043 0 1.205.879 2.368 1.001 2.531.122.163 1.731 2.642 4.191 3.706.585.254 1.042.405 1.397.518.588.187 1.123.16 1.545.097.47-.071 1.453-.593 1.657-1.165.204-.572.204-1.062.143-1.164-.061-.102-.224-.163-.468-.285z" /></svg>
                                                        </span>
                                                        WhatsApp Stylist
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* History List */}
                    {history.length > 0 && (
                        <div className="animate-slide-up pt-8 border-t border-white/10">
                            <h3 className="text-2xl font-serif font-bold mb-8 text-white flex items-center gap-3">
                                <Clock className="w-6 h-6 text-primary-500" />
                                Your Orders
                            </h3>
                            <div className="space-y-4">
                                {history.map((item) => {
                                    const isReady = item.status === 'ready';
                                    const isCompleted = item.status === 'completed';
                                    const isSelected = booking?.id === item.id;

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                setBooking(item);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={`group p-4 md:p-5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 ${isSelected
                                                ? 'bg-primary-900/20 border-primary-500/50 shadow-xl shadow-primary-900/10'
                                                : 'bg-zinc-900/40 border-white/5 hover:border-primary-500/30 hover:bg-zinc-900/60'
                                                }`}
                                        >
                                            {/* Selection Indicator */}
                                            {isSelected && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>
                                            )}

                                            {/* Left Section: ID & Service */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h4 className="text-lg font-mono font-bold text-white group-hover:text-primary-400 transition-colors">
                                                        #{item.id}
                                                    </h4>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${isReady
                                                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                                        : isCompleted
                                                            ? 'bg-gray-700/50 text-gray-400 border-gray-600/30'
                                                            : 'bg-primary-500/10 text-primary-400 border-primary-500/20'
                                                        }`}>
                                                        {item.status || 'Booked'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
                                                    <span className="truncate max-w-[200px]" title={item.service}>{item.service || 'Saree Draping'}</span>
                                                    <span className="text-gray-700">•</span>
                                                    <span className="text-gray-300">{item.date || 'Date Pending'}</span>
                                                    <span className="text-gray-700">•</span>
                                                    <span>{item.slotTime || item.slot || '--:--'}</span>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="flex items-center gap-4 shrink-0">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setBooking(item);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    className={`w-full md:w-auto px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isSelected
                                                        ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20'
                                                        : 'bg-white/5 text-white hover:bg-white hover:text-black'
                                                        }`}
                                                >
                                                    {isSelected ? (
                                                        <>
                                                            <Search className="w-4 h-4" />
                                                            Tracking
                                                        </>
                                                    ) : (
                                                        <>
                                                            View Details
                                                            <ArrowRight className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </button>
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

export default TrackingPage;
