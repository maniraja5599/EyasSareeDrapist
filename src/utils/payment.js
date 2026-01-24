// UPI Payment Link Generation
export const generateUPILink = (amount, bookingId, upiId = 'yourupi@bank') => {
    const params = new URLSearchParams({
        pa: upiId,
        pn: 'Eyas Drapist',
        am: amount.toString(),
        cu: 'INR',
        tn: `Order #${bookingId}`
    });
    return `upi://pay?${params.toString()}`;
};

// Generate deep links for popular UPI apps
export const generateUPIDeepLinks = (amount, bookingId, upiId) => {
    const baseLink = generateUPILink(amount, bookingId, upiId);

    return {
        gpay: `tez://upi/pay?${new URLSearchParams({ pa: upiId, pn: 'Eyas Drapist', am: amount, cu: 'INR', tn: `Order #${bookingId}` })}`,
        phonepe: `phonepe://pay?${new URLSearchParams({ pa: upiId, pn: 'Eyas Drapist', am: amount, cu: 'INR', tn: `Order #${bookingId}` })}`,
        paytm: `paytmmp://pay?${new URLSearchParams({ pa: upiId, pn: 'Eyas Drapist', am: amount, cu: 'INR', tn: `Order #${bookingId}` })}`,
        generic: baseLink
    };
};

// Format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};
