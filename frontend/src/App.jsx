import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsOverview from './components/StatsOverview';
import AppointmentList from './components/AppointmentList';
import AppointmentForm from './components/AppointmentForm';
import ServiceList from './components/ServiceList';
import Toast from './components/Toast';
import { fetchAppointments, fetchServices } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'booking' | 'services'
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Toast alert state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showSuccess = (msg) => setToast({ message: msg, type: 'success' });
  const showError = (msg) => setToast({ message: msg, type: 'error' });
  const closeToast = () => setToast({ message: '', type: 'success' });

  // Load initial services & appointments
  const loadData = async () => {
    setLoading(true);
    try {
      const [servicesData, appointmentsData] = await Promise.all([
        fetchServices(),
        fetchAppointments(statusFilter),
      ]);
      setServices(servicesData);
      setAppointments(appointmentsData);
    } catch (err) {
      console.error("Failed to load initial data:", err);
      showError("Could not connect to backend server. Ensure Django server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleBookingSuccess = (msg) => {
    showSuccess(msg);
    loadData();
  };

  return (
    <div className="app-container">
      {/* Toast Floating Notification */}
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      {/* Salon Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Top Metrics Overview Bar */}
      <StatsOverview appointments={appointments} services={services} />

      {/* Dynamic Main View */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* If 'appointments' (Dashboard view) -> Show side-by-side forms and full table below (matches reference image) */}
        {activeTab === 'appointments' && (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '28px',
              alignItems: 'start'
            }}>
              <ServiceList
                services={services}
                onRefresh={loadData}
                onSuccess={showSuccess}
                onError={showError}
              />
              <AppointmentForm
                services={services}
                onSuccess={handleBookingSuccess}
                onError={showError}
              />
            </div>

            <AppointmentList
              appointments={appointments}
              activeFilter={statusFilter}
              setActiveFilter={setStatusFilter}
              onRefresh={loadData}
              onSuccess={showSuccess}
              onError={showError}
            />
          </>
        )}

        {/* If 'booking' tab selected */}
        {activeTab === 'booking' && (
          <AppointmentForm
            services={services}
            onSuccess={handleBookingSuccess}
            onError={showError}
          />
        )}

        {/* If 'services' tab selected */}
        {activeTab === 'services' && (
          <ServiceList
            services={services}
            onRefresh={loadData}
            onSuccess={showSuccess}
            onError={showError}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '60px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        <p>Salon Appointment Booking System &copy; 2026. Built with Django REST Framework & React Vite.</p>
      </footer>
    </div>
  );
}
