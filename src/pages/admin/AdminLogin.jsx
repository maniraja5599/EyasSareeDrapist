import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/admin');
        } catch (err) {
            setError('Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        alert("Password recovery instructions have been sent to manirajankg@gmail.com");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8 animate-fade-in">
                    <img src="/images/logo.png" alt="Eyas Drapist" className="w-24 h-24 mx-auto mb-4 object-contain drop-shadow-2xl" />
                    <h1 className="text-4xl font-serif font-bold text-white mb-2">Admin Login</h1>
                    <p className="text-gray-300">Access your dashboard</p>
                </div>

                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-white font-semibold mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-500/50 focus:border-primary-400 transition-all duration-300"
                                placeholder="eyas"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-white font-semibold mb-2">
                                <Lock className="w-4 h-4 inline mr-2" />
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary-500/50 focus:border-primary-400 transition-all duration-300"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/20 border border-red-400/30 rounded-xl">
                                <p className="text-red-200 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl shadow-primary-500/50 hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
