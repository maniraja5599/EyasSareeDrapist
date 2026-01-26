import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, ArrowLeft, Loader2, IndianRupee } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useDataStore } from '../hooks/useDataStore';

const PaymentPage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { shopSettings } = useDataStore();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('online'); // online, advance, cash

    useEffect(() => {
        const fetchOrder = async () => {
            if (!bookingId) return;
            try {
                const docRef = doc(db, 'bookings', bookingId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const orderData = { id: docSnap.id, ...docSnap.data() };
                    setOrder(orderData);
                    setPaymentMethod(orderData.paymentMethod || 'online');
                }
            } catch (error) {
                console.error("Error fetching order for payment:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [bookingId]);

    const handlePaymentMethodChange = async (method) => {
        setPaymentMethod(method);

        // Update booking document
        try {
            const docRef = doc(db, 'bookings', bookingId);
            await updateDoc(docRef, {
                paymentMethod: method
            });

            setOrder(prev => ({ ...prev, paymentMethod: method }));

            // If changed to cash, redirect to tracking
            if (method === 'cash') {
                setTimeout(() => {
                    navigate(`/track/${bookingId}`);
                }, 1000);
            }
        } catch (error) {
            console.error("Error updating payment method:", error);
        }
    };

    // Scroll to top on mount
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleUPIPayment = () => {
        const upiId = shopSettings?.upiId || '7502551633@ybl';
        const amount = order?.amount || 0;
        const note = encodeURIComponent(`Order-${bookingId}`);

        // Simplified UPI Deep Link - removed pn (payee name) to avoid fraud detection
        // Format: upi://pay?pa=UPI_ID&am=AMOUNT&cu=INR&tn=NOTE
        const upiUrl = `upi://pay?pa=${upiId}&am=${amount}&cu=INR&tn=${note}`;

        console.log('[PAYMENT] UPI Link:', upiUrl);

        // Redirect to UPI app
        window.location.href = upiUrl;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                <p className="text-xl font-serif">Securing payment gateway...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4 text-center">
                <h2 className="text-3xl font-serif font-bold text-primary-400 mb-4">Order Not Found</h2>
                <p className="text-gray-400 mb-8">We couldn't find the booking details for ID: {bookingId}</p>
                <button onClick={() => navigate('/track')} className="btn-primary">
                    Back to Tracking
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-12 animate-fade-in">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>
                    <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-primary-500">
                        Complete Payment
                    </h1>
                    <div className="flex items-center gap-3 text-gray-400">
                        <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10 text-xs font-mono uppercase tracking-wider">
                            ID: {bookingId}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                        <p className="text-sm">{order.service}</p>
                    </div>
                </div>

                {/* Payment Method Switcher */}
                <div className="mb-8 bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-white/5 p-2">
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => handlePaymentMethodChange('online')}
                            className={`py-3 px-4 rounded-2xl font-bold text-sm transition-all ${paymentMethod === 'online'
                                ? 'bg-primary-600 text-black shadow-lg'
                                : 'bg-transparent text-gray-400 hover:bg-white/5'
                                }`}
                        >
                            💳 Pay Now
                        </button>
                        <button
                            onClick={() => handlePaymentMethodChange('advance')}
                            className={`py-3 px-4 rounded-2xl font-bold text-sm transition-all ${paymentMethod === 'advance'
                                ? 'bg-primary-600 text-black shadow-lg'
                                : 'bg-transparent text-gray-400 hover:bg-white/5'
                                }`}
                        >
                            📊 Advance
                        </button>
                        <button
                            onClick={() => handlePaymentMethodChange('cash')}
                            className={`py-3 px-4 rounded-2xl font-bold text-sm transition-all ${paymentMethod === 'cash'
                                ? 'bg-primary-600 text-black shadow-lg'
                                : 'bg-transparent text-gray-400 hover:bg-white/5'
                                }`}
                        >
                            💵 COD
                        </button>
                    </div>

                    {/* Cash on Delivery Message */}
                    {paymentMethod === 'cash' && (
                        <div className="mt-4 p-4 bg-black/60 rounded-2xl border border-white/5 text-center">
                            <p className="text-gray-400 text-sm">
                                ✅ Payment method changed to Cash on Delivery
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Redirecting to tracking page...
                            </p>
                        </div>
                    )}
                </div>

                <div className="gradient-card border-primary-500/20 bg-zinc-900/50 backdrop-blur-xl animate-slide-up">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-900/20 border border-primary-500/30 mb-4">
                            <IndianRupee className="w-8 h-8 sm:w-10 sm:h-10 text-primary-400" />
                        </div>
                        <p className="text-3xl sm:text-5xl font-bold text-white mb-2 tracking-tight">₹{order.amount}</p>
                        <p className="text-gray-400 uppercase tracking-widest text-xs font-semibold">Total Amount Due</p>
                    </div>

                    {/* Separate Payment Buttons */}
                    <div className="space-y-4 mb-8">
                        {/* Google Pay */}
                        <button
                            onClick={handleUPIPayment}
                            className="w-full p-5 bg-white/5 border-2 border-white/10 rounded-2xl hover:border-primary-500/50 hover:bg-white/10 transition-all duration-300 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-white font-black text-lg">G</span>
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-white text-left">Google Pay</p>
                                    <p className="text-xs text-gray-400">Fast & Secure UPI Payment</p>
                                </div>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>

                        {/* PhonePe */}
                        <button
                            onClick={handleUPIPayment}
                            className="w-full p-5 bg-white/5 border-2 border-white/10 rounded-2xl hover:border-primary-500/50 hover:bg-white/10 transition-all duration-300 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <span className="text-white font-black text-lg">₹</span>
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-white text-left">PhonePe</p>
                                    <p className="text-xs text-gray-400">Pay via PhonePe UPI</p>
                                </div>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>

                        {/* Other UPI Apps */}
                        <button
                            onClick={handleUPIPayment}
                            className="w-full p-5 bg-white/5 border-2 border-white/10 rounded-2xl hover:border-primary-500/50 hover:bg-white/10 transition-all duration-300 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3 7h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-white text-left">Other UPI Apps</p>
                                    <p className="text-xs text-gray-400">Paytm, BHIM & More</p>
                                </div>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    </div>

                    <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                        <p className="text-xs text-gray-400 text-center uppercase tracking-widest mb-6">
                            Secure QR Payment
                        </p>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary-500/10 rounded-[2.5rem] blur-2xl group-hover:bg-primary-500/20 transition-all"></div>
                            <div className="relative w-48 h-48 bg-white p-4 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                                {(() => {
                                    const upiId = shopSettings?.upiId || 'eyas@upi';
                                    const name = encodeURIComponent(shopSettings?.companyName || 'Eyas');
                                    const note = encodeURIComponent(`Order ${bookingId}`);
                                    const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&am=${order.amount}&cu=INR&tn=${note}`;
                                    return (
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`}
                                            alt="Payment QR"
                                            className="w-full h-full object-contain"
                                        />
                                    );
                                })()}
                            </div>
                        </div>
                        <p className="text-sm font-mono text-center text-primary-400 mt-6 tracking-wider">{shopSettings?.upiId || 'eyas@upi'}</p>
                    </div>

                    <div className="mt-8 text-center text-gray-500 text-xs">
                        <p>Payments are 100% secure. You will be redirected to your UPI app.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;

