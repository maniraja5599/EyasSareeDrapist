import React, { forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { useDataStore } from '../hooks/useDataStore';

const InvoiceTemplate = forwardRef(({ order, customer }, ref) => {
    // Get shop settings from global store
    const { shopSettings } = useDataStore();

    if (!order || !customer) return null;

    const total = Number(order.amount || 0);

    // UPI String Generation
    // Format: upi://pay?pa=UPI_ID&pn=MERCHANT_NAME&am=AMOUNT&cu=INR
    const upiString = `upi://pay?pa=${shopSettings.upiId}&pn=${encodeURIComponent(shopSettings.companyName)}&am=${total}&cu=INR`;

    return (
        <div ref={ref} className="bg-white p-8 max-w-[210mm] mx-auto text-gray-900 font-sans" style={{ minHeight: '297mm' }}>
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-gray-900 pb-8 mb-8">
                <div className="flex gap-4">
                    {/* Logo Section */}
                    <img
                        src={`${import.meta.env.BASE_URL}images/logo.png`}
                        alt="Logo"
                        className="w-24 h-24 object-contain rounded-xl border border-gray-100"
                    />
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight mb-2 text-primary-900">{shopSettings.companyName}</h1>
                        <p className="text-gray-600 whitespace-pre-line text-sm">{shopSettings.address}</p>
                        <p className="text-gray-600 text-sm mt-1">Mobile: {shopSettings.contactMobile}</p>
                        {shopSettings.whatsapp && (
                            <p className="text-gray-600 text-sm">WhatsApp: {shopSettings.whatsapp}</p>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-4xl font-bold text-gray-200 mb-4 tracking-widest">INVOICE</h2>
                    <div className="mb-2">
                        <span className="block text-xs uppercase tracking-wide text-gray-500">Invoice No</span>
                        <span className="text-xl font-bold font-mono text-gray-900">#{order.id.replace('ORD-', 'INV-')}</span>
                    </div>
                    <div>
                        <span className="block text-xs uppercase tracking-wide text-gray-500">Date</span>
                        <span className="font-medium text-gray-900">{new Date(order.date).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'long', year: 'numeric'
                        })}</span>
                    </div>
                </div>
            </div>

            {/* Bill To */}
            <div className="mb-12 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <span className="block text-xs uppercase tracking-wide text-gray-500 mb-2 font-bold">Bill To</span>
                <h2 className="text-xl font-bold mb-1 text-gray-900">{customer.name}</h2>
                <p className="text-gray-600">{customer.mobile}</p>
                {customer.email && <p className="text-gray-600">{customer.email}</p>}
            </div>

            {/* Line Items */}
            <div className="mb-12">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-900">
                            <th className="text-left py-3 font-bold text-gray-900 w-1/2">Service Description</th>
                            <th className="text-right py-3 font-bold text-gray-900">Qty</th>
                            <th className="text-right py-3 font-bold text-gray-900">Rate</th>
                            <th className="text-right py-3 font-bold text-gray-900">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-100">
                            <td className="py-4">
                                <p className="font-bold text-lg text-gray-800">{order.service}</p>
                                <p className="text-gray-500 text-sm mt-1">Appointment Slot: {order.slotTime}</p>
                            </td>
                            <td className="py-4 text-right text-gray-600">1</td>
                            <td className="py-4 text-right text-gray-600">₹{total}</td>
                            <td className="py-4 text-right font-bold text-gray-900">₹{total}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Totals & Payment */}
            <div className="flex justify-between items-end mb-12">
                {/* QR Code Section */}
                <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center gap-4 shadow-sm">
                    <QRCodeCanvas
                        value={upiString}
                        size={100}
                        level={"H"}
                        includeMargin={true}
                    />
                    <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Scan to Pay via UPI</p>
                        <p className="text-xs text-gray-500">GPay, PhonePe, Paytm</p>
                        <p className="text-xs font-mono bg-gray-100 px-2 py-1 rounded mt-2">{shopSettings.upiId}</p>
                    </div>
                </div>

                <div className="w-1/3">
                    <div className="flex justify-between py-3 border-b border-gray-100 text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{total}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b-2 border-gray-900 text-gray-900">
                        <span className="text-2xl font-bold">Total</span>
                        <span className="text-2xl font-bold">₹{total}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-auto pt-8 border-t border-gray-100">
                <p className="text-gray-900 font-bold mb-2">Thank you for choosing {shopSettings.companyName}!</p>

                {shopSettings.instagram && (
                    <p className="text-sm text-purple-600 font-medium mb-1">
                        Follow us on Instagram: @{shopSettings.instagram}
                    </p>
                )}

                <p className="text-xs text-gray-400 mt-6">
                    This is a computer-generated invoice and does not require a signature.
                </p>
            </div>
        </div>
    );
});

export default InvoiceTemplate;
