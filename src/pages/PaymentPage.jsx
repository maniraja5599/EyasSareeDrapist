import React from 'react';
import { useParams } from 'react-router-dom';
import { CreditCard, Smartphone } from 'lucide-react';

const PaymentPage = () => {
    const { bookingId } = useParams();
    const [order, setOrder] = React.useState(null);
    const [settings, setSettings] = React.useState(null);

    React.useEffect(() => {
        // Fetch Order
        const savedOrders = localStorage.getItem('eyas_orders');
        if (savedOrders) {
            const orders = JSON.parse(savedOrders);
            const found = orders.find(o => o.id === bookingId);
            if (found) setOrder(found);
        }

        // Fetch Settings
        const savedSettings = localStorage.getItem('eyas_shop_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, [bookingId]);

    const handleUPIPayment = (app) => {
        const upiId = settings?.upiId || 'eyas@upi';
        const name = settings?.companyName || 'Eyas Saree Drapist';
        const amount = order?.amount || 0;

        // This is a simulation. In a real app, you would use deep links:
        // upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR

        alert(`Initiating payment...
        App: ${app}
        Pay to: ${name} (${upiId})
        Amount: ₹${amount}`);
    };

    if (!order) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-5xl font-serif font-bold mb-4 text-gradient-primary">
                        {settings?.companyName || 'Make Payment'}
                    </h1>
                    <p className="text-xl text-gray-600">Booking ID: {bookingId}</p>
                    {settings?.contactMobile && (
                        <p className="text-sm text-gray-400 mt-2">Support: {settings.contactMobile}</p>
                    )}
                </div>

                <div className="gradient-card animate-slide-up">
                    <div className="text-center mb-8">
                        <p className="text-4xl font-bold text-gray-900 mb-2">₹{order.amount}</p>
                        <p className="text-gray-600">Total Amount for {order.service}</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => handleUPIPayment('Google Pay')}
                            className="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-primary-500 hover:shadow-lg transition-all duration-300 flex items-center gap-4"
                        >
                            <Smartphone className="w-6 h-6 text-primary-600" />
                            <span className="font-semibold">Pay with Google Pay</span>
                        </button>

                        <button
                            onClick={() => handleUPIPayment('PhonePe')}
                            className="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-primary-500 hover:shadow-lg transition-all duration-300 flex items-center gap-4"
                        >
                            <Smartphone className="w-6 h-6 text-primary-600" />
                            <span className="font-semibold">Pay with PhonePe</span>
                        </button>

                        <button
                            onClick={() => handleUPIPayment('Paytm')}
                            className="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-primary-500 hover:shadow-lg transition-all duration-300 flex items-center gap-4"
                        >
                            <CreditCard className="w-6 h-6 text-primary-600" />
                            <span className="font-semibold">Pay with Paytm</span>
                        </button>
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600 text-center">
                            Or scan QR code to pay via any UPI app
                        </p>
                        <div className="mt-4 w-48 h-48 bg-white border-2 border-gray-200 rounded-xl mx-auto flex items-center justify-center flex-col gap-2">
                            {(() => {
                                const upiId = settings?.upiId || 'eyas@upi';
                                const name = encodeURIComponent(settings?.companyName || 'Eyas');
                                const note = encodeURIComponent(`Order ${bookingId}`);
                                // Exact legacy format as suggested by user with cu=INR
                                const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&am=${order.amount}&cu=INR&tn=${note}`;
                                return (
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(upiUrl)}`} alt="Payment QR" className="opacity-80" />
                                );
                            })()}
                        </div>
                        <p className="text-xs text-center text-gray-400 mt-2">{settings?.upiId || 'eyas@upi'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
