// API base URL for Django backend
const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * Generic helper for handling fetch requests
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // 204 No Content has no body
    if (response.status === 204) {
      return { success: true };
    }

    const data = await response.json();

    if (!response.ok) {
      // Extract custom error message from backend if available
      const errorMessage = data.error || data.detail || (typeof data === 'object' ? JSON.stringify(data) : 'An error occurred');
      throw new Error(errorMessage);
    }

    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

// -------------------------------------------------------------------
// Services API Calls
// -------------------------------------------------------------------

export async function fetchServices() {
  return request('/services');
}

export async function createService(serviceData) {
  return request('/services', {
    method: 'POST',
    body: JSON.stringify(serviceData),
  });
}

export async function updateService(id, serviceData) {
  return request(`/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serviceData),
  });
}

export async function deleteService(id) {
  return request(`/services/${id}`, {
    method: 'DELETE',
  });
}

// -------------------------------------------------------------------
// Appointments API Calls
// -------------------------------------------------------------------

export async function fetchAppointments(status = 'All') {
  const query = status && status !== 'All' ? `?status=${encodeURIComponent(status)}` : '';
  return request(`/appointments${query}`);
}

export async function createAppointment(appointmentData) {
  return request('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData),
  });
}

export async function updateAppointmentStatus(id, newStatus) {
  return request(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: newStatus }),
  });
}

export async function deleteAppointment(id) {
  return request(`/appointments/${id}`, {
    method: 'DELETE',
  });
}
