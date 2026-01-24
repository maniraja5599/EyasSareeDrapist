import React, { useEffect, useRef } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';

const NotificationListener = () => {
    const { showToast } = useToast();
    const { user } = useAuth();

    // Keep track of counts to detect increases
    const prevCountsRef = useRef({
        orders: 0,
        customers: 0
    });

    // Initialize counts on mount
    useEffect(() => {
        const orders = JSON.parse(localStorage.getItem('eyas_orders') || '[]');
        const customers = JSON.parse(localStorage.getItem('eyas_customers') || '[]');
        prevCountsRef.current = {
            orders: orders.length,
            customers: customers.length
        };
    }, []);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'eyas_orders') {
                const oldOrders = JSON.parse(e.oldValue || '[]');
                const newOrders = JSON.parse(e.newValue || '[]');

                // Case 1: New Booking (For Admin)
                if (newOrders.length > oldOrders.length) {
                    if (user?.role === 'admin') {
                        showToast('New Booking!', `Order #${newOrders[0].id} has been received.`, 'success');
                    }
                }

                // Case 2: Status Update (For Client)
                // Find order that changed status
                if (user?.role === 'client') {
                    // Check if any of MY orders changed
                    const myOldOrder = oldOrders.find(o => o.customerId === user.id);
                    const myNewOrder = newOrders.find(o => o.customerId === user.id); // Simple check, improvement: map all

                    // Better approach: Find diffs
                    newOrders.forEach(newOrder => {
                        const oldOrder = oldOrders.find(o => o.id === newOrder.id);
                        if (oldOrder && oldOrder.status !== newOrder.status && newOrder.customerId === user.id) {
                            showToast('Order Update', `Your order #${newOrder.id} is now ${newOrder.status.replace('_', ' ')}`, 'info');
                        }
                    });
                }
            }

            if (e.key === 'eyas_customers') {
                const oldCustomers = JSON.parse(e.oldValue || '[]');
                const newCustomers = JSON.parse(e.newValue || '[]');

                if (newCustomers.length > oldCustomers.length) {
                    if (user?.role === 'admin') {
                        const newCustomer = newCustomers[0]; // Logic assumes prepended, but safe to just say "New Customer"
                        showToast('New Customer!', `A new customer has signed up.`, 'success');
                    }
                }
            }
        };

        // Poll for changes in same tab (hooks update state, but we want notification only on "event")
        // But 'storage' event ONLY fires on OTHER tabs.
        // For same-tab notifications, we rely on the action creators in useDataStore calling showToast potentially, 
        // OR we can just rely on the fact that if *I* did the action, I don't need a notification.
        // The requirement is "instantly when new user signup... also give client side notification about status"
        // Usually implies cross-tab or "I am admin, someone else booked".

        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, [user, showToast]);

    return null; // Invisible component
};

export default NotificationListener;
