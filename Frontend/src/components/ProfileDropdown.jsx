import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaUser, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import useToast from "../hooks/useToast";
import Toast from "../components/Toast";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, userData, logout } = useAuth();
  const navigate = useNavigate();
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      showSuccess("You have been logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      showError("Failed to logout. Please try again.");
    }
  };

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate("/profile");
  };

  const handleLoginClick = () => {
    setIsOpen(false);
    navigate("/login");
  };

  const handleSignupClick = () => {
    setIsOpen(false);
    navigate("/signup");
  };

  return (
    <>
      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      
      <div className="relative" ref={dropdownRef}>
      {/* Profile Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-red-700 hover:text-red-800 transition-colors duration-200"
        aria-label="Profile menu"
      >
        <FaUserCircle className="text-2xl md:text-3xl" />
        {user && userData && (
          <span className="hidden md:block text-sm font-medium">
            {userData.fullName || userData.displayName || "User"}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {user ? (
            // Logged in user options
            <>
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {userData?.fullName || userData?.displayName || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userData?.phone || user?.phoneNumber || "No phone"}
                </p>
              </div>
              
              <button
                onClick={handleProfileClick}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <FaUser className="text-sm" />
                View Profile
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <FaSignOutAlt className="text-sm" />
                Logout
              </button>
            </>
          ) : (
            // Not logged in user options
            <>
              <button
                onClick={handleLoginClick}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <FaSignInAlt className="text-sm" />
                Login
              </button>
              
              <button
                onClick={handleSignupClick}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <FaUserPlus className="text-sm" />
                Sign Up
              </button>
            </>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default ProfileDropdown;






