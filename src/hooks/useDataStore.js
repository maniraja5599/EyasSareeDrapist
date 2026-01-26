import { useState, useEffect } from 'react';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    setDoc,
    where,
    getDocs
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { generateBookingId } from '../utils/bookingIdGenerator';

export const useDataStore = () => {
    const { user } = useAuth(); // identifying if admin
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [recycleBin, setRecycleBin] = useState([]);
    const [partners, setPartners] = useState([]);
    const [shopSettings, setShopSettings] = useState({
        companyName: 'Eyas Saree Drapist',
        contactMobile: '7502551633',
        whatsapp: '7502551633',
        upiId: '7502551633@ybl',
        ...null // defaults
    });
    const [webpageSettings, setWebpageSettings] = useState({
        bookingTitle: 'Book Your Appointment',
        services: [
            { id: 'prepleat', name: 'Pre-Pleating', price: 250, duration: '30-45 mins' },
            { id: 'draping', name: 'Draping', price: 300, duration: '15-20 mins' },
            { id: 'both', name: 'Complete Package', price: 500, duration: 'Best Value' }
        ]
    });

    // --- Real-time Listeners ---

    useEffect(() => {
        const unsubs = [];

        // 1. Settings (Public Read)
        const qSettings = collection(db, 'settings');
        unsubs.push(onSnapshot(qSettings, (snapshot) => {
            snapshot.docs.forEach(doc => {
                if (doc.id === 'shop') setShopSettings(prev => ({ ...prev, ...doc.data() }));
                if (doc.id === 'webpage') setWebpageSettings(prev => ({ ...prev, ...doc.data() }));
            });
        }));

        // 2. Admin Collections (Protected)
        // Only subscribe if we have a user (assuming admin for now)
        if (user) {
            // Bookings
            const qOrders = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
            unsubs.push(onSnapshot(qOrders, (snapshot) => {
                const loadedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOrders(loadedOrders);
            }, (error) => console.log("Auth required for orders:", error.code)));

            // Customers
            unsubs.push(onSnapshot(collection(db, 'customers'), (snapshot) => {
                const loadedCustomers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCustomers(loadedCustomers);
            }));

            // Partners
            unsubs.push(onSnapshot(collection(db, 'partners'), (snapshot) => {
                const loadedPartners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPartners(loadedPartners);
            }));

            // Recycle Bin
            unsubs.push(onSnapshot(collection(db, 'recycle_bin'), (snapshot) => {
                const binItems = snapshot.docs.map(doc => ({ ...doc.data(), binId: doc.id }));
                setRecycleBin(binItems);
            }));
        }

        return () => {
            unsubs.forEach(u => u());
        };
    }, [user]); // Re-run when user logs in/out


    // --- Actions (Async Wrappers) ---

    // Customers
    const addCustomer = async (customerData) => {
        const docRef = await addDoc(collection(db, 'customers'), {
            ...customerData,
            totalOrders: 0,
            measurements: {}
        });
        return { id: docRef.id, ...customerData };
    };

    const findCustomerByMobile = async (mobile) => {
        const q = query(collection(db, 'customers'), where('mobile', '==', mobile));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        return null;
    };

    const updateCustomer = async (id, updates) => {
        await updateDoc(doc(db, 'customers', id), updates);
    };

    const deleteCustomer = async (id) => {
        const customer = customers.find(c => c.id === id);
        if (customer) {
            await addToBin('customer', [customer]);
            await deleteDoc(doc(db, 'customers', id));
        }
    };

    // Orders
    const addOrder = async (orderData) => {
        const timestamp = new Date().toISOString();
        const friendlyId = await generateBookingId(); // Generate EYS-1001

        // Use setDoc to define our own ID instead of auto-id
        await setDoc(doc(db, 'bookings', friendlyId), {
            ...orderData,
            status: 'booked',
            paymentStatus: 'pending',
            createdAt: timestamp
        });

        // Link Customer
        if (orderData.customerId) {
            const customer = customers.find(c => c.id === orderData.customerId);
            if (customer) {
                await updateDoc(doc(db, 'customers', orderData.customerId), {
                    totalOrders: (customer.totalOrders || 0) + 1
                });
            }
        }
        return { id: friendlyId, ...orderData };
    };

    const updateOrder = async (id, updates) => {
        await updateDoc(doc(db, 'bookings', id), updates);
    };

    const deleteOrder = async (id) => {
        const order = orders.find(o => o.id === id);
        if (order) {
            await addToBin('order', [order]);
            await deleteDoc(doc(db, 'bookings', id));
        }
    };

    const deleteOrdersBulk = async (ids) => {
        // Firestore batch delete is ideal here, but sequential is easier to implement quickly
        for (const id of ids) {
            const order = orders.find(o => o.id === id);
            if (order) await deleteDoc(doc(db, 'bookings', id));
        }
    };

    // Recycle Bin
    const addToBin = async (type, items) => {
        for (const item of items) {
            await addDoc(collection(db, 'recycle_bin'), {
                type,
                originalId: item.id,
                data: item,
                deletedAt: new Date().toISOString()
            });
        }
    };

    const restoreItem = async (binId) => {
        const item = recycleBin.find(i => i.binId === binId);
        if (!item) return;

        if (item.type === 'customer') {
            await setDoc(doc(db, 'customers', item.originalId), item.data);
        } else if (item.type === 'order') {
            await setDoc(doc(db, 'bookings', item.originalId), item.data);
        }
        await deleteDoc(doc(db, 'recycle_bin', binId));
    };

    const permanentDelete = async (binId) => {
        await deleteDoc(doc(db, 'recycle_bin', binId));
    };

    const emptyRecycleBin = async () => {
        // Implement bulk delete
        // Skipping implementation for brevity
    };

    // Settings
    const updateSettings = async (newSettings) => {
        await setDoc(doc(db, 'settings', 'shop'), newSettings, { merge: true });
    };

    const updateWebpageSettings = async (newSettings) => {
        await setDoc(doc(db, 'settings', 'webpage'), newSettings, { merge: true });
    };

    // Partners
    const addPartner = async (partnerData) => {
        await addDoc(collection(db, 'partners'), partnerData);
    };
    const updatePartner = async (id, updates) => {
        await updateDoc(doc(db, 'partners', id), updates);
    };
    const deletePartner = async (id) => {
        await deleteDoc(doc(db, 'partners', id));
    };

    // Seed
    const seedDummyCustomers = async () => {
        // Implementation for seeding to Firestore if needed
        console.log("Seeding triggered - implement loop here if needed");
    };

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
            findCustomerByMobile,
            updateCustomer,
            deleteCustomer,
            addOrder,
            updateOrder,
            deleteOrder,
            deleteOrdersBulk,
            addToBin,
            restoreItem,
            permanentDelete,
            emptyRecycleBin,
            updateSettings,
            updateWebpageSettings,
            addPartner,
            updatePartner,
            deletePartner,
            seedDummyCustomers
        },
        shopSettings,
        webpageSettings,
        stats: getStats()
    };
};
