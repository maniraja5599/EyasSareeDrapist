import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, ChevronRight, ChevronLeft, Sparkles, Scissors, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const BookingWizard = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        service: '',
        date: '',
        slot: '',
        name: '',
        phone: '',
        notes: ''
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const updateData = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleBook = async () => {
        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, "bookings"), {
                ...formData,
                status: 'Booked',
                createdAt: serverTimestamp(),
                paymentStatus: 'Pending',
                amount: formData.service === 'pre-pleat' ? 250 : formData.service === 'draping' ? 300 : 500
            });

            // Navigate to tracking or success with the ID
            // For now, let's just go to tracking page with the ID pre-filled or show it
            console.log('Booked with ID: ', docRef.id);
            // alert(`Booking Confirmed! ID: ${docRef.id}`); // Replace with better UI
            navigate('/track');
        } catch (e) {
            console.error("Error adding document: ", e);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderServiceSelection = () => (
        <div className="animate-fade-in">
            <h3 className="step-title">Select a Service</h3>
            <div className="grid-selection">
                {[
                    { id: 'pre-pleat', title: 'Pre-Pleating', icon: <Sparkles />, price: '₹250' },
                    { id: 'draping', title: 'Draping', icon: <Scissors />, price: '₹300' },
                    { id: 'combo', title: 'Combo Package', icon: <CheckCircle />, price: '₹500' }
                ].map((service) => (
                    <div
                        key={service.id}
                        className={`selection-card ${formData.service === service.id ? 'selected' : ''}`}
                        onClick={() => updateData('service', service.id)}
                    >
                        <div className="card-icon">{service.icon}</div>
                        <h4>{service.title}</h4>
                        <span className="price-tag">{service.price}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderSlotPicker = () => (
        <div className="animate-fade-in">
            <h3 className="step-title">Choose Date & Time</h3>
            <div className="input-group">
                <label>Date</label>
                <input
                    type="date"
                    className="form-input"
                    onChange={(e) => updateData('date', e.target.value)}
                    value={formData.date}
                />
            </div>
            <div className="slots-grid">
                {['10:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'].map(slot => (
                    <button
                        key={slot}
                        className={`slot-btn ${formData.slot === slot ? 'active' : ''}`}
                        onClick={() => updateData('slot', slot)}
                    >
                        {slot}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderDetails = () => (
        <div className="animate-fade-in">
            <h3 className="step-title">Your Details</h3>
            <div className="input-group">
                <input
                    type="text"
                    placeholder="Full Name"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => updateData('name', e.target.value)}
                />
            </div>
            <div className="input-group">
                <input
                    type="tel"
                    placeholder="Phone Number"
                    className="form-input"
                    value={formData.phone}
                    onChange={(e) => updateData('phone', e.target.value)}
                />
            </div>
            <div className="input-group">
                <textarea
                    placeholder="Special requests or saree type..."
                    className="form-input"
                    rows="3"
                    value={formData.notes}
                    onChange={(e) => updateData('notes', e.target.value)}
                />
            </div>
        </div>
    );

    const renderConfirmation = () => (
        <div className="animate-fade-in text-center">
            <div className="success-icon">
                <CheckCircle size={48} color="var(--primary-gold)" />
            </div>
            <h3 className="step-title">Confirm Booking</h3>
            <div className="summary-card glass-panel">
                <p><strong>Service:</strong> {formData.service}</p>
                <p><strong>Date:</strong> {formData.date} at {formData.slot}</p>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
            </div>
            <button
                className="btn-primary"
                style={{ marginTop: '20px', width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
                onClick={handleBook}
                disabled={loading}
            >
                {loading ? <Loader2 className="animate-spin" /> : 'Confirm & Book'}
            </button>
        </div>
    );

    return (
        <div className="booking-wizard glass-panel">
            <div className="wizard-progress">
                <div className="progress-bar" style={{ width: `${step * 25}%` }}></div>
            </div>

            <div className="wizard-content">
                {step === 1 && renderServiceSelection()}
                {step === 2 && renderSlotPicker()}
                {step === 3 && renderDetails()}
                {step === 4 && renderConfirmation()}
            </div>

            <div className="wizard-footer">
                {step > 1 && (
                    <button className="btn-secondary" onClick={prevStep}>
                        <ChevronLeft size={16} /> Back
                    </button>
                )}
                {step < 4 && (
                    <button className="btn-primary" onClick={nextStep} style={{ marginLeft: 'auto' }}>
                        Next <ChevronRight size={16} />
                    </button>
                )}
            </div>

            <style jsx="true">{`
        .booking-wizard {
          max-width: 500px;
          margin: 40px auto;
          padding: 30px;
          min-height: 500px;
          display: flex;
          flex-direction: column;
        }

        .wizard-progress {
          height: 4px;
          background: rgba(0,0,0,0.1);
          margin-bottom: 30px;
          border-radius: 2px;
        }

        .progress-bar {
          height: 100%;
          background: var(--primary-gold);
          transition: width 0.3s ease;
        }

        .step-title {
          font-size: 1.5rem;
          margin-bottom: 24px;
          color: var(--secondary-velvet);
          text-align: center;
        }

        .wizard-content {
          flex-grow: 1;
        }

        .grid-selection {
          display: grid;
          gap: 16px;
        }

        .selection-card {
          border: 1px solid rgba(0,0,0,0.1);
          padding: 16px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s;
        }

        .selection-card.selected {
          border-color: var(--primary-gold);
          background: rgba(212, 175, 55, 0.05);
          box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
        }

        .card-icon {
          color: var(--primary-gold);
        }

        .price-tag {
          margin-left: auto;
          font-weight: 600;
          color: var(--secondary-velvet);
        }

        .input-group {
          margin-bottom: 20px;
        }

        .input-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .form-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #DDD;
          border-radius: 8px;
          font-family: inherit;
          font-size: 1rem;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary-gold);
        }

        .slots-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .slot-btn {
          padding: 12px;
          border: 1px solid #DDD;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .slot-btn.active {
          background: var(--primary-gold);
          color: white;
          border-color: var(--primary-gold);
        }

        .wizard-footer {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
        }

        .summary-card {
           padding: 20px;
           text-align: left;
           background: rgba(255,255,255,0.5);
        }
      `}</style>
        </div>
    );
};

export default BookingWizard;
