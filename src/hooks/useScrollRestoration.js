import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to save and restore scroll position
 * Saves scroll position when leaving a page
 * Restores it when coming back to the same page
 */
export const useScrollRestoration = () => {
    const location = useLocation();

    useEffect(() => {
        // Get saved scroll position for this path
        const savedPosition = sessionStorage.getItem(`scroll_${location.pathname}`);

        if (savedPosition) {
            // Restore scroll position after a short delay (for DOM to render)
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedPosition));
            }, 100);
        }

        // Save scroll position when leaving this page
        const handleScroll = () => {
            sessionStorage.setItem(`scroll_${location.pathname}`, window.scrollY.toString());
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            // Save final position when unmounting
            sessionStorage.setItem(`scroll_${location.pathname}`, window.scrollY.toString());
        };
    }, [location.pathname]);
};
