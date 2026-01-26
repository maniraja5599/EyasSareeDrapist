import { useEffect, useState } from 'react';

/**
 * Custom hook to persist and restore page state
 * Saves entire state object to localStorage
 * Restores state when component mounts
 * 
 * @param {string} key - Unique key for this page's state in localStorage
 * @param {object} initialState - Initial state if no saved state exists
 * @returns {[state, setState]} - State and setter function
 */
export const usePersistedState = (key, initialState) => {
    // Initialize state from localStorage or use initialState
    const [state, setState] = useState(() => {
        try {
            const savedState = localStorage.getItem(key);
            if (savedState) {
                return JSON.parse(savedState);
            }
        } catch (error) {
            console.error(`Error loading persisted state for ${key}:`, error);
        }
        return initialState;
    });

    // Save state to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error saving persisted state for ${key}:`, error);
        }
    }, [key, state]);

    return [state, setState];
};

/**
 * Clear persisted state for a specific page
 * @param {string} key - Key to clear from localStorage
 */
export const clearPersistedState = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error clearing persisted state for ${key}:`, error);
    }
};
