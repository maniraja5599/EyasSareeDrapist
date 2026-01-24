// Date and Time utilities

// Format date for display
export const formatDate = (date) => {
    if (!date) return '';

    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

// Format date for input field (YYYY-MM-DD)
export const formatDateForInput = (date) => {
    if (!date) return '';

    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString().split('T')[0];
};

// Check if date is in the past
export const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate < today;
};

// Check if date is a holiday
export const isHoliday = (date, holidays = []) => {
    const dateStr = formatDateForInput(date);
    return holidays.includes(dateStr);
};

// Get available dates (exclude past dates and holidays)
export const getAvailableDates = (holidays = [], daysAhead = 30) => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < daysAhead; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);

        if (!isHoliday(date, holidays)) {
            dates.push(date);
        }
    }

    return dates;
};

// Generate booking ID
export const generateBookingId = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `EYS-${timestamp}${random}`.toUpperCase();
};

// Get status color
export const getStatusColor = (status) => {
    const colors = {
        booked: 'blue',
        received: 'indigo',
        in_progress: 'yellow',
        ready: 'green',
        delivered: 'purple',
        completed: 'gray'
    };

    return colors[status] || 'gray';
};

// Get payment status color
export const getPaymentStatusColor = (status) => {
    const colors = {
        pending: 'orange',
        advance: 'blue',
        paid: 'green'
    };

    return colors[status] || 'gray';
};
