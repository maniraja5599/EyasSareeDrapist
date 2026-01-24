import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useDataStore } from '../../hooks/useDataStore';
import { Search, Plus, Edit, Trash2, X, Users, Briefcase, Percent } from 'lucide-react';

const AdminPartners = () => {
    const { partners, actions } = useDataStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: 'Makeup Artist',
        commissionType: 'percentage', // percentage | fixed
        value: 0
    });

    const filteredPartners = (partners || []).filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (partner = null) => {
        if (partner) {
            setEditingPartner(partner);
            setFormData(partner);
        } else {
            setEditingPartner(null);
            setFormData({
                name: '',
                category: 'Makeup Artist',
                commissionType: 'percentage',
                value: 0
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editingPartner) {
            actions.updatePartner(editingPartner.id, formData);
        } else {
            actions.addPartner(formData);
        }
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this partner?')) {
            actions.deletePartner(id);
        }
    };

    return (
        <AdminLayout>
            <div className="animate-slide-up">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Partners & References</h1>
                        <p className="text-gray-600">Manage Makeup Artists and other referral sources.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Add Partner
                    </button>
                </div>

                {/* Search */}
                <div className="gradient-card mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search partners..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-12"
                        />
                    </div>
                </div>

                {/* Partners List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPartners.length > 0 ? (
                        filteredPartners.map(partner => (
                            <div key={partner.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
                                        <Briefcase className="w-6 h-6" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenModal(partner)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(partner.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{partner.name}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                        {partner.category}
                                    </span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Commission/Discount</span>
                                    <span className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                        {partner.commissionType === 'percentage' ? `${partner.value}%` : `₹${partner.value}`}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                            <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>No partners added yet. Add MUAs here.</p>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingPartner ? 'Edit Partner' : 'New Partner'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="p-6 space-y-4">
                                <div>
                                    <label className="label">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        placeholder="e.g. Glam by Geetha"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="label">Category</label>
                                    <select
                                        className="input-field"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Makeup Artist">Makeup Artist</option>
                                        <option value="Event Planner">Event Planner</option>
                                        <option value="Photographer">Photographer</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Type</label>
                                        <select
                                            className="input-field"
                                            value={formData.commissionType}
                                            onChange={e => setFormData({ ...formData, commissionType: e.target.value })}
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (₹)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Value</label>
                                        <input
                                            type="number"
                                            required
                                            className="input-field"
                                            placeholder="e.g. 10"
                                            value={formData.value}
                                            onChange={e => setFormData({ ...formData, value: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">Save Partner</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminPartners;
