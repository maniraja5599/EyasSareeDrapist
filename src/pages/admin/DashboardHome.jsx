import React, { useMemo } from 'react';
import { TrendingUp, Users, CalendarCheck, DollarSign, Clock, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useDataStore } from '../../hooks/useDataStore';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, color, subtext }) => (
  <div className="stat-card glass-panel animate-fade-in hover:translate-y-[-2px] transition-transform duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="stat-icon" style={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
      {subtext && <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-500">{subtext}</span>}
    </div>
    <div className="stat-info">
      <h3 className="stat-value text-2xl font-bold text-secondary-900 mb-1">{value}</h3>
      <span className="stat-title text-sm text-gray-500 font-medium">{title}</span>
    </div>
  </div>
);

const DashboardHome = () => {
  const { orders = [], stats } = useDataStore();
  const navigate = useNavigate();

  // Calculate dates
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Filter Next Work Schedule (Upcoming Bookings)
  const upcomingSchedule = useMemo(() => {
    return orders
      .filter(o => o.status === 'booked' && o.date >= todayStr)
      .sort((a, b) => {
        const dateA = new Date(a.date + 'T' + convertTo24Hour(a.slotTime));
        const dateB = new Date(b.date + 'T' + convertTo24Hour(b.slotTime));
        return dateA - dateB;
      })
      .slice(0, 5); // Show top 5
  }, [orders]);

  // Filter Important Updates
  const criticalUpdates = useMemo(() => {
    const alerts = [];

    // Pending Payments
    const pendingPay = orders.filter(o => o.paymentStatus === 'pending');
    if (pendingPay.length > 0) {
      alerts.push({
        type: 'urgent',
        title: 'Pending Payments',
        count: pendingPay.length,
        message: `${pendingPay.length} orders need payment verification`,
        link: '/admin/orders?filter=pending_payment'
      });
    }

    // Unassigned Orders (if any logic existed, placeholder for now)
    // Today's Bookings
    const todayBookings = orders.filter(o => o.date === todayStr && o.status === 'booked');
    if (todayBookings.length > 0) {
      alerts.push({
        type: 'info',
        title: 'Today\'s Schedule',
        count: todayBookings.length,
        message: `You have ${todayBookings.length} appointments today`,
        link: '/admin/orders'
      });
    }

    return alerts;
  }, [orders]);

  return (
    <div className="dashboard-home max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-secondary-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/orders', { state: { openNewOrder: true } })}
            className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5"
          >
            <CalendarCheck size={18} />
            New Booking
          </button>
          <span className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Active Orders"
          value={stats?.activeOrders || 0}
          icon={<CalendarCheck size={24} />}
          color="#3B82F6"
          subtext="Processing"
        />
        <StatCard
          title="Pending Payments"
          value={stats?.pendingPayments || 0}
          icon={<AlertTriangle size={24} />}
          color="#F59E0B"
          subtext="Action Needed"
        />
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          icon={<Users size={24} />}
          color="#8B5CF6"
          subtext="All Time"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={<DollarSign size={24} />}
          color="#10B981"
          subtext="Collected"
        />
      </div>

      {/* Main Content Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Next Work Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary-500" />
                Next Work Schedule
              </h2>
              <button
                onClick={() => navigate('/admin/orders')}
                className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
              >
                View All <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {upcomingSchedule.length > 0 ? (
                upcomingSchedule.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 group">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center w-14 h-14 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-primary-200 group-hover:bg-primary-50 transition-colors">
                        <span className="text-xs font-bold text-gray-400 uppercase">{new Date(order.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="text-xl font-bold text-secondary-900">{new Date(order.date).getDate()}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-secondary-900">{order.customerName}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1"><Clock size={14} /> {order.slotTime}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{order.service}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {order.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarCheck className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-gray-900 font-bold mb-1">No Upcoming Bookings</h3>
                  <p className="text-gray-500 text-sm">You're all caught up! No scheduled jobs for now.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Important Updates */}
        <div className="space-y-6">
          <div className="bg-secondary-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            {/* Decorative background circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-500/20 rounded-full blur-xl -ml-5 -mb-5"></div>

            <h2 className="text-xl font-bold mb-6 relative z-10 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary-400" />
              Important Updates
            </h2>

            <div className="space-y-4 relative z-10">
              {criticalUpdates.length > 0 ? (
                criticalUpdates.map((alert, idx) => (
                  <div key={idx} onClick={() => navigate(alert.link)} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${alert.type === 'urgent' ? 'bg-red-500/20 text-red-200' : 'bg-blue-500/20 text-blue-200'
                        }`}>
                        {alert.title}
                      </span>
                      <ChevronRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-gray-200 leading-snug">
                      {alert.message}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 p-4 bg-green-500/20 rounded-xl border border-green-500/30">
                  <CheckCircle2 className="text-green-400" />
                  <div>
                    <h4 className="font-bold text-green-100 text-sm">All Clear!</h4>
                    <p className="text-xs text-green-200/80">No urgent actions required.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links / Tips */}
          <div className="bg-gradient-to-br from-primary-50 to-white rounded-3xl p-6 border border-primary-100 shadow-sm">
            <h3 className="font-bold text-secondary-900 mb-4">Quick Tip</h3>
            <p className="text-sm text-gray-600 mb-4">
              Did you know? You can quickly add a customer to the recycle bin by swiping left on mobile view.
            </p>
            <button className="w-full py-2 bg-white border border-primary-200 text-primary-700 font-bold rounded-xl text-sm hover:bg-primary-50 transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for time sorting
function convertTo24Hour(time12h) {
  if (!time12h) return '00:00';
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  }
  return `${hours}:${minutes}`;
}

export default DashboardHome;
