import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    // Initialize user from localStorage to persist session
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('eyas_admin_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(false);

    // Mock admin login
    const login = async (username, password) => {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (username === 'eyas' && password === 'namakkal') {
            const mockUser = { uid: 'admin-001', username: 'eyas', email: 'manirajankg@gmail.com', role: 'admin' };
            setUser(mockUser);
            localStorage.setItem('eyas_admin_user', JSON.stringify(mockUser));
            setLoading(false);
            return mockUser;
        }
        setLoading(false);
        throw new Error('Invalid username or password');
    };

    // Client Login
    const clientLogin = async (mobile, password) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const savedCustomers = localStorage.getItem('eyas_customers');
        const customers = savedCustomers ? JSON.parse(savedCustomers) : [];

        const foundCustomer = customers.find(c => c.mobile === mobile && c.password === password);

        if (foundCustomer) {
            const clientUser = { ...foundCustomer, role: 'client' };
            setUser(clientUser);
            localStorage.setItem('eyas_admin_user', JSON.stringify(clientUser));
            setLoading(false);
            return clientUser;
        }

        setLoading(false);
        throw new Error('Invalid Mobile Number or Password');
    };

    const setClientUser = (customerData) => {
        const clientUser = { ...customerData, role: 'client' };
        setUser(clientUser);
        localStorage.setItem('eyas_admin_user', JSON.stringify(clientUser));
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('eyas_admin_user');
    };

    const value = {
        user,
        loading,
        login,
        clientLogin,
        setClientUser,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
