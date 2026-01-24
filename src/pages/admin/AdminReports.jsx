import React, { useState, useMemo } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useDataStore } from '../../hooks/useDataStore';
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { Search, Filter, Download, ArrowUpRight, ArrowDownRight, TrendingUp, Users } from 'lucide-react';

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'];

const AdminReports = () => {
    const { orders, customers, partners } = useDataStore();
    const [activeTab, setActiveTab] = useState('financials'); // financials | customers
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPartner, setFilterPartner] = useState('All');

    // Time Filters
    const [timeRange, setTimeRange] = useState('This Month'); // This Month, Last Month, This Quarter, This Year, Custom
    const [customDate, setCustomDate] = useState({ start: '', end: '' });

    // --- Date Filtering Logic ---
    const getFilteredOrders = useMemo(() => {
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date();

        switch (timeRange) {
            case 'This Month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'Last Month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            case 'This Quarter':
                const quarter = Math.floor(now.getMonth() / 3);
                startDate = new Date(now.getFullYear(), quarter * 3, 1);
                endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0);
                break;
            case 'This Year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                break;
            case 'Custom':
                if (customDate.start && customDate.end) {
                    startDate = new Date(customDate.start);
                    endDate = new Date(customDate.end);
                } else {
                    return orders; // Return all if dates not set
                }
                break;
            case 'Overall':
            default:
                return orders;
        }

        // Normalize dates to start/end of day
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        return orders.filter(o => {
            const orderDate = new Date(o.date);
            return orderDate >= startDate && orderDate <= endDate;
        });
    }, [orders, timeRange, customDate]);

    // --- Financial Analytics Data ---
    const financialData = useMemo(() => {
        // 1. Revenue Over Time (Daily)
        const dailyRevenue = {};
        getFilteredOrders.forEach(order => {
            const date = order.date;
            if (!dailyRevenue[date]) dailyRevenue[date] = 0;
            if (order.paymentStatus === 'paid') {
                dailyRevenue[date] += Number(order.amount || 0);
            }
        });

        const revenueChartData = Object.keys(dailyRevenue)
            .sort()
            .slice(-30) // Last 30 entries (or days)
            .map(date => ({
                date,
                amount: dailyRevenue[date]
            }));

        // 2. Payment Status Distribution
        const statusCounts = { paid: 0, pending: 0, overdue: 0 };
        getFilteredOrders.forEach(order => {
            if (order.paymentStatus === 'paid') statusCounts.paid += Number(order.amount || 0);
            else if (order.paymentStatus === 'pending') statusCounts.pending += Number(order.amount || 0);
        });

        const paymentStatusData = [
            { name: 'Paid', value: statusCounts.paid },
            { name: 'Pending', value: statusCounts.pending }
        ];

        return { revenueChartData, paymentStatusData };
    }, [getFilteredOrders]);

    // --- Customer Deep Dive Data ---
    const customerReport = useMemo(() => {
        return customers.map(customer => {
            // Filter orders for this customer that match the time range
            const customerOrders = getFilteredOrders.filter(o => o.customerId === customer.id);

            // Calculate Top Category
            const categories = {};
            customerOrders.forEach(o => {
                const cat = o.service || 'Other';
                categories[cat] = (categories[cat] || 0) + 1;
            });
            const topCategory = Object.keys(categories).sort((a, b) => categories[b] - categories[a])[0] || '-';

            const totalBilled = customerOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
            const totalPaid = customerOrders
                .filter(o => o.paymentStatus === 'paid')
                .reduce((sum, o) => sum + Number(o.amount || 0), 0);
            const totalPending = totalBilled - totalPaid;

            // Partner Name Resolution
            let partnerName = 'Direct/Other';
            if (customer.referral && customer.referral.startsWith('Partner: ')) {
                partnerName = customer.referral.replace('Partner: ', '');
            } else if (customer.referral) {
                partnerName = customer.referral;
            }

            return {
                ...customer,
                totalBilled,
                totalPaid,
                totalPending,
                orderCount: customerOrders.length,
                topCategory,
                lastOrderDate: customerOrders.length > 0 ? customerOrders.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date : '-',
                partnerName
            };
        }).filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesPartner = filterPartner === 'All' || c.partnerName === filterPartner;
            return matchesSearch && matchesPartner;
        });
    }, [customers, getFilteredOrders, searchTerm, filterPartner]);

    // Unique Partners for Filter
    const uniquePartners = useMemo(() => {
        const partners = new Set(customers.map(c => {
            if (c.referral && c.referral.startsWith('Partner: ')) {
                return c.referral.replace('Partner: ', '');
            }
            return c.referral || 'Other';
        }));
        return ['All', ...Array.from(partners)];
    }, [customers]);

    return (
        <AdminLayout>
            <div className="animate-slide-up space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Reports & Analytics</h1>
                        <p className="text-gray-600">Deep insights into revenue and customer payments.</p>
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setActiveTab('financials')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'financials' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Financial Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('customers')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'customers' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Customer Financials
                        </button>
                    </div>
                </div>

                {/* --- Global Filter Controls --- */}
                <div className="gradient-card p-4 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                        {['This Month', 'Last Month', 'This Quarter', 'This Year', 'Overall', 'Custom'].map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === range
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>

                    {timeRange === 'Custom' && (
                        <div className="flex items-center gap-2 animate-fade-in">
                            <input
                                type="date"
                                className="input-field py-1"
                                value={customDate.start}
                                onChange={e => setCustomDate({ ...customDate, start: e.target.value })}
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="date"
                                className="input-field py-1"
                                value={customDate.end}
                                onChange={e => setCustomDate({ ...customDate, end: e.target.value })}
                            />
                        </div>
                    )}
                </div>

                {/* --- Financials Tab --- */}
                {activeTab === 'financials' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Revenue Chart */}
                        <div className="gradient-card col-span-1 lg:col-span-2">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-600" /> Revenue Trend (Last 30 Days)
                            </h3>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={financialData.revenueChartData}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#6B7280', fontSize: 12 }}
                                            tickFormatter={(value) => `₹${value}`}
                                        />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                            formatter={(value) => [`₹${value}`, 'Revenue']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#10B981"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRevenue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Payment Status Pie Chart */}
                        <div className="gradient-card">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Status Breakdown</h3>
                            <div className="h-64 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={financialData.paymentStatusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {financialData.paymentStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `₹${value}`} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                                <p className="text-green-600 font-medium mb-1">Total Collected</p>
                                <h4 className="text-3xl font-bold text-green-900">
                                    ₹{financialData.paymentStatusData.find(d => d.name === 'Paid')?.value.toLocaleString() || 0}
                                </h4>
                            </div>
                            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                                <p className="text-orange-600 font-medium mb-1">Total Pending</p>
                                <h4 className="text-3xl font-bold text-orange-900">
                                    ₹{financialData.paymentStatusData.find(d => d.name === 'Pending')?.value.toLocaleString() || 0}
                                </h4>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Customer Reports Tab --- */}
                {activeTab === 'customers' && (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className="gradient-card flex flex-wrap gap-4 items-center">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search Customer..."
                                    className="input-field pl-12"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="input-field w-auto min-w-[150px]"
                                value={filterPartner}
                                onChange={e => setFilterPartner(e.target.value)}
                            >
                                <option value="All">All Partners</option>
                                {uniquePartners.filter(p => p !== 'All').map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                            <button className="btn-secondary flex items-center gap-2">
                                <Download className="w-4 h-4" /> Export CSV
                            </button>
                        </div>

                        {/* Data Table */}
                        <div className="gradient-card overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Customer Name</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Details</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Bookings</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Top Service</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Total Billed</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Paid Amount</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-700">Pending</th>
                                        <th className="text-left py-4 px-4 font-semibold text-gray-700 bg-gray-50">LTV Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerReport.length > 0 ? (
                                        customerReport.map(customer => (
                                            <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-4 px-4 font-medium text-gray-900">{customer.name}</td>
                                                <td className="py-4 px-4 text-sm text-gray-500">
                                                    <div>{customer.mobile}</div>
                                                    <div className="text-xs text-blue-600 bg-blue-50 inline-block px-1 rounded mt-1">
                                                        {customer.partnerName}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 font-medium text-center">{customer.orderCount}</td>
                                                <td className="py-4 px-4 text-sm text-gray-600">{customer.topCategory}</td>
                                                <td className="py-4 px-4 font-mono font-medium">₹{customer.totalBilled}</td>
                                                <td className="py-4 px-4 font-mono text-green-600">₹{customer.totalPaid}</td>
                                                <td className="py-4 px-4">
                                                    {customer.totalPending > 0 ? (
                                                        <span className="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded">
                                                            ₹{customer.totalPending}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">₹0</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-4 bg-gray-50">
                                                    {customer.totalBilled > 5000 ? (
                                                        <span className="flex items-center gap-1 text-purple-600 font-bold text-xs uppercase">
                                                            <Users className="w-3 h-3" /> VIP
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">Regular</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center py-12 text-gray-500">No data found matching filters.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminReports;
