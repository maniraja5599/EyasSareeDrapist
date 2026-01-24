import React from 'react';
import { useParams } from 'react-router-dom';
import { CreditCard, Smartphone } from 'lucide-react';

const PaymentPage = () => {
    const { bookingId } = useParams();

    const handleUPIPayment = (app) => {
        alert(`Opening ${app} for payment...`);
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-5xl font-serif font-bold mb-4 text-gradient-primary">
                        Make Payment
                    </h1>
                    <p className="text-xl text-gray-600">Booking ID: {bookingId}</p>
                </div>

                <div className="gradient-card animate-slide-up">
                    <div className="text-center mb-8">
                        <p className="text-4xl font-bold text-gray-900 mb-2">₹500</p>
                        <p className="text-gray-600">Total Amount</p>
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
                        <div className="mt-4 w-48 h-48 bg-white border-2 border-gray-200 rounded-xl mx-auto flex items-center justify-center">
                            <p className="text-gray-400">QR Code Here</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
