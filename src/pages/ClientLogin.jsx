import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ClientLogin = () => {
    const navigate = useNavigate();
    const { loginWithGoogle } = useAuth();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    return (
        <div className="min-h-screen py-12 px-4 flex items-center justify-center">
            <div className="max-w-md w-full">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2 text-gradient-primary">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">Log in to manage your bookings</p>
                </div>

                <div className="glass-card animate-slide-up">
                    <div className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={async () => {
                                try {
                                    setLoading(true);
                                    setError('');
                                    await loginWithGoogle();
                                    navigate('/');
                                } catch (error) {
                                    console.error("Google Login Error:", error);

                                    // Provide specific error messages
                                    let errorMessage = "Google Sign-In Failed";

                                    if (error.code === 'auth/popup-closed-by-user') {
                                        errorMessage = "Sign-in popup was closed. Please try again.";
                                    } else if (error.code === 'auth/popup-blocked') {
                                        errorMessage = "Pop-up blocked by browser. Please allow pop-ups and try again.";
                                    } else if (error.code === 'auth/cancelled-popup-request') {
                                        errorMessage = "Sign-in cancelled. Please try again.";
                                    } else if (error.code === 'auth/network-request-failed') {
                                        errorMessage = "Network error. Please check your connection.";
                                    } else if (error.message) {
                                        errorMessage = error.message;
                                    }

                                    setError(errorMessage);
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            disabled={loading}
                            className="w-full bg-white text-gray-900 border border-gray-300 font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:bg-gray-50 hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                            ) : (
                                <>
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                                    <span className="text-lg">Sign in with Google</span>
                                </>
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-xs text-gray-500 mt-4">
                                Secure login powered by Google. No password required.
                            </p>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default ClientLogin;
