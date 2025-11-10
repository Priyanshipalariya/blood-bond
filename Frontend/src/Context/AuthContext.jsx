import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount and verify token
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('bloodBondUser');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // Verify token is still valid by fetching user data
          if (userData.token) {
            try {
              const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                  'Authorization': `Bearer ${userData.token}`
                }
              });
              if (response.ok) {
                const data = await response.json();
                const updatedUser = { ...data.user, token: userData.token };
                localStorage.setItem('bloodBondUser', JSON.stringify(updatedUser));
                setUser(updatedUser);
              } else {
                // Token invalid, clear storage
                localStorage.removeItem('bloodBondUser');
              }
            } catch (error) {
              console.error('Token verification failed:', error);
              localStorage.removeItem('bloodBondUser');
            }
          } else {
            setUser(userData);
          }
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('bloodBondUser');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Sign up with email and password
  const signUp = async (email, password, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          ...userData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Store user data with token
      const userToStore = {
        ...data.user,
        token: data.token,
        uid: data.user._id || data.user.uid
      };
      localStorage.setItem('bloodBondUser', JSON.stringify(userToStore));
      setUser(userToStore);

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      // Store user data with token
      const userToStore = {
        ...data.user,
        token: data.token,
        uid: data.user._id || data.user.uid
      };
      localStorage.setItem('bloodBondUser', JSON.stringify(userToStore));
      setUser(userToStore);

      return { success: true };
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  };

  // Sign out (alias for logout)
  const signOut = () => {
    localStorage.removeItem('bloodBondUser');
    setUser(null);
  };

  const logout = signOut; // Alias for compatibility

  // Legacy methods for phone OTP (kept for compatibility, but will use dummy auth)
  const sendOTP = async (phone, verifier) => {
    // Dummy implementation - just return a mock confirmation result
    return { 
      verificationId: 'dummy-verification-id',
      confirm: async (code) => {
        // For testing, accept any 6-digit code
        if (code && code.length === 6) {
          return { user: { uid: 'dummy-uid' } };
        }
        throw new Error('Invalid code');
      }
    };
  };

  const verifyOTPAndSignin = async (confirmationResult, otp) => {
    try {
      const result = await confirmationResult.confirm(otp);
      // Create a dummy user for phone auth
      const dummyUser = {
        email: `phone-${Date.now()}@example.com`,
        phone: 'phone',
        uid: result.user.uid || 'dummy-uid',
        fullName: 'Phone User'
      };
      localStorage.setItem('bloodBondUser', JSON.stringify(dummyUser));
      setUser(dummyUser);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const verifyOTPAndSignup = async (confirmationResult, otp, userData) => {
    try {
      const result = await confirmationResult.confirm(otp);
      // Create new user
      const newUser = {
        ...userData,
        uid: result.user.uid || Date.now().toString(),
        email: userData.email || `phone-${Date.now()}@example.com`
      };
      localStorage.setItem('bloodBondUser', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const checkPhoneForLogin = async (phone) => {
    // Dummy check - always return true for testing
    return true;
  };

  // Get user data (alias for user for compatibility)
  const userData = user;

  // Get user's blood requests from API
  const getUserBloodRequests = async (uid) => {
    if (!user) throw new Error('Not authenticated');
    try {
      const token = user.token || JSON.parse(localStorage.getItem('bloodBondUser'))?.token;
      const response = await fetch(`${API_BASE_URL}/blood-requests/user/${uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch blood requests');
      }
      return data.requests || [];
    } catch (error) {
      console.error('Get blood requests error:', error);
      return [];
    }
  };

  // Get blood request by ID
  const getBloodRequestById = async (requestId) => {
    if (!user) throw new Error('Not authenticated');
    try {
      const token = user.token || JSON.parse(localStorage.getItem('bloodBondUser'))?.token;
      const response = await fetch(`${API_BASE_URL}/blood-requests/${requestId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch blood request');
      }
      return data.request;
    } catch (error) {
      console.error('Get blood request error:', error);
      throw error;
    }
  };

  const updateBloodRequestStatus = async (requestId, status) => {
    if (!user) throw new Error('Not authenticated');
    try {
      const token = user.token || JSON.parse(localStorage.getItem('bloodBondUser'))?.token;
      const response = await fetch(`${API_BASE_URL}/blood-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update blood request status');
      }
      return data.success;
    } catch (error) {
      console.error('Update blood request status error:', error);
      throw error;
    }
  };

  const deleteBloodRequest = async (requestId) => {
    if (!user) throw new Error('Not authenticated');
    try {
      const token = user.token || JSON.parse(localStorage.getItem('bloodBondUser'))?.token;
      const response = await fetch(`${API_BASE_URL}/blood-requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete blood request');
      }
      return data.success;
    } catch (error) {
      console.error('Delete blood request error:', error);
      throw error;
    }
  };

  // Find available donors
  const findAvailableDonors = async (bloodType, pincode) => {
    try {
      const response = await fetch(`${API_BASE_URL}/donors/find?bloodType=${bloodType}&pincode=${pincode}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to find donors');
      }
      return data.donors || [];
    } catch (error) {
      console.error('Find donors error:', error);
      return [];
    }
  };

  // Refresh user data from API
  const refreshUserData = async () => {
    if (!user) return null;
    try {
      const token = user.token || JSON.parse(localStorage.getItem('bloodBondUser'))?.token;
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.user) {
        const updatedUser = {
          ...data.user,
          token: token,
          uid: data.user._id || data.user.uid
        };
        localStorage.setItem('bloodBondUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return updatedUser;
      }
      return user;
    } catch (error) {
      console.error('Refresh user data error:', error);
      return user;
    }
  };

  const value = {
    user,
    userData, // Alias for compatibility
    loading,
    signUp,
    signIn,
    signOut,
    logout, // Alias for compatibility
    sendOTP,
    verifyOTPAndSignin,
    verifyOTPAndSignup,
    checkPhoneForLogin,
    getUserBloodRequests,
    getBloodRequestById,
    updateBloodRequestStatus,
    deleteBloodRequest,
    findAvailableDonors,
    refreshUserData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

