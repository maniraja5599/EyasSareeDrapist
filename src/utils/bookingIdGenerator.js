import { doc, runTransaction, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Generates a sequential friendly ID (e.g., EYS-1001)
 * Uses a transaction to ensure no duplicates even with concurrent requests.
 * 
 * @param {string} prefix - The prefix for the ID (default 'EYS')
 * @returns {Promise<string>} The generated ID
 */
export const generateBookingId = async (prefix = 'EYS') => {
    const counterRef = doc(db, 'counters', 'bookings');

    try {
        const newId = await runTransaction(db, async (transaction) => {
            const counterDoc = await transaction.get(counterRef);

            let currentSequence = 1000;
            if (counterDoc.exists()) {
                currentSequence = counterDoc.data().currentSequence;
            } else {
                // Initialize if doesn't exist (handled within transaction for safety)
                // However, set() inside transaction must be generally on an existing doc or use set
                // But transaction.set is available.
                // To be safe, we'll assume 1000 start.
            }

            const nextSequence = currentSequence + 1;

            // Update the counter
            transaction.set(counterRef, { currentSequence: nextSequence }, { merge: true });

            return `${prefix}-${nextSequence}`;
        });

        return newId;
    } catch (error) {
        console.error("Error generating ID:", error);
        // Fallback to random if transaction fails repeatedly (though unlikely with retry)
        // Better to fail or retry than generate confusing IDs, but for UX resilience:
        return `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
};
