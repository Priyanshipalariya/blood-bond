import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const PublicRoute = ({ Component }) => {
  const { user, loading } = useAuth();
  
  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }
  
  // If user is logged in, redirect to home page
  return user ? <Navigate to="/" replace /> : <Component />;
};

export default PublicRoute;

