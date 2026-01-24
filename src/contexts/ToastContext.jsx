import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext({});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((title, BAody, type = 'info') => {
        const id = Date.now().toString();
        // Allow passing just message as first arg if title is omitted (optional flexibility)
        const toast = {
            id,
            title: title,
            message: BAody,
            type
        };
        setToasts(prev => [...prev, toast]);
    }, []);

    const showToast = (title, message, type) => addToast(title, message, type);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
                {/* Pointer events auto so toasts are clickable but container is not */}
                <div className="contents pointer-events-auto">
                    {toasts.map(toast => (
                        <Toast
                            key={toast.id}
                            {...toast}
                            onClose={removeToast}
                        />
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
};
