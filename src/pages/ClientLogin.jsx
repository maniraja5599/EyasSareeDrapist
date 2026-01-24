import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ClientLogin = () => {
    const navigate = useNavigate();
    const { clientLogin } = useAuth();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        mobile: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await clientLogin(formData.mobile, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4 flex items-center justify-center">
            <div className="max-w-md w-full">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl font-serif font-bold mb-2 text-gradient-primary">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">Log in to manage your bookings</p>
                </div>

                <div className="glass-card animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="label">Mobile Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    required
                                    className="input-field pl-10"
                                    placeholder="Enter your registered mobile"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="input-field pl-10"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                <>
                                    Log In
                                    <ArrowRight className="w-5 h-5 inline ml-2" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-semibold text-primary-600 hover:text-primary-700">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientLogin;
