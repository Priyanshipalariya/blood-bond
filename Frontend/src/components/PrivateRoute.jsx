import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const PrivateRoute = ({ Component }) => {
  const { user, loading } = useAuth();
  
  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  return user ? <Component /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
