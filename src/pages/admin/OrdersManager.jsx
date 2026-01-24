import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { MoreHorizontal, Filter, Loader2 } from 'lucide-react';

const OrdersManager = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const bookingsArray = [];
            querySnapshot.forEach((doc) => {
                bookingsArray.push({ id: doc.id, ...doc.data() });
            });
            setBookings(bookingsArray);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            const bookingRef = doc(db, "bookings", id);
            await updateDoc(bookingRef, {
                status: newStatus
            });
        } catch (e) {
            console.error("Error updating status: ", e);
            alert("Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Booked': return '#3B82F6'; // Blue
            case 'In Progress': return '#F59E0B'; // Orange
            case 'Ready': return '#10B981'; // Green
            case 'Completed': return '#6B7280'; // Gray
            default: return '#6B7280';
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Loader2 className="animate-spin" size={40} color="var(--primary-gold)" />
            </div>
        );
    }

    return (
        <div className="orders-page animate-fade-in">
            <div className="page-header">
                <h1>Orders Manager</h1>
                <button className="btn-secondary-outline" style={{ color: 'var(--text-dark)', borderColor: '#DDD' }}>
                    <Filter size={16} /> Filter
                </button>
            </div>

            <div className="orders-table-container glass-panel">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Service</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td className="font-mono">{booking.id.slice(0, 8)}...</td>
                                <td>
                                    <div className="customer-cell">
                                        <span className="font-bold">{booking.name}</span>
                                        <span className="text-muted">{booking.phone}</span>
                                    </div>
                                </td>
                                <td>{booking.service}</td>
                                <td>{booking.date} <br /><span className="text-muted text-sm">{booking.slot}</span></td>
                                <td>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(booking.status) + '20', color: getStatusColor(booking.status) }}
                                    >
                                        {booking.status}
                                    </span>
                                </td>
                                <td>₹{booking.amount}</td>
                                <td>
                                    <select
                                        className="status-select"
                                        value={booking.status}
                                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                                    >
                                        <option value="Booked">Booked</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Ready">Ready</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center p-8 text-muted">No bookings found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style jsx="true">{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .orders-table-container {
          overflow-x: auto;
          background: white;
          padding: 0;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }

        .orders-table th, .orders-table td {
          padding: 16px 24px;
          text-align: left;
          border-bottom: 1px solid #F0F0F0;
        }

        .orders-table th {
          background-color: #FAFAFA;
          font-weight: 600;
          color: var(--text-muted);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .customer-cell {
          display: flex;
          flex-direction: column;
        }

        .font-mono {
          font-family: monospace;
          color: var(--text-muted);
        }

        .font-bold {
          font-weight: 600;
        }
        
        .text-muted {
          color: #999;
          font-size: 0.9em;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .status-select {
          padding: 6px 12px;
          border-radius: 8px;
          border: 1px solid #DDD;
          background: white;
          cursor: pointer;
        }

        .status-select:focus {
          border-color: var(--primary-gold);
          outline: none;
        }
      `}</style>
        </div>
    );
};

export default OrdersManager;
