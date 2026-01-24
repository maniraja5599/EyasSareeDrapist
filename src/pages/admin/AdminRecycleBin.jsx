import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useDataStore } from '../../hooks/useDataStore';
import { Trash2, RotateCcw, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const AdminRecycleBin = () => {
    const { recycleBin, actions } = useDataStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const filteredItems = recycleBin.filter(item => {
        const itemType = item.type;
        const itemName = item.data.name || item.data.customerName || 'Unknown';
        const itemId = item.data.id || '';

        return (
            itemType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            itemId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleRestore = (binId) => {
        actions.restoreItem(binId);
        setMessage({ type: 'success', text: 'Item restored successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handlePermanentDelete = (binId) => {
        if (window.confirm('Are you sure? This will delete the item PERMANENTLY. It cannot be undone.')) {
            actions.permanentDelete(binId);
        }
    };

    const handleEmptyBin = () => {
        if (window.confirm('Are you sure you want to empty the Recycle Bin? Everything will be lost forever.')) {
            actions.emptyRecycleBin();
            setMessage({ type: 'success', text: 'Recycle bin emptied.' });
        }
    };

    return (
        <AdminLayout>
            <div className="animate-slide-up">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Recycle Bin</h1>
                        <p className="text-gray-600">Recover deleted items or remove them permanently.</p>
                    </div>
                    {recycleBin.length > 0 && (
                        <button
                            onClick={handleEmptyBin}
                            className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Empty Bin
                        </button>
                    )}
                </div>

                {message.text && (
                    <div className="p-4 bg-green-100 text-green-700 rounded-xl mb-6 flex items-center gap-3 animate-fade-in">
                        <CheckCircle className="w-5 h-5" />
                        {message.text}
                    </div>
                )}

                {/* Filter */}
                <div className="gradient-card mb-6">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search deleted items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-12"
                        />
                    </div>
                </div>

                {/* Bin Items Table */}
                <div className="gradient-card overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Type</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Details</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Deleted Date</th>
                                <th className="text-right py-4 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <tr key={item.binId} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <span className={`badge ${item.type === 'customer' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                                                }`}>
                                                {item.type.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {item.data.name || item.data.customerName || 'Unknown Name'}
                                                </p>
                                                <p className="text-xs text-gray-500 font-mono">
                                                    ID: {item.originalId}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-gray-600">
                                            {new Date(item.deletedAt).toLocaleString()}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleRestore(item.binId)}
                                                    className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors flex items-center gap-1"
                                                    title="Restore"
                                                >
                                                    <RotateCcw className="w-4 h-4" /> Restore
                                                </button>
                                                <button
                                                    onClick={() => handlePermanentDelete(item.binId)}
                                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors flex items-center gap-1"
                                                    title="Delete Permanently"
                                                >
                                                    <Trash2 className="w-4 h-4" /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-12 text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <Trash2 className="w-12 h-12 text-gray-300 mb-2" />
                                            <p>The recycle bin is empty.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminRecycleBin;
