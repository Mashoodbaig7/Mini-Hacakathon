const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('adminToken');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
};

export const eventAPI = {
  // Submit event request
  submitRequest: async (requestData) => {
    return apiCall('/request', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  // Admin login
  adminLogin: async (credentials) => {
    return apiCall('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get all requests (admin)
  getAllRequests: async () => {
    return apiCall('/requests');
  },

  // Accept request
  acceptRequest: async (id) => {
    return apiCall(`/request/${id}/accept`, {
      method: 'PUT',
    });
  },

  // Decline request
  declineRequest: async (id) => {
    return apiCall(`/request/${id}/decline`, {
      method: 'PUT',
    });
  },

  // Update appointment
  updateAppointment: async (id, updatedDate) => {
    return apiCall(`/request/${id}/updateappointment`, {
      method: 'PUT',
      body: JSON.stringify({ updatedDate }),
    });
  },
};