import { useState, useEffect } from 'react';

// Initial Mock Data to seed if storage is empty
const INITIAL_CUSTOMERS = [
    {
        id: 'C1',
        name: 'Priya Sharma',
        mobile: '9876543210',
        email: 'priya@example.com',
        referral: 'Instagram',
        totalOrders: 2,
        measurements: { 'Bust': '34', 'Waist': '28', 'Hip': '36', 'Blouse Length': '14', 'Sleeve Length': '10' }
    },
    {
        id: 'C2',
        name: 'Anitha Raj',
        mobile: '8877665544',
        referral: 'Friend',
        totalOrders: 1,
        measurements: { 'Bust': '36', 'Blouse Length': '15' }
    }
];

// Generate 25 more dummy customers
const NAMES = ['Sneha', 'Lakshmi', 'Divya', 'Deepa', 'Kavya', 'Meera', 'Riya', 'Swetha', 'Pooja', 'Anu', 'Keerthi', 'Nisha', 'Vidya', 'Ramya', 'Sowmya'];
const SURNAMES = ['Krishnan', 'Raman', 'Narayan', 'Kumar', 'Rao', 'Iyer', 'Menon', 'Reddy', 'Patel', 'Chandran'];

for (let i = 1; i <= 25; i++) {
    const name = `${NAMES[Math.floor(Math.random() * NAMES.length)]} ${SURNAMES[Math.floor(Math.random() * SURNAMES.length)]}`;
    INITIAL_CUSTOMERS.push({
        id: `C-DUMMY-${i}`,
        name: name,
        mobile: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
        email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
        referral: Math.random() > 0.5 ? 'Instagram' : 'Google',
        totalOrders: Math.floor(Math.random() * 5),
        measurements: { 'Bust': '34', 'Waist': '28' }
    });
}

const INITIAL_ORDERS = [
    {
        id: 'ORD-001',
        customerId: 'C1',
        customerName: 'Priya Sharma',
        customerMobile: '9876543210',
        service: 'Saree Draping',
        status: 'completed',
        paymentStatus: 'paid',
        amount: 300,
        date: new Date().toISOString().split('T')[0],
        slotTime: '10:00 AM'
    },
    {
        id: 'ORD-002',
        customerId: 'C1',
        customerName: 'Priya Sharma',
        service: 'Pre-Pleating',
        status: 'ready',
        paymentStatus: 'pending',
        amount: 250,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        slotTime: '02:00 PM'
    }
];

// Helper for safe parsing
const safeParse = (key, fallback) => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
        console.error(`Error parsing ${key} from localStorage`, e);
        return fallback;
    }
};

export const useDataStore = () => {
    // Initialize state from localStorage or default
    const [customers, setCustomers] = useState(() => safeParse('eyas_customers', INITIAL_CUSTOMERS));

    const [orders, setOrders] = useState(() => safeParse('eyas_orders', INITIAL_ORDERS));

    // Recycle Bin State
    const [recycleBin, setRecycleBin] = useState(() => safeParse('eyas_recycle_bin', []));

    // Partners State
    const [partners, setPartners] = useState(() => safeParse('eyas_partners', []));

    // Shop Settings State
    const [shopSettings, setShopSettings] = useState(() => safeParse('eyas_shop_settings', {
        companyName: 'Eyas Saree Drapist',
        contactMobile: '7502551633',
        whatsapp: '7502551633',
        address: 'Namakkal, TN',
        upiId: 'eyas@upi',
        instagram: 'eyassareedrapist'
    }));

    // Webpage Settings State
    const [webpageSettings, setWebpageSettings] = useState(() => safeParse('eyas_webpage_settings', {
        bookingTitle: 'Book Your Appointment',
        bookingSubtitle: 'Choose your service and preferred time slot',
        services: [
            { id: 'prepleat', name: 'Pre-Pleating', price: 250, duration: '30-45 mins' },
            { id: 'draping', name: 'Draping', price: 300, duration: '15-20 mins' },
            { id: 'both', name: 'Complete Package', price: 500, duration: 'Best Value' }
        ]
    }));

    // Persist changes
    useEffect(() => {
        localStorage.setItem('eyas_customers', JSON.stringify(customers));
    }, [customers]);

    useEffect(() => {
        localStorage.setItem('eyas_orders', JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem('eyas_recycle_bin', JSON.stringify(recycleBin));
    }, [recycleBin]);

    useEffect(() => {
        localStorage.setItem('eyas_partners', JSON.stringify(partners));
    }, [partners]);

    useEffect(() => {
        localStorage.setItem('eyas_shop_settings', JSON.stringify(shopSettings));
    }, [shopSettings]);

    useEffect(() => {
        localStorage.setItem('eyas_webpage_settings', JSON.stringify(webpageSettings));
    }, [webpageSettings]);

    // --- Helpers for Recycle Bin ---
    const addToBin = (type, items) => {
        const binItems = items.map(item => ({
            binId: `BIN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            originalId: item.id,
            type,
            data: item,
            deletedAt: new Date().toISOString()
        }));
        setRecycleBin(prev => [...binItems, ...prev]);
    };

    // --- Customer Actions ---

    const addCustomer = (customerData) => {
        const newCustomer = {
            id: `C${Date.now()}`,
            totalOrders: 0,
            measurements: {},
            ...customerData
        };
        setCustomers(prev => [newCustomer, ...prev]);
        return newCustomer;
    };

    const updateCustomer = (id, updates) => {
        setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const deleteCustomer = (id) => {
        const customerToDelete = customers.find(c => c.id === id);
        if (customerToDelete) {
            addToBin('customer', [customerToDelete]);
            setCustomers(prev => prev.filter(c => c.id !== id));
        }
    };

    const deleteAllCustomers = () => {
        if (customers.length > 0) {
            addToBin('customer', customers);
            setCustomers([]);
        }
    };

    // --- Order Actions ---

    const addOrder = (orderData) => {
        const newOrder = {
            id: `ORD-${Date.now().toString().slice(-6)}`,
            status: 'booked',
            paymentStatus: 'pending',
            createdAt: new Date().toISOString(),
            ...orderData
        };
        setOrders(prev => [newOrder, ...prev]);

        // Update customer total orders if linked
        if (newOrder.customerId) {
            updateCustomer(newOrder.customerId, {
                totalOrders: (customers.find(c => c.id === newOrder.customerId)?.totalOrders || 0) + 1
            });
        }
        return newOrder;
    };

    const updateOrder = (id, updates) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    };

    const deleteOrder = (id) => {
        const orderToDelete = orders.find(o => o.id === id);
        if (orderToDelete) {
            addToBin('order', [orderToDelete]);
            setOrders(prev => prev.filter(o => o.id !== id));
        }
    };

    const deleteOrdersBulk = (ids) => {
        const ordersToDelete = orders.filter(o => ids.includes(o.id));
        if (ordersToDelete.length > 0) {
            addToBin('order', ordersToDelete);
            setOrders(prev => prev.filter(o => !ids.includes(o.id)));
        }
    };

    const seedDummyCustomers = () => {
        const NAMES = ['Sneha', 'Lakshmi', 'Divya', 'Deepa', 'Kavya', 'Meera', 'Riya', 'Swetha', 'Pooja', 'Anu', 'Keerthi', 'Nisha', 'Vidya', 'Ramya', 'Sowmya'];
        const SURNAMES = ['Krishnan', 'Raman', 'Narayan', 'Kumar', 'Rao', 'Iyer', 'Menon', 'Reddy', 'Patel', 'Chandran'];
        const newCustomers = [];

        const SERVICES = ['Saree Draping', 'Pre-Pleating', 'Box Folding', 'Bridal Styling', 'Ironing'];
        const STATUSES = ['booked', 'completed', 'ready', 'in_progress'];

        const newOrders = [];

        for (let i = 1; i <= 25; i++) {
            const name = `${NAMES[Math.floor(Math.random() * NAMES.length)]} ${SURNAMES[Math.floor(Math.random() * SURNAMES.length)]}`;
            const customerId = `C-GEN-${Date.now()}-${i}`;
            const mobile = `98${Math.floor(10000000 + Math.random() * 90000000)}`;

            // Create Customer
            newCustomers.push({
                id: customerId,
                name: name,
                mobile: mobile,
                email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
                referral: Math.random() > 0.5 ? 'Instagram' : 'Google',
                totalOrders: 1, // Will create 1 order below
                measurements: { 'Bust': '34', 'Waist': '28' }
            });

            // Create 1 Random Order for this customer
            newOrders.push({
                id: `ORD-${Date.now()}-${i}`,
                customerId: customerId,
                customerName: name,
                customerMobile: mobile,
                service: SERVICES[Math.floor(Math.random() * SERVICES.length)],
                status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
                paymentStatus: Math.random() > 0.5 ? 'paid' : 'pending',
                amount: Math.floor(Math.random() * 500) + 200, // Random price 200-700
                date: new Date(Date.now() - Math.floor(Math.random() * 864000000)).toISOString().split('T')[0], // Last 10 days
                slotTime: '10:00 AM'
            });
        }
        setCustomers(prev => [...prev, ...newCustomers]);
        setOrders(prev => [...prev, ...newOrders]);
    };

    // --- Recycle Bin Actions ---

    const restoreItem = (binId) => {
        const item = recycleBin.find(i => i.binId === binId);
        if (!item) return;

        if (item.type === 'customer') {
            setCustomers(prev => [item.data, ...prev]);
        } else if (item.type === 'order') {
            setOrders(prev => [item.data, ...prev]);
        }

        setRecycleBin(prev => prev.filter(i => i.binId !== binId));
    };

    const permanentDelete = (binId) => {
        setRecycleBin(prev => prev.filter(i => i.binId !== binId));
    };

    const emptyRecycleBin = () => {
        setRecycleBin([]);
    };

    // --- Partner Actions ---
    const addPartner = (partnerData) => {
        const newPartner = {
            id: `P-${Date.now()}`,
            name: '',
            category: 'Makeup Artist',
            commissionType: 'percentage',
            value: 0,
            ...partnerData
        };
        setPartners(prev => [newPartner, ...prev]);
        return newPartner;
    };

    const updatePartner = (id, updates) => {
        setPartners(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const deletePartner = (id) => {
        setPartners(prev => prev.filter(p => p.id !== id));
    };

    // --- Settings Actions ---
    const updateSettings = (newSettings) => {
        setShopSettings(prev => ({ ...prev, ...newSettings }));
    };

    const updateWebpageSettings = (newSettings) => {
        setWebpageSettings(prev => ({ ...prev, ...newSettings }));
    };

    // --- Stats Helpers ---

    const getStats = () => {
        const totalRevenue = orders
            .filter(o => o.paymentStatus === 'paid')
            .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

        const pendingPayments = orders.filter(o => o.paymentStatus === 'pending').length;
        const activeOrders = orders.filter(o => ['booked', 'received', 'in_progress', 'ready'].includes(o.status)).length;

        return {
            totalRevenue,
            pendingPayments,
            activeOrders,
            totalCustomers: customers.length,
            totalOrders: orders.length,
            recycleBinCount: recycleBin.length
        };
    };

    return {
        customers,
        orders,
        recycleBin,
        partners,
        actions: {
            addCustomer,
            updateCustomer,
            deleteCustomer,
            deleteAllCustomers,
            addOrder,
            updateOrder,
            deleteOrder,
            deleteOrdersBulk,
            seedDummyCustomers,
            restoreItem,
            permanentDelete,
            emptyRecycleBin,
            addPartner,
            updatePartner,
            deletePartner,
            deletePartner,
            updateSettings,
            updateWebpageSettings
        },
        shopSettings,
        webpageSettings,
        stats: getStats()
    };
};
