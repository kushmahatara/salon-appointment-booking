import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createService, updateService, deleteService } from '../services/api';

export default function ServiceList({ services = [], onRefresh, onSuccess, onError }) {
  const [editingService, setEditingService] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', duration: '' });
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      onError('Service name is required.');
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      onError('Service price must be greater than 0 NPR.');
      return;
    }

    const durationNum = parseInt(formData.duration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      onError('Service duration must be greater than 0 minutes.');
      return;
    }

    setLoading(true);

    try {
      await createService({
        name: formData.name.trim(),
        price: priceNum,
        duration: durationNum,
      });

      onSuccess('Service created successfully!');
      setFormData({ name: '', price: '', duration: '' });
      onRefresh();
    } catch (err) {
      onError(err.message || 'Failed to create service.');
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString(),
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingService) return;

    const priceNum = parseFloat(formData.price);
    const durationNum = parseInt(formData.duration, 10);

    setLoading(true);
    try {
      await updateService(editingService.id, {
        name: formData.name.trim(),
        price: priceNum,
        duration: durationNum,
      });

      onSuccess('Service updated successfully!');
      setIsEditModalOpen(false);
      setEditingService(null);
      setFormData({ name: '', price: '', duration: '' });
      onRefresh();
    } catch (err) {
      onError(err.message || 'Failed to update service.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    setDeletingId(id);
    try {
      await deleteService(id);
      onSuccess('Service deleted successfully.');
      onRefresh();
    } catch (err) {
      onError(err.message || 'Failed to delete service.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="glass-card" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="section-tag">SERVICES</div>
      <h2 style={{ fontSize: '1.6rem', marginBottom: '24px' }}>Add a service</h2>

      {/* Add Service Inline Form */}
      <form onSubmit={handleCreateSubmit} style={{ marginBottom: '32px' }}>
        <div className="form-group">
          <label className="form-label">Service name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Haircut"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Price</label>
            <input
              type="number"
              step="0.01"
              min="1"
              className="form-control"
              placeholder="e.g. 500"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Duration (minutes)</label>
            <input
              type="number"
              min="1"
              className="form-control"
              placeholder="e.g. 30"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
          style={{ width: '100%', marginTop: '4px' }}
        >
          {loading ? 'Creating service...' : 'Create service'}
        </button>
      </form>

      {/* Service List Sub-Cards (matching screenshot) */}
      <div>
        {services.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
            No services added yet.
          </p>
        ) : (
          services.map((service) => (
            <div key={service.id} className="sub-card">
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {service.name}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  NPR {service.price.toLocaleString()} • {service.duration} minutes
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  className="btn-secondary"
                  onClick={() => openEditModal(service)}
                >
                  Edit
                </button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(service.id)}
                  disabled={deletingId === service.id}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Service Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Service</h3>
              <button className="btn-icon" onClick={() => setIsEditModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Service name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Price (NPR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
