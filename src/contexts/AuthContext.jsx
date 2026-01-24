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

    // Mock login
    const login = async (username, password) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        if (username === 'eyas' && password === 'namakkal') {
            const mockUser = { uid: 'admin-001', username: 'eyas', email: 'manirajankg@gmail.com', role: 'admin' };
            setUser(mockUser);
            localStorage.setItem('eyas_admin_user', JSON.stringify(mockUser));
            return mockUser;
        }
        throw new Error('Invalid username or password');
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('eyas_admin_user');
    };

    const value = {
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
