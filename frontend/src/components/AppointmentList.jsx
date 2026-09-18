import React, { useState } from 'react';
import { Filter, Trash2 } from 'lucide-react';
import { updateAppointmentStatus, deleteAppointment } from '../services/api';

export default function AppointmentList({
  appointments = [],
  activeFilter = 'All',
  setActiveFilter,
  onRefresh,
  onSuccess,
  onError,
}) {
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filterOptions = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateAppointmentStatus(id, newStatus);
      onSuccess(`Status updated to '${newStatus}'`);
      onRefresh();
    } catch (err) {
      onError(err.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    setDeletingId(id);
    try {
      await deleteAppointment(id);
      onSuccess('Appointment deleted successfully.');
      onRefresh();
    } catch (err) {
      onError(err.message || 'Failed to delete appointment.');
    } finally {
      setDeletingId(null);
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'badge-pending';
      case 'Confirmed':
        return 'badge-confirmed';
      case 'Completed':
        return 'badge-completed';
      case 'Cancelled':
        return 'badge-cancelled';
      default:
        return 'badge-pending';
    }
  };

  return (
    <div className="glass-card">
      <div className="section-tag">MANAGEMENT</div>
      
      {/* Header & Filter Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '1.6rem' }}>Appointment management</h2>

        {/* Filter Pill Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: '#eae7e0',
          padding: '4px',
          borderRadius: 'var(--radius-pill)'
        }}>
          {filterOptions.map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: activeFilter === status ? 'var(--btn-primary-bg)' : 'transparent',
                color: activeFilter === status ? '#ffffff' : 'var(--text-muted)',
                fontWeight: activeFilter === status ? '600' : '500',
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Table */}
      {appointments.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: 'var(--bg-subcard)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-muted)'
        }}>
          No appointments found for the selected filter.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service Details</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Notes</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app.id}>
                  {/* Customer Info */}
                  <td>
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{app.customer_name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{app.customer_phone}</div>
                  </td>

                  {/* Service Details */}
                  <td>
                    {app.service ? (
                      <div>
                        <div style={{ fontWeight: '600' }}>{app.service.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          NPR {app.service.price.toLocaleString()} • {app.service.duration} mins
                        </div>
                      </div>
                    ) : (
                      <span>Service #{app.service_id}</span>
                    )}
                  </td>

                  {/* Date & Time */}
                  <td>
                    <div style={{ fontWeight: '600' }}>{app.appointment_date}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{app.appointment_time}</div>
                  </td>

                  {/* Status Dropdown */}
                  <td>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      disabled={updatingId === app.id}
                      className={`badge ${getBadgeClass(app.status)}`}
                      style={{ cursor: 'pointer', outline: 'none' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Notes */}
                  <td style={{ maxWidth: '180px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {app.notes || '—'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(app.id)}
                      disabled={deletingId === app.id}
                      style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
