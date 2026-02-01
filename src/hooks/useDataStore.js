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
            { id: 'prepleat', name: 'Pre-Pleating Only', price: 600, duration: '30-45 mins', discount: 50 },
            { id: 'draping', name: 'Draping Only', price: 1600, duration: '15-20 mins', discount: 50 },
            { id: 'both', name: 'Pre-Pleat + Draping', price: 3000, duration: 'Best Value', discount: 50 },
        ],
        googleSheetUrl: 'https://script.google.com/macros/s/AKfycbxh4ryqyOin4v2O_-_yf9zz911nq0-_OSNsTArZAY_ALDsr9e8fth0Gsog2C4sX04-D/exec' // URL for Google Sheet Web App
    });

    // --- Real-time Listeners ---

    useEffect(() => {
        const unsubCustomers = onSnapshot(collection(db, 'customers'), (snapshot) => {
            setCustomers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const unsubOrders = onSnapshot(query(collection(db, 'bookings'), orderBy('createdAt', 'desc')), (snapshot) => {
            setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const unsubRecycle = onSnapshot(query(collection(db, 'recycle_bin'), orderBy('deletedAt', 'desc')), (snapshot) => {
            setRecycleBin(snapshot.docs.map(doc => ({ binId: doc.id, ...doc.data() })));
        });

        const unsubPartners = onSnapshot(collection(db, 'partners'), (snapshot) => {
            setPartners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const unsubShop = onSnapshot(doc(db, 'settings', 'shop'), (doc) => {
            if (doc.exists()) setShopSettings(prev => ({ ...prev, ...doc.data() }));
        });

        const unsubWeb = onSnapshot(doc(db, 'settings', 'webpage'), (doc) => {
            if (doc.exists()) setWebpageSettings(prev => ({ ...prev, ...doc.data() }));
        });

        return () => {
            unsubCustomers();
            unsubOrders();
            unsubRecycle();
            unsubPartners();
            unsubShop();
            unsubWeb();
        };
    }, []);

    // --- Actions ---

    // Customers
    const addCustomer = async (customerData) => {
        const id = customerData.mobile; // Use mobile as ID
        await setDoc(doc(db, 'customers', id), {
            ...customerData,
            createdAt: new Date().toISOString(),
            totalOrders: 0
        });
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

    const findCustomerByMobile = (mobile) => {
        return customers.find(c => c.mobile === mobile);
    };

    // Orders

    const syncToGoogleSheet = async (orderData) => {
        if (!webpageSettings.googleSheetUrl) return;

        try {
            // Use no-cors mode to avoid CORS errors with Google Apps Script
            // Note: In no-cors mode, we can't read the response, but the request still sends.
            await fetch(webpageSettings.googleSheetUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
            console.log("Synced to Google Sheet");
        } catch (error) {
            console.error("Google Sheet Sync Error:", error);
        }
    };

    const addOrder = async (orderData) => {
        const timestamp = new Date().toISOString();
        const friendlyId = await generateBookingId(); // Generate EYS-1001

        const fullOrderData = {
            ...orderData,
            status: 'booked',
            paymentStatus: 'pending',
            createdAt: timestamp
        };

        // Use setDoc to define our own ID instead of auto-id
        await setDoc(doc(db, 'bookings', friendlyId), fullOrderData);

        // Link Customer
        if (orderData.customerId) {
            const customer = customers.find(c => c.id === orderData.customerId);
            if (customer) {
                await updateDoc(doc(db, 'customers', orderData.customerId), {
                    totalOrders: (customer.totalOrders || 0) + 1
                });
            }
        }

        // Sync to Google Sheet (Fire and forget)
        syncToGoogleSheet({ id: friendlyId, ...fullOrderData });

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
