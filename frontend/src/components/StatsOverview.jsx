import React from 'react';
import { Calendar, Clock, CheckCircle2, CheckCheck, Scissors } from 'lucide-react';

export default function StatsOverview({ appointments = [], services = [] }) {
  const total = appointments.length;
  const pending = appointments.filter(a => a.status === 'Pending').length;
  const confirmed = appointments.filter(a => a.status === 'Confirmed').length;
  const completed = appointments.filter(a => a.status === 'Completed').length;

  const stats = [
    {
      label: 'Total Appointments',
      value: total,
      icon: <Calendar size={20} color="#1b2432" />,
      bg: '#eef2f6',
    },
    {
      label: 'Pending',
      value: pending,
      icon: <Clock size={20} color="#854d0e" />,
      bg: '#fef9c3',
    },
    {
      label: 'Confirmed',
      value: confirmed,
      icon: <CheckCircle2 size={20} color="#1e40af" />,
      bg: '#dbeafe',
    },
    {
      label: 'Completed',
      value: completed,
      icon: <CheckCheck size={20} color="#166534" />,
      bg: '#dcfce7',
    },
    {
      label: 'Active Services',
      value: services.length,
      icon: <Scissors size={20} color="#6b21a8" />,
      bg: '#f3e8ff',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
      gap: '16px',
      marginBottom: '28px'
    }}>
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="glass-card"
          style={{
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {stat.label}
            </p>
            <h3 style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-primary)', marginTop: '2px' }}>
              {stat.value}
            </h3>
          </div>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: stat.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
