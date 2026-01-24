import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useDataStore } from '../../hooks/useDataStore';
import { Database, Save, RotateCcw, AlertCircle, CheckCircle, Info } from 'lucide-react';

const AdminSettings = () => {
    const { shopSettings, webpageSettings, actions } = useDataStore();
    const [formData, setFormData] = useState(shopSettings);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Sync form data if store updates (e.g. initial load)
    useEffect(() => {
        setFormData(shopSettings);
    }, [shopSettings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        actions.updateSettings(formData);
        setMessage({ type: 'success', text: 'Shop settings updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleClearData = () => {
        if (window.confirm('WARNING: This will delete ALL customers and orders. This action cannot be undone. Are you sure?')) {
            localStorage.removeItem('eyas_customers');
            localStorage.removeItem('eyas_orders');
            // We do NOT clear settings or partners intentionally so config remains
            window.location.reload();
        }
    };

    return (
        <AdminLayout>
            <div className="animate-slide-up max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Settings</h1>
                    <p className="text-gray-600">Configure your shop details and manage data.</p>
                </div>

                {message.text && (
                    <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                {/* Shop Configuration */}
                <form onSubmit={handleSave} className="gradient-card mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Shop Configuration (Invoice Details)</h3>
                        <button type="submit" className="btn-primary flex items-center gap-2">
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="label">Company Name</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="label">Contact Mobile</label>
                            <input
                                type="text"
                                name="contactMobile"
                                value={formData.contactMobile}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="label">Instagram Link / Handle</label>
                            <input
                                type="text"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g. eyassareedrapist"
                            />
                        </div>
                        <div>
                            <label className="label">UPI ID (for QR Code)</label>
                            <input
                                type="text"
                                name="upiId"
                                value={formData.upiId}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="e.g. mobile@upi"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Full Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="input-field"
                                rows="3"
                            />
                        </div>
                    </div>
                </form>

                {/* Booking Page Configuration */}
                <div className="gradient-card mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Booking Page Configuration</h3>
                        <button
                            onClick={() => {
                                actions.updateWebpageSettings(webpageSettings); // Force save if needed, although state is sync
                                setMessage({ type: 'success', text: 'Webpage settings saved!' });
                                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                            }}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="label">Page Title</label>
                                <input
                                    type="text"
                                    value={webpageSettings?.bookingTitle || ''}
                                    onChange={(e) => actions.updateWebpageSettings({ bookingTitle: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="label">Page Subtitle</label>
                                <input
                                    type="text"
                                    value={webpageSettings?.bookingSubtitle || ''}
                                    onChange={(e) => actions.updateWebpageSettings({ bookingSubtitle: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label mb-2 block">Services & Pricing</label>
                            <div className="overflow-x-auto border border-gray-200 rounded-xl">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Service Name</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Price (₹)</th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-700">Duration Label</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {(webpageSettings?.services || []).map((service, index) => (
                                            <tr key={service.id || index}>
                                                <td className="px-4 py-3 font-medium text-gray-900">{service.name}</td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        value={service.price}
                                                        onChange={(e) => {
                                                            const newServices = webpageSettings.services.map((s, i) =>
                                                                i === index ? { ...s, price: e.target.value } : s
                                                            );
                                                            actions.updateWebpageSettings({ services: newServices });
                                                        }}
                                                        className="input-field py-1 h-8 w-24"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={service.duration}
                                                        onChange={(e) => {
                                                            const newServices = webpageSettings.services.map((s, i) =>
                                                                i === index ? { ...s, duration: e.target.value } : s
                                                            );
                                                            actions.updateWebpageSettings({ services: newServices });
                                                        }}
                                                        className="input-field py-1 h-8"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Management */}
                <div className="gradient-card border border-red-100">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <Database className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Data Reset</h3>
                            <p className="text-sm text-gray-600">Danger Zone: Manage application data</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-sm text-gray-600 mb-4">
                            If you want to start fresh, you can clear all customers and orders.
                            This will revert the app to its initial state with sample data.
                        </p>
                        <button
                            type="button"
                            onClick={handleClearData}
                            className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" /> Reset All Data
                        </button>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-4">
                        <p className="text-sm text-gray-600 mb-4">
                            Need test data? Click below to add 25 sample customers instantly.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                actions.seedDummyCustomers();
                                setMessage({ type: 'success', text: '25 Sample Customers Added!' });
                                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                            }}
                            className="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 rounded-xl font-medium hover:bg-purple-100 transition-colors flex items-center gap-2"
                        >
                            <Database className="w-4 h-4" /> Add 25 Sample Customers
                        </button>
                    </div>
                </div>
            </div >
        </AdminLayout >
    );
};

export default AdminSettings;
