import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { createAppointment } from '../services/api';

export default function AppointmentForm({ services = [], onSuccess, onError }) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    service_id: services.length > 0 ? services[0].id : '',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '10:00',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [conflictError, setConflictError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setConflictError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConflictError('');

    if (!formData.customer_name.trim()) {
      onError('Please enter customer name.');
      return;
    }

    if (!formData.customer_phone.trim()) {
      onError('Please enter customer phone number.');
      return;
    }

    if (!formData.service_id) {
      onError('Please select a service.');
      return;
    }

    if (!formData.appointment_date || !formData.appointment_time) {
      onError('Please select appointment date and time.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customer_name: formData.customer_name.trim(),
        customer_phone: formData.customer_phone.trim(),
        service_id: parseInt(formData.service_id, 10),
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time.length === 5 ? `${formData.appointment_time}:00` : formData.appointment_time,
        notes: formData.notes.trim(),
      };

      await createAppointment(payload);
      onSuccess('Appointment booked successfully!');

      // Reset form
      setFormData({
        customer_name: '',
        customer_phone: '',
        service_id: services.length > 0 ? services[0].id : '',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: '10:00',
        notes: '',
      });
    } catch (err) {
      const msg = err.message || 'Failed to book appointment.';
      setConflictError(msg);
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="section-tag">APPOINTMENTS</div>
      <h2 style={{ fontSize: '1.6rem', marginBottom: '24px' }}>Create a booking</h2>

      {/* Conflict Alert Box */}
      {conflictError && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          borderRadius: 'var(--radius-sm)',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#991b1b'
        }}>
          <AlertTriangle size={22} style={{ shrink: 0 }} />
          <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
            {conflictError}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Customer name</label>
            <input
              type="text"
              name="customer_name"
              className="form-control"
              placeholder="Full name"
              value={formData.customer_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Customer phone</label>
            <input
              type="text"
              name="customer_phone"
              className="form-control"
              placeholder="+977"
              value={formData.customer_phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Select service</label>
          <select
            name="service_id"
            className="form-control"
            value={formData.service_id}
            onChange={handleChange}
            required
          >
            {services.length === 0 ? (
              <option value="">Choose a service</option>
            ) : (
              services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — NPR {s.price} ({s.duration} minutes)
                </option>
              ))
            )}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Appointment date</label>
            <input
              type="date"
              name="appointment_date"
              className="form-control"
              value={formData.appointment_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Appointment time</label>
            <input
              type="time"
              name="appointment_time"
              className="form-control"
              value={formData.appointment_time}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            rows="3"
            className="form-control"
            placeholder="Optional notes"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading || services.length === 0}
          style={{ width: '100%', marginTop: '8px' }}
        >
          {loading ? 'Booking...' : 'Book appointment'}
        </button>
      </form>
    </div>
  );
}
