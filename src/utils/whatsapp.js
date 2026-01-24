// WhatsApp Message Templates and Functions

// Booking Confirmation Message
export const generateBookingConfirmation = (booking) => {
    const { id, customerName, serviceType, date, slotTime } = booking;
    const serviceNames = {
        prepleat: 'Saree Pre-Pleating',
        draping: 'Saree Draping',
        both: 'Pre-Pleating + Draping Combo'
    };

    return `Hi ${customerName},

Your booking is confirmed! 🎉

Booking ID: ${id}
Service: ${serviceNames[serviceType] || serviceType}
Date: ${new Date(date).toLocaleDateString('en-IN')}
Time: ${slotTime}

We'll send you a reminder before your slot.

- Eyas Drapist, Namakkal`;
};

// Order Ready Message with Payment Link
export const generateReadyMessage = (booking, paymentLink) => {
    const { customerName, serviceType, amount, pickupRequired, address } = booking;
    const serviceNames = {
        prepleat: 'Pre-Pleating',
        draping: 'Draping',
        both: 'Pre-Pleating + Draping'
    };

    return `Hi ${customerName},

Your saree is READY! ✨

Service: ${serviceNames[serviceType] || serviceType}
Amount: ₹${amount}

Pay now: ${paymentLink}

${pickupRequired ? `Pickup Address: ${address}` : 'We will notify you for delivery.'}

- Eyas Drapist`;
};

// Reminder Message
export const generateReminderMessage = (booking) => {
    const { customerName, date, slotTime, address } = booking;

    return `Hi ${customerName},

Reminder: Your booking is scheduled for tomorrow.

Date: ${new Date(date).toLocaleDateString('en-IN')}
Time: ${slotTime}
Location: ${address}

Looking forward to serving you!

- Eyas Drapist`;
};

// Payment Received Message
export const generatePaymentReceivedMessage = (booking) => {
    const { customerName, amount } = booking;

    return `Hi ${customerName},

Payment of ₹${amount} received successfully! ✅

Thank you for choosing Eyas Drapist. We look forward to serving you again!

- Eyas Drapist`;
};

// Open WhatsApp with message
export const openWhatsApp = (phoneNumber, message) => {
    // Remove any non-digit characters except +
    const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
};

// Format phone number for WhatsApp (add country code if missing)
export const formatPhoneForWhatsApp = (phone) => {
    const cleanPhone = phone.replace(/[^\d]/g, '');

    // If doesn't start with country code, add Indian code
    if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
        return `91${cleanPhone}`;
    }

    return cleanPhone;
};
