import React from 'react';
import { useDataStore } from '../../hooks/useDataStore';
import { Calendar, TrendingUp, Clock, CheckCircle, DollarSign, ShoppingBag } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

const KPICard = ({ icon: Icon, title, value, trend, color }) => (
    <div className="gradient-card animate-fade-in group hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    {trend}
                </div>
            )}
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
);

const AdminDashboard = () => {
    const { stats, orders, customers } = useDataStore();

    // Calculate real-time stats
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = orders.filter(b => b.date === today);
    const pendingPayments = stats.pendingPayments;
    const readyOrders = orders.filter(b => b.status === 'ready');
    const totalRevenue = stats.totalRevenue;
    const loading = false; // Local storage is instant

    return (
        <AdminLayout>
            <div className="animate-slide-up">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Dashboard</h1>
                        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KPICard
                        icon={Calendar}
                        title="Today's Bookings"
                        value={todayBookings.length}
                        color="from-blue-500 to-blue-600"
                        trend={todayBookings.length > 0 ? "Active" : null}
                    />
                    <KPICard
                        icon={Clock}
                        title="Pending Payments"
                        value={pendingPayments.length}
                        color="from-orange-500 to-orange-600"
                    />
                    <KPICard
                        icon={CheckCircle}
                        title="Ready Orders"
                        value={readyOrders.length}
                        color="from-green-500 to-green-600"
                    />
                    <KPICard
                        icon={DollarSign}
                        title="Revenue (Month)"
                        value={`₹${totalRevenue.toLocaleString('en-IN')}`}
                        color="from-purple-500 to-purple-600"
                        trend="+8%"
                    />
                </div>

                {/* Recent Activity */}
                <div className="gradient-card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-display font-bold">Recent Bookings</h2>
                        <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors">View All</button>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        </div>
                    ) : orders?.length > 0 ? (
                        <div className="space-y-4">
                            {orders.slice(0, 5).map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-xl shadow-inner">
                                            <span className="font-bold text-primary-700">{booking.customerName?.[0]?.toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{booking.customerName}</h4>
                                            <p className="text-sm text-gray-600 flex items-center gap-2">
                                                <span className="inline-block w-2 h-2 rounded-full bg-gray-300"></span>
                                                {booking.service}
                                                <span className="text-gray-300">|</span>
                                                {booking.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'ready' ? 'bg-blue-100 text-blue-700' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {booking.status}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {booking.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-20" />
                            <p>No bookings yet. They'll appear here once customers start booking!</p>
                        </div>
                    )}
                </div>

                {/* Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                    {/* Customer Acquisition (Referrals) */}
                    <div className="gradient-card">
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Customer Acquisition</h3>
                        </div>
                        <div className="space-y-4">
                            {(() => {
                                const referralCounts = {};
                                customers.forEach(c => {
                                    const source = c.referral || 'Other';
                                    referralCounts[source] = (referralCounts[source] || 0) + 1;
                                });
                                const total = customers.length || 1;
                                return Object.entries(referralCounts)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([source, count]) => (
                                        <div key={source}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-gray-700">{source}</span>
                                                <span className="text-gray-500">{count} ({Math.round(count / total * 100)}%)</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${(count / total) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ));
                            })()}
                        </div>
                    </div>

                    {/* Service Popularity */}
                    <div className="gradient-card">
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Popular Services</h3>
                        </div>
                        <div className="space-y-4">
                            {(() => {
                                const serviceCounts = {};
                                orders.forEach(o => {
                                    const service = o.service || 'Unknown';
                                    serviceCounts[service] = (serviceCounts[service] || 0) + 1;
                                });
                                const total = orders.length || 1;
                                return Object.entries(serviceCounts)
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([service, count]) => (
                                        <div key={service}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-gray-700">{service}</span>
                                                <span className="text-gray-500">{count} bookings</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div
                                                    className="bg-secondary-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${(count / total) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ));
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
