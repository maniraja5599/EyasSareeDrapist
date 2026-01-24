import { useState, useEffect } from 'react';

// Mock Data
const MOCK_BOOKINGS = [
    {
        id: 'B001',
        customerName: 'Test User',
        service: 'Pre-Pleating',
        status: 'ready',
        paymentStatus: 'paid',
        price: 250,
        date: new Date().toISOString().split('T')[0], // Today
        slotTime: '10:00 AM',
        createdAt: new Date().toISOString()
    },
    {
        id: 'B002',
        customerName: 'New User',
        service: 'Draping',
        status: 'in_progress',
        paymentStatus: 'pending',
        price: 300,
        date: new Date().toISOString().split('T')[0], // Today
        slotTime: '11:00 AM',
        createdAt: new Date(Date.now() - 86400000).toISOString()
    }
];

const MOCK_CUSTOMERS = [
    { id: 'C001', name: 'Test User', mobile: '9876543210', email: 'test@example.com' }
];

const MOCK_SETTINGS = {
    capacityPerSlot: 3
};

// Hook to get all bookings with optional filters
export const useBookings = (filters = {}) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate network delay
        setTimeout(() => {
            let data = [...MOCK_BOOKINGS];
            // Simple mock filtering
            if (filters.status) data = data.filter(b => b.status === filters.status);

            setBookings(data);
            setLoading(false);
        }, 500);
    }, [JSON.stringify(filters)]);

    return { bookings, loading, error };
};

// Hook to get a single booking
export const useBooking = (bookingId) => {
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            const found = MOCK_BOOKINGS.find(b => b.id === bookingId);
            setBooking(found || null);
            setLoading(false);
        }, 500);
    }, [bookingId]);

    return { booking, loading, error };
};

// Hook to get customers
export const useCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setCustomers(MOCK_CUSTOMERS);
            setLoading(false);
        }, 500);
    }, []);

    return { customers, loading, error };
};

// Hook to get settings
export const useSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setSettings(MOCK_SETTINGS);
            setLoading(false);
        }, 500);
    }, []);

    return { settings, loading, error };
};

// Hook to check slot availability
export const useSlotAvailability = (date, slot) => {
    const [available, setAvailable] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setAvailable(true); // Always available in mock
            setLoading(false);
        }, 300);
    }, [date, slot]);

    return { available, loading };
};
