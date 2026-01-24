import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const Toast = ({ id, type = 'info', title, message, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setIsVisible(true));

        const timer = setTimeout(() => {
            setIsVisible(false); // Trigger exit animation
            setTimeout(() => onClose(id), 300); // Remove after animation
        }, 5000);

        return () => clearTimeout(timer);
    }, [id, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300);
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        error: <AlertTriangle className="w-5 h-5 text-red-500" />
    };

    const styles = {
        success: 'bg-green-50 border-green-100',
        warning: 'bg-yellow-50 border-yellow-100',
        info: 'bg-blue-50 border-blue-100',
        error: 'bg-red-50 border-red-100'
    };

    return (
        <div
            className={`flex items-start gap-4 p-4 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300 transform ${styles[type]} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}
            style={{ minWidth: '300px', maxWidth: '400px' }}
        >
            <div className="shrink-0 mt-0.5">
                {icons[type]}
            </div>
            <div className="flex-1">
                {title && <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>}
                <p className="text-sm text-gray-600 mt-0.5">{message}</p>
            </div>
            <button
                onClick={handleClose}
                className="shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors"
            >
                <X className="w-4 h-4 text-gray-400" />
            </button>
        </div>
    );
};

export default Toast;
