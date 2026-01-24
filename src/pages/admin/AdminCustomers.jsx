import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { useDataStore } from '../../hooks/useDataStore';
import { Search, Plus, Edit, Trash2, X, ChevronDown, Check, Ruler, Calendar } from 'lucide-react';

const AdminCustomers = () => {
    const navigate = useNavigate();
    const { customers, partners, actions } = useDataStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        referral: '',
        measurements: {}
    });

    const [customField, setCustomField] = useState({ label: '', value: '' });
    const [isMeasurementOpen, setIsMeasurementOpen] = useState(false);

    const defaultReferrals = ['Instagram', 'Facebook', 'Youtube', 'Friend/Referral', 'Google', 'Other'];
    const standardMeasurements = ['Bust', 'Waist', 'Hip', 'Blouse Length', 'Sleeve Length', 'Arm Hole', 'Shoulder'];

    // Debugging Logs
    console.log('AdminCustomers Rendered');
    console.log('Partners Data:', partners);
    console.log('Customers Data:', customers);

    // Combine default options with dynamic partners
    const referralOptions = [
        ...defaultReferrals,
        ...(Array.isArray(partners) ? partners : []).map(p => `Partner: ${p?.name || 'Unknown'}`)
    ];

    const filteredCustomers = (customers || []).filter(c =>
        (c.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.mobile || '').includes(searchTerm)
    );

    const handleOpenModal = (customer = null) => {
        console.log('handleOpenModal called', customer ? 'Edit Mode' : 'Add Mode');
        if (customer) {
            setEditingCustomer(customer);
            setFormData(customer);
        } else {
            setEditingCustomer(null);
            setFormData({
                name: '',
                mobile: '',
                email: '',
                referral: 'Instagram', // Default fallback
                measurements: {}
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editingCustomer) {
            actions.updateCustomer(editingCustomer.id, formData);
        } else {
            actions.addCustomer(formData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
            actions.deleteCustomer(id);
        }
    };

    const updateMeasurement = (key, value) => {
        setFormData(prev => ({
            ...prev,
            measurements: { ...prev.measurements, [key]: value }
        }));
    };

    const addCustomMeasurement = () => {
        if (customField.label && customField.value) {
            updateMeasurement(customField.label, customField.value);
            setCustomField({ label: '', value: '' });
        }
    };

    const removeMeasurement = (key) => {
        const newMeasurements = { ...formData.measurements };
        delete newMeasurements[key];
        setFormData(prev => ({ ...prev, measurements: newMeasurements }));
    };

    return (
        <AdminLayout>
            <div className="animate-slide-up">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Customers</h1>
                        <p className="text-gray-600">Manage client details and measurements</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Add Customer
                    </button>
                </div>

                {/* Search Bar */}
                <div className="gradient-card mb-6 flex gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search customers by name or mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-12"
                        />
                    </div>
                    {filteredCustomers.length > 0 && (
                        <button
                            onClick={() => {
                                if (window.confirm('CRITICAL WARNING: Are you sure you want to delete ALL customers? This cannot be undone.')) {
                                    actions.deleteAllCustomers();
                                }
                            }}
                            className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl font-medium hover:bg-red-100 transition-colors whitespace-nowrap flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Delete All
                        </button>
                    )}
                </div>

                {/* Customers Table */}
                <div className="gradient-card overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Name</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Contact</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Referral</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Orders</th>
                                <th className="text-right py-4 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <div className="font-semibold text-gray-900">{customer.name}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-sm">
                                                <div className="text-gray-900">{customer.mobile}</div>
                                                <div className="text-gray-500">{customer.email}</div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="badge bg-blue-50 text-blue-700">
                                                {customer.referral}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="font-mono">{customer.totalOrders}</span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => navigate('/admin/orders', { state: { preselectCustomer: customer } })}
                                                    className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                                                    title="Book New Order"
                                                >
                                                    <Calendar className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal(customer)}
                                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(customer.id)}
                                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-gray-500">
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Add/Edit Modal */}
            </div>
            {/* Add/Edit Modal - Moved outside animation container to ensure fixed positioning works */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-2xl font-serif font-bold text-gray-900">
                                {editingCustomer ? 'Edit Customer' : 'New Customer'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                    <input
                                        type="tel"
                                        required
                                        className="input-field"
                                        value={formData.mobile}
                                        onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                                    <input
                                        type="email"
                                        className="input-field"
                                        value={formData.email || ''}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Referral Source</label>
                                    <select
                                        className="input-field"
                                        value={formData.referral || 'Instagram'}
                                        onChange={e => setFormData({ ...formData, referral: e.target.value })}
                                    >
                                        {referralOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Measurements Section */}
                            <div className="border-t border-gray-100 pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <Ruler className="w-5 h-5 text-primary-600" />
                                        Measurements
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setIsMeasurementOpen(!isMeasurementOpen)}
                                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        {isMeasurementOpen ? 'Collapse' : 'Expand'}
                                    </button>
                                </div>

                                <div className={`space-y-4 ${isMeasurementOpen ? 'block' : 'hidden'}`}>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {standardMeasurements.map(label => (
                                            <div key={label}>
                                                <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">{label}</label>
                                                <input
                                                    type="text"
                                                    className="input-field py-2 text-sm"
                                                    placeholder="0.0"
                                                    value={formData.measurements?.[label] || ''}
                                                    onChange={e => updateMeasurement(label, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Custom Measurements */}
                                    <div className="bg-gray-50 p-4 rounded-xl mt-4">
                                        <h4 className="text-sm font-bold text-gray-700 mb-3">Add Custom Measurement</h4>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Label (e.g. Neck Depth)"
                                                className="input-field flex-1 text-sm"
                                                value={customField.label}
                                                onChange={e => setCustomField({ ...customField, label: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Value"
                                                className="input-field w-24 text-sm"
                                                value={customField.value}
                                                onChange={e => setCustomField({ ...customField, value: e.target.value })}
                                            />
                                            <button
                                                type="button"
                                                onClick={addCustomMeasurement}
                                                className="bg-gray-900 text-white px-3 py-2 rounded-lg hover:bg-black transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Display Added Custom Fields */}
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {Object.entries(formData.measurements || {}).map(([key, value]) => {
                                                if (standardMeasurements.includes(key)) return null;
                                                return (
                                                    <span key={key} className="inline-flex items-center gap-2 bg-white border border-gray-200 px-3 py-1 rounded-full text-sm">
                                                        <span className="text-gray-600">{key}:</span>
                                                        <span className="font-semibold">{value}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeMeasurement(key)}
                                                            className="text-red-400 hover:text-red-600"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-primary-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
                                >
                                    Save Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminCustomers;
