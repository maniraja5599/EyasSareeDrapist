import emailjs from '@emailjs/browser';

// Service configuration
// Replace these with your actual keys from EmailJS dashboard
const SERVICE_ID = 'service_ReplaceWithYours';
const TEMPLATE_ID = 'template_ReplaceWithYours';
const PUBLIC_KEY = 'public_ReplaceWithYours';

export const sendCredentialsEmail = async (email, username, password) => {
    try {
        const templateParams = {
            to_email: email,
            username: username,
            password: password,
            current_year: new Date().getFullYear(),
        };

        const response = await emailjs.send(
            SERVICE_ID,
            TEMPLATE_ID,
            templateParams,
            PUBLIC_KEY
        );

        console.log('SUCCESS!', response.status, response.text);
        return { success: true };
    } catch (error) {
        console.error('FAILED...', error);
        return { success: false, error };
    }
};
