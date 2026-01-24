import { useMemo } from 'react';
import { useDataStore } from './useDataStore';

export const useNotifications = () => {
    const { orders } = useDataStore();

    const notifications = useMemo(() => {
        const alerts = [];
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        // 1. Pending Payments Alert
        const pendingOrders = orders.filter(o => o.paymentStatus === 'pending');
        if (pendingOrders.length > 0) {
            const totalPending = pendingOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);
            alerts.push({
                id: 'pending-payments',
                type: 'critical', // red
                title: 'Pending Payments',
                message: `${pendingOrders.length} orders have pending payments totaling ₹${totalPending}`,
                link: '/admin/orders',
                count: pendingOrders.length
            });
        }

        // 2. Upcoming Bookings (Tomorrow)
        const upcomingOrders = orders.filter(o => o.date === tomorrowStr && o.status === 'booked');
        if (upcomingOrders.length > 0) {
            alerts.push({
                id: 'upcoming-bookings',
                type: 'warning', // yellow
                title: 'Upcoming Bookings',
                message: `You have ${upcomingOrders.length} bookings scheduled for tomorrow`,
                link: '/admin/orders',
                count: upcomingOrders.length
            });
        }

        return alerts;
    }, [orders]);

    const unreadCount = notifications.length;

    return { notifications, unreadCount };
};
