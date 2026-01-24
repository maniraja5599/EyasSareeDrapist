import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useDataStore } from '../../hooks/useDataStore';
import { formatDate } from '../../utils/helpers';
import { Search, Filter, ArrowUpRight, ArrowDownLeft, DollarSign, Download } from 'lucide-react';

const AdminPayments = () => {
    const { orders, stats, actions } = useDataStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, paid, pending

    const filteredTransactions = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || order.paymentStatus === filter;
        return matchesSearch && matchesFilter;
    });

    const totalRevenue = stats.totalRevenue;
    const pendingAmount = orders
        .filter(o => o.paymentStatus === 'pending')
        .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

    const togglePaymentStatus = (order) => {
        const newStatus = order.paymentStatus === 'paid' ? 'pending' : 'paid';
        actions.updateOrder(order.id, { paymentStatus: newStatus });
    };

    const exportToCSV = () => {
        const headers = ['Order ID', 'Date', 'Customer', 'Service', 'Amount', 'Status'];
        const csvContent = [
            headers.join(','),
            ...filteredTransactions.map(t => [
                t.id,
                t.date,
                `"${t.customerName}"`,
                `"${t.service}"`,
                t.amount,
                t.paymentStatus
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    return (
        <AdminLayout>
            <div className="animate-slide-up">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Payments & Revenue</h1>
                        <p className="text-gray-600">Track earnings and manage transaction statuses.</p>
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Revenue Card - Matching Reference: Light Green, Flat */}
                    <div className="bg-[#e6fffa] rounded-lg p-6 flex flex-col justify-between h-32">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#ccfbf1] flex items-center justify-center">
                                <ArrowUpRight className="w-5 h-5 text-[#0f5132]" />
                            </div>
                            <h3 className="text-[#0f5132] font-bold text-sm">Total Revenue Collected</h3>
                        </div>
                        <p className="text-4xl font-bold text-[#0f5132]">₹{totalRevenue.toLocaleString('en-IN')}</p>
                    </div>

                    {/* Pending Card - Matching Reference: Light Orange, Flat */}
                    <div className="bg-[#fff7ed] rounded-lg p-6 flex flex-col justify-between h-32">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#ffedd5] flex items-center justify-center">
                                <ArrowDownLeft className="w-5 h-5 text-[#9a3412]" />
                            </div>
                            <h3 className="text-[#9a3412] font-bold text-sm">Pending Payments</h3>
                        </div>
                        <p className="text-4xl font-bold text-[#9a3412]">₹{pendingAmount.toLocaleString('en-IN')}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="gradient-card mb-6">
                    <div className="flex gap-4 flex-wrap">
                        <div className="flex-1 min-w-[300px] relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Order ID or Customer Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-12"
                            />
                        </div>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="input-field min-w-[200px]"
                        >
                            <option value="all">All Transactions</option>
                            <option value="paid">Paid Only</option>
                            <option value="pending">Pending Only</option>
                        </select>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="gradient-card overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Order Ref</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Customer</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Service</th>
                                <th className="text-right py-4 px-4 font-semibold text-gray-700">Amount</th>
                                <th className="text-center py-4 px-4 font-semibold text-gray-700">Status</th>
                                <th className="text-right py-4 px-4 font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((t) => (
                                    <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4 text-sm text-gray-600">{formatDate(t.date)}</td>
                                        <td className="py-4 px-4 font-mono text-sm text-gray-500">{t.id}</td>
                                        <td className="py-4 px-4 font-medium text-gray-900">{t.customerName}</td>
                                        <td className="py-4 px-4 text-gray-600">{t.service}</td>
                                        <td className="py-4 px-4 text-right font-bold text-gray-900">₹{t.amount}</td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${t.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {t.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <button
                                                onClick={() => togglePaymentStatus(t)}
                                                className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
                                            >
                                                Mark as {t.paymentStatus === 'paid' ? 'Pending' : 'Paid'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-12 text-gray-500">
                                        No transactions found matching criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminPayments;
