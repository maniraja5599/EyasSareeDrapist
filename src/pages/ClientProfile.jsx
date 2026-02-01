import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User, Save, RefreshCw, Ruler } from 'lucide-react';

const ClientProfile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        waist: '',
        hip: '',
        length: '',
        blouseSize: '',
        notes: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || user.displayName || '',
                mobile: user.mobile || user.phoneNumber || '',
                waist: user.measurements?.waist || '',
                hip: user.measurements?.hip || '',
                length: user.measurements?.length || '',
                blouseSize: user.measurements?.blouseSize || '',
                notes: user.measurements?.notes || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setMessage('');

        try {
            const userRef = doc(db, 'customers', user.uid);
            await setDoc(userRef, {
                name: formData.name,
                mobile: formData.mobile,
                measurements: {
                    waist: formData.waist,
                    hip: formData.hip,
                    length: formData.length,
                    blouseSize: formData.blouseSize,
                    notes: formData.notes
                }
            }, { merge: true });

            setMessage('Profile updated successfully!');
            // Optional: Reload window or user context might need refresh if not real-time
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please login to view your profile.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10 animate-fade-in">
                    <h1 className="text-4xl font-serif font-bold mb-4 text-gradient-primary">
                        Your Profile
                    </h1>
                    <p className="text-gray-600">
                        Manage your details and saree measurements
                    </p>
                </div>

                <div className="gradient-card animate-slide-up">
                    <form onSubmit={handleSave} className="space-y-8">

                        {/* Personal Info */}
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-primary-600" />
                                Personal Information
                            </h3>
                            <div>
                                <label className="label">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your Full Name"
                                    className="input-field"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="label">Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleChange}
                                    placeholder="Your Mobile Number"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="border-t border-gray-200"></div>

                        {/* Measurements */}
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Ruler className="w-5 h-5 text-primary-600" />
                                Saree Measurements (Inches)
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Waist Size</label>
                                    <input
                                        type="text"
                                        name="waist"
                                        value={formData.waist}
                                        onChange={handleChange}
                                        placeholder="e.g., 34"
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="label">Hip Size</label>
                                    <input
                                        type="text"
                                        name="hip"
                                        value={formData.hip}
                                        onChange={handleChange}
                                        placeholder="e.g., 40"
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="label">Saree Length / Height</label>
                                    <input
                                        type="text"
                                        name="length"
                                        value={formData.length}
                                        onChange={handleChange}
                                        placeholder="e.g., 5'4 or 42 inches"
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="label">Blouse Size</label>
                                    <input
                                        type="text"
                                        name="blouseSize"
                                        value={formData.blouseSize}
                                        onChange={handleChange}
                                        placeholder="e.g., 36"
                                        className="input-field"
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="label">Additional Notes</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Any specific preferences? e.g., 'Make it tight fit'"
                                    rows="3"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        {/* Status Message */}
                        {message && (
                            <div className={`p-4 rounded-xl text-center ${message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClientProfile;
