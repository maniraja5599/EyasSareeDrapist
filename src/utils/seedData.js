import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const seedDatabase = async () => {
    try {
        // Check if settings already exist
        const settingsRef = doc(db, 'settings', 'config');
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
            return { success: true, message: 'Settings already initialized' };
        }

        // Default Settings
        const defaultSettings = {
            companyName: 'Eyas Saree Pre-Pleating & Draping',
            contactNumber: '+91 98765 43210',
            whatsappNumber: '+91 98765 43210',
            upiId: '7502551633@ybl',
            address: '123, Fashion Street, Chennai, Tamil Nadu',
            services: [
                { id: 'prepleat', name: 'Only Pre-Pleating', price: 300, duration: '30-45 mins' },
                { id: 'draping', name: 'Only Draping', price: 600, duration: '15-20 mins' },
                { id: 'both', name: 'Complete Package', price: 800, duration: 'Best Value' }
            ],
            slots: ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'],
            updatedAt: new Date().toISOString()
        };

        await setDoc(settingsRef, defaultSettings);

        return { success: true, message: 'Database initialized with default settings' };
    } catch (error) {
        console.error('Error seeding database:', error);
        return { success: false, message: error.message };
    }
};
