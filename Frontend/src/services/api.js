// API service file for Express/MongoDB backend

// Base API URL - update this when your backend is ready
// In Vite, use import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const user = localStorage.getItem('bloodBondUser');
  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.token;
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Blood Request Functions
export const createBloodRequest = async (userId, requestData) => {
  const response = await apiCall('/blood-requests', {
    method: 'POST',
    body: JSON.stringify(requestData),
  });
  return response.requestId || response.request._id;
};

export const findAvailableDonors = async (bloodType, pincode) => {
  try {
    console.log('Frontend: Searching for donors with:', { bloodType, pincode });
    const url = `/donors/find?bloodType=${encodeURIComponent(bloodType)}&pincode=${encodeURIComponent(pincode || '')}`;
    console.log('Frontend: API URL:', url);
    const response = await apiCall(url);
    console.log('Frontend: API Response:', response);
    console.log('Frontend: Found donors:', response.donors?.length || 0);
    return response.donors || [];
  } catch (error) {
    console.error('Frontend: Error finding donors:', error);
    return [];
  }
};

// Donor Registration Functions
export const recordDonorRegistration = async (userId, donorData) => {
  try {
    console.log('API call - recordDonorRegistration:', { userId, donorData });
    const response = await apiCall('/donors/register', {
      method: 'POST',
      body: JSON.stringify(donorData),
    });
    console.log('API response:', response);
    return response.success;
  } catch (error) {
    console.error('Error in recordDonorRegistration:', error);
    throw error;
  }
};

export const checkDonationEligibility = async (userId) => {
  const response = await apiCall(`/donors/eligibility/${userId}`);
  return {
    canDonate: response.canDonate,
    reason: response.reason
  };
};

export const getNearbyBloodCamps = async (state, district) => {
  const queryParams = new URLSearchParams();
  if (state) queryParams.append('state', state);
  if (district) queryParams.append('district', district);
  
  const response = await apiCall(`/blood-camps?${queryParams.toString()}`);
  return response.camps || [];
};

export const getUserDonationHistory = async (userId) => {
  const response = await apiCall(`/donations/user/${userId}`);
  return response.donations || [];
};

export const cancelDonorRegistration = async (userId) => {
  const response = await apiCall(`/donors/cancel/${userId}`, {
    method: 'DELETE',
  });
  return response.success;
};

// User Document Functions
export const updateUserDocument = async (userId, userData) => {
  const response = await apiCall('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
  return response.success;
};

// Blood Camp Functions (Admin)
export const createBloodCamp = async (campData) => {
  const response = await apiCall('/blood-camps', {
    method: 'POST',
    body: JSON.stringify(campData),
  });
  return response.success;
};

// Get user's blood requests
export const getUserBloodRequests = async (userId) => {
  const response = await apiCall(`/blood-requests/user/${userId}`);
  return response.requests || [];
};

// Get blood request by ID
export const getBloodRequestById = async (requestId) => {
  const response = await apiCall(`/blood-requests/${requestId}`);
  return response.request;
};

// Update blood request status
export const updateBloodRequestStatus = async (requestId, status) => {
  const response = await apiCall(`/blood-requests/${requestId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return response.success;
};

// Delete blood request
export const deleteBloodRequest = async (requestId) => {
  const response = await apiCall(`/blood-requests/${requestId}`, {
    method: 'DELETE',
  });
  return response.success;
};
