import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDataStore } from '../hooks/useDataStore';

const ClientSignup = () => {
    const navigate = useNavigate();
    const { setClientUser } = useAuth();
    const { actions } = useDataStore();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (formData.password.length < 4) {
            setError("Password must be at least 4 characters");
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            try {
                // Check if mobile already exists (basic check)
                const saved = localStorage.getItem('eyas_customers');
                const customers = saved ? JSON.parse(saved) : [];
                if (customers.some(c => c.mobile === formData.mobile)) {
                    throw new Error('Mobile number already registered. Please login.');
                }

                // Create customer in DataStore
                const newCustomer = actions.addCustomer({
                    name: formData.name,
                    mobile: formData.mobile,
                    email: formData.email,
                    address: formData.address,
                    password: formData.password, // Storing password locally for MVP
                    referral: 'Website Signup'
                });

                // Auto Login
                setClientUser(newCustomer);

                navigate('/');
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen py-12 px-4 flex items-center justify-center">
            <div className="max-w-md w-full">
                <div className="text-center mb-8 animate-fade-in">
                    <h1 className="text-4xl font-serif font-bold mb-2 text-gradient-primary">
                        Join Eyas Drapist
                    </h1>
                    <p className="text-gray-600">Create an account to book your saree draping instantly</p>
                </div>

                <div className="glass-card animate-slide-up">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="label">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="input-field pl-10"
                                    placeholder="Your Name"
                                />
                            </div>
                        </div>

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
                                    pattern="[0-9]{10}"
                                    className="input-field pl-10"
                                    placeholder="10-digit number"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Email (Optional)</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input-field pl-10"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Address (For Home Service)</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="2"
                                    className="input-field pl-10"
                                    placeholder="Your address"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                                        placeholder="Min 4 chars"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="label">Confirm</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="input-field pl-10"
                                        placeholder="Repeat"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full mt-6"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                <>
                                    Sign Up
                                    <ArrowRight className="w-5 h-5 inline ml-2" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                            Log In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientSignup;
