import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import AdminLayout from '../../components/AdminLayout';
import { useDataStore } from '../../hooks/useDataStore';
import { openWhatsApp, generateReadyMessage } from '../../utils/whatsapp';
import { formatDate } from '../../utils/helpers';
import InvoiceTemplate from '../../components/InvoiceTemplate';
import { Search, Filter, Eye, MessageCircle, Edit, Trash2, CheckSquare, Square, X, Calendar, Printer, MapPin } from 'lucide-react';

const AdminOrders = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orders, customers, actions } = useDataStore();

    // ... New Order State ...
    const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
    const [newOrderData, setNewOrderData] = useState({
        customerId: '',
        customerName: '',
        customerMobile: '',
        service: 'Saree Draping',
        amount: 300,
        date: new Date().toISOString().split('T')[0],
        slotTime: '10:00 AM',
        status: 'booked',
        sareeCount: 1,
        address: ''
    });
    const [customerSearch, setCustomerSearch] = useState('');
    const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);

    // Effect: Check for pre-selected customer from AdminCustomers
    useEffect(() => {
        if (location.state?.preselectCustomer) {
            const customer = location.state.preselectCustomer;
            selectCustomer(customer);
            setIsNewOrderModalOpen(true);
            // Clear state to prevent reopening on refresh
            window.history.replaceState({}, document.title);
        } else if (location.state?.openNewOrder) {
            setIsNewOrderModalOpen(true);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Bulk Selection State
    const [selectedOrders, setSelectedOrders] = useState([]);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);

    // Invoice State
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    const [invoiceOrder, setInvoiceOrder] = useState(null);
    const [invoiceCustomer, setInvoiceCustomer] = useState(null);
    const invoiceRef = useRef();

    // Search Customers for New Order
    const customerSuggestions = customers.filter(c =>
        c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.mobile.includes(customerSearch)
    ).slice(0, 5); // Limit to top 5

    const selectCustomer = (customer) => {
        setNewOrderData(prev => ({
            ...prev,
            customerId: customer.id,
            customerName: customer.name,
            customerMobile: customer.mobile
        }));
        setCustomerSearch(customer.name);
        setShowCustomerSuggestions(false);
    };

    const handlePrint = useReactToPrint({
        content: () => invoiceRef.current,
    });

    const openInvoice = (order) => {
        const customer = customers.find(c => c.id === order.customerId) || {
            name: order.customerName,
            mobile: order.customerMobile
        };
        setInvoiceOrder(order);
        setInvoiceCustomer(customer);
        setIsInvoiceOpen(true);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerMobile?.includes(searchTerm) ||
            order.id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // --- Bulk Action Handlers ---

    const toggleSelectAll = () => {
        if (selectedOrders.length === filteredOrders.length) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(filteredOrders.map(o => o.id));
        }
    };

    const toggleSelectOrder = (id) => {
        if (selectedOrders.includes(id)) {
            setSelectedOrders(prev => prev.filter(o => o !== id));
        } else {
            setSelectedOrders(prev => [...prev, id]);
        }
    };

    const handleBulkDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedOrders.length} orders?`)) {
            actions.deleteOrdersBulk(selectedOrders);
            setSelectedOrders([]);
        }
    };

    // --- Single Order Handlers ---

    const handleDelete = (id) => {
        if (window.confirm('Delete this order?')) {
            actions.deleteOrder(id);
        }
    };

    const handleEditSave = (e) => {
        e.preventDefault();
        actions.updateOrder(editingOrder.id, editingOrder);
        setIsEditModalOpen(false);
    };

    const togglePaymentStatus = (order) => {
        const newStatus = order.paymentStatus === 'paid' ? 'pending' : 'paid';
        actions.updateOrder(order.id, { paymentStatus: newStatus });
    };

    const handleWhatsApp = (order) => {
        const message = generateReadyMessage(order, `${window.location.origin}/pay/${order.id}`);
        openWhatsApp(order.customerMobile, message);
    };

    return (
        <AdminLayout>
            <div className="animate-slide-up">
                <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">Orders Management</h1>
                        <p className="text-gray-600">View, edit, and manage bookings</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setIsNewOrderModalOpen(true)}
                            className="btn-primary flex items-center gap-2 text-sm md:text-base"
                        >
                            <Calendar className="w-4 h-4 md:w-5 md:h-5" /> New Order
                        </button>
                        {selectedOrders.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-100 transition-colors animate-fade-in text-sm md:text-base"
                            >
                                <Trash2 className="w-4 h-4" /> Delete ({selectedOrders.length})
                            </button>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="gradient-card mb-6">
                    <div className="flex flex-col md:flex-row gap-4 flex-wrap">
                        <div className="flex-1 w-full md:min-w-[300px] relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-12 w-full"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input-field w-full md:w-auto md:min-w-[200px]"
                        >
                            <option value="all">All Status</option>
                            <option value="booked">Booked</option>
                            <option value="ready">Ready</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="gradient-card overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="py-4 px-4 w-12">
                                    <button onClick={toggleSelectAll} className="text-gray-400 hover:text-primary-600">
                                        {selectedOrders.length > 0 && selectedOrders.length === filteredOrders.length ?
                                            <CheckSquare className="w-5 h-5 text-primary-600" /> :
                                            <Square className="w-5 h-5" />
                                        }
                                    </button>
                                </th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Order ID</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Customer</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Service</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Qty</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Payment</th>
                                <th className="text-right py-4 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.id} className={`border-b border-gray-100 hover:bg-gray-50 ${selectedOrders.includes(order.id) ? 'bg-primary-50/50' : ''}`}>
                                    <td className="py-4 px-4">
                                        <button onClick={() => toggleSelectOrder(order.id)} className="text-gray-400 hover:text-primary-600">
                                            {selectedOrders.includes(order.id) ?
                                                <CheckSquare className="w-5 h-5 text-primary-600" /> :
                                                <Square className="w-5 h-5" />
                                            }
                                        </button>
                                    </td>
                                    <td className="py-4 px-4 font-mono text-sm text-gray-600">{order.id}</td>
                                    <td className="py-4 px-4">
                                        <div className="font-semibold text-gray-900">{order.customerName}</div>
                                        <div className="text-xs text-gray-500">{order.customerMobile}</div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div>{order.service}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {formatDate(order.date)}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center font-bold text-gray-700">
                                        {order.sareeCount || 1}
                                    </td>
                                    <td className="py-4 px-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => actions.updateOrder(order.id, { status: e.target.value })}
                                            className={`badge cursor-pointer border-0 font-semibold bg-gray-100`}
                                        >
                                            <option value="booked">Booked</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="ready">Ready</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="py-4 px-4">
                                        <button
                                            onClick={() => togglePaymentStatus(order)}
                                            className={`badge cursor-pointer ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                                        >
                                            {order.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                                        </button>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openInvoice(order)}
                                                className="p-2 hover:bg-purple-100 text-purple-600 rounded-lg"
                                                title="Print Invoice"
                                            >
                                                <Printer className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleWhatsApp(order)} className="p-2 hover:bg-green-100 text-green-600 rounded-lg">
                                                <MessageCircle className="w-4 h-4" />
                                            </button>
                                            <a
                                                href={order.location?.lat && order.location?.lng
                                                    ? `https://www.google.com/maps/dir/?api=1&destination=${order.location.lat},${order.location.lng}`
                                                    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.address || '')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 hover:bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center"
                                                title="Get Directions"
                                            >
                                                <MapPin className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => { setEditingOrder(order); setIsEditModalOpen(true); }}
                                                className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(order.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Edit Modal */}
                {isEditModalOpen && editingOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-slide-up">
                            <h2 className="text-2xl font-bold mb-6">Edit Order</h2>
                            <form onSubmit={handleEditSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={editingOrder.service}
                                        onChange={e => setEditingOrder({ ...editingOrder, service: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Saree Count</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="input-field"
                                        value={editingOrder.sareeCount || 1}
                                        onChange={e => setEditingOrder({ ...editingOrder, sareeCount: parseInt(e.target.value) || 1 })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            value={editingOrder.amount}
                                            onChange={e => setEditingOrder({ ...editingOrder, amount: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <input
                                            type="date"
                                            className="input-field"
                                            value={editingOrder.date}
                                            onChange={e => setEditingOrder({ ...editingOrder, date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        className="input-field"
                                        rows="2"
                                        value={editingOrder.address || ''}
                                        onChange={e => setEditingOrder({ ...editingOrder, address: e.target.value })}
                                        placeholder="Delivery address..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Invoice Modal */}
                {isInvoiceOpen && invoiceOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col animate-slide-up">
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-xl font-bold">Print Invoice</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handlePrint}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        <Printer className="w-4 h-4" /> Print / Save PDF
                                    </button>
                                    <button onClick={() => setIsInvoiceOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-8 bg-gray-100">
                                <InvoiceTemplate
                                    ref={invoiceRef}
                                    order={invoiceOrder}
                                    customer={invoiceCustomer}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* New Order Modal */}
                {isNewOrderModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Create New Order</h2>
                                <button onClick={() => setIsNewOrderModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                actions.addOrder(newOrderData);
                                setIsNewOrderModalOpen(false);
                                // Reset form
                                setNewOrderData({
                                    customerId: '',
                                    customerName: '',
                                    customerMobile: '',
                                    service: 'Saree Draping',
                                    amount: 300,
                                    date: new Date().toISOString().split('T')[0],
                                    slotTime: '10:00 AM',
                                    status: 'booked',
                                    sareeCount: 1
                                });
                                setCustomerSearch('');
                            }} className="space-y-6">

                                {/* Customer Search Section */}
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <label className="block text-sm font-bold text-blue-800 mb-2">Find Existing Customer</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search by Name or Mobile..."
                                            className="input-field pl-10"
                                            value={customerSearch}
                                            onChange={(e) => {
                                                setCustomerSearch(e.target.value);
                                                setShowCustomerSuggestions(true);
                                                // Reset ID if user types to force new search
                                                if (newOrderData.customerId) {
                                                    setNewOrderData(prev => ({ ...prev, customerId: '' }));
                                                }
                                            }}
                                            onFocus={() => setShowCustomerSuggestions(true)}
                                        />
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />

                                        {/* Suggestions Dropdown */}
                                        {showCustomerSuggestions && customerSearch && (
                                            <div className="absolute z-10 w-full bg-white mt-1 rounded-lg shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
                                                {customerSuggestions.length > 0 ? (
                                                    customerSuggestions.map(c => (
                                                        <button
                                                            key={c.id}
                                                            type="button"
                                                            onClick={() => selectCustomer(c)}
                                                            className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 flex justify-between items-center group"
                                                        >
                                                            <div>
                                                                <div className="font-bold text-gray-900 group-hover:text-primary-600">{c.name}</div>
                                                                <div className="text-xs text-gray-500">{c.mobile}</div>
                                                            </div>
                                                            {c.id === newOrderData.customerId && <CheckSquare className="w-5 h-5 text-green-500" />}
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="p-4 text-center text-sm text-gray-500">
                                                        No match found. Fill details below to create new.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {newOrderData.customerId && (
                                        <div className="mt-2 text-xs text-green-600 font-bold flex items-center gap-1">
                                            <CheckSquare className="w-3 h-3" /> Linked to existing customer: {newOrderData.customerName}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="label">Customer Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field"
                                            value={newOrderData.customerName}
                                            onChange={e => setNewOrderData({ ...newOrderData, customerName: e.target.value })}
                                            readOnly={!!newOrderData.customerId} // Read-only if linked
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Mobile Number</label>
                                        <input
                                            type="tel"
                                            required
                                            className="input-field"
                                            value={newOrderData.customerMobile}
                                            onChange={e => setNewOrderData({ ...newOrderData, customerMobile: e.target.value })}
                                            readOnly={!!newOrderData.customerId}
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Service</label>
                                        <select
                                            className="input-field"
                                            value={newOrderData.service}
                                            onChange={e => setNewOrderData({ ...newOrderData, service: e.target.value })}
                                        >
                                            <option value="Saree Draping">Saree Draping</option>
                                            <option value="Pre-Pleating">Pre-Pleating</option>
                                            <option value="Box Folding">Box Folding</option>
                                            <option value="Bridal Styling">Bridal Styling</option>
                                            <option value="Ironing">Ironing</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Saree Count</label>
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            className="input-field"
                                            value={newOrderData.sareeCount}
                                            onChange={e => setNewOrderData({ ...newOrderData, sareeCount: parseInt(e.target.value) || 1 })}
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            className="input-field"
                                            value={newOrderData.amount}
                                            onChange={e => setNewOrderData({ ...newOrderData, amount: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Date</label>
                                        <input
                                            type="date"
                                            required
                                            className="input-field"
                                            value={newOrderData.date}
                                            onChange={e => setNewOrderData({ ...newOrderData, date: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Slot Time</label>
                                        <input
                                            type="time"
                                            className="input-field"
                                            value={newOrderData.slotTime}
                                            onChange={e => setNewOrderData({ ...newOrderData, slotTime: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="label">Address</label>
                                        <textarea
                                            className="input-field"
                                            rows="2"
                                            value={newOrderData.address}
                                            onChange={e => setNewOrderData({ ...newOrderData, address: e.target.value })}
                                            placeholder="Enter delivery address..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsNewOrderModalOpen(false)}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        Create Order
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminOrders;
