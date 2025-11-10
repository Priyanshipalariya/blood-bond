import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import { GiHeartDrop } from "react-icons/gi";
import { FaUser, FaPhone, FaCalendarAlt, FaTint, FaEnvelope, FaClock } from "react-icons/fa";
import useToast from "../hooks/useToast";
import Toast from "../components/Toast";

const ProfilePage = () => {
  const { user, userData, logout, getUserBloodRequests, updateBloodRequestStatus, deleteBloodRequest } = useAuth();
  const navigate = useNavigate();
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const load = async () => {
      try {
        const reqs = await getUserBloodRequests(user.uid);
        setRequests(reqs);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess("You have been logged out successfully!");
      navigate("/");
    } catch (error) {
      showError("Failed to logout. Please try again.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Not available";

    try {
      // Handle MongoDB/ObjectId timestamp format (if needed)
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
      }
      // Handle regular date string or ISO string
      return new Date(timestamp).toLocaleDateString();
    } catch (error) {
      return "Not available";
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "Not available";

    try {
      // Handle MongoDB/ObjectId timestamp format (if needed)
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString();
      }
      // Handle regular date string or ISO string
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      return "Not available";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">Unable to load your profile information.</p>
          <Button onClick={() => navigate("/")} className="bg-red-600 hover:bg-red-700">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="container mx-auto px-4 py-8">

        <div className="max-w-4xl mx-auto">
          {/* Welcome Card */}
          <div className="mb-6">
            <h1 className="text-2xl text-center font-bold">
              Welcome, {userData.fullName || userData.displayName || "User"}!
            </h1>
            <p className="text-center text-gray-600">
              Here's your profile information and account details
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 px-4 pt-4 ">
                  <FaUser className="text-red-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaUser className="text-gray-400 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{userData.fullName || userData.displayName || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaPhone className="text-gray-400 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium">{userData.phone || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-gray-400 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium">{userData.dob || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaTint className="text-gray-400 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Blood Type</p>
                    <p className="font-medium">{userData.bloodType || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 px-4 pt-4 ">
                  <FaEnvelope className="text-red-600" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-gray-400 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{userData.email || user?.email || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaClock className="text-gray-400 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">{formatDate(userData.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FaClock className="text-gray-400 w-5" />
                  <div>
                    <p className="text-sm text-gray-600">Last Login</p>
                    <p className="font-medium">{formatDateTime(userData.lastLoginAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Status</p>
                    <p className="font-medium text-green-600">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Blood Requests */}
            <Card>
              <CardHeader>
                <CardTitle className = "px-4 pt-4 ">My Blood Requests</CardTitle>
                <CardDescription className = "px-4">View and manage your active requests</CardDescription>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <p className="text-gray-600">You have no blood requests yet.</p>
                ) : (
                  <div className="space-y-3">
                    {requests.map((req) => (
                      <div key={req.id} className="border rounded-md p-3 bg-white">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">{req.bloodType} • {req.unitsNeeded} unit(s)</p>
                            <p className="text-sm text-gray-600">{req.hospitalName} • {req.location?.pincode}</p>
                            <p className="text-xs text-gray-500">Status: {req.status}</p>
                          </div>
                          <div className="flex gap-2">
                            {req.status !== 'fulfilled' && (
                              <Button
                                variant="outline"
                                className="border-green-600 text-green-600 hover:bg-green-50"
                                onClick={async () => {
                                  try {
                                    await updateBloodRequestStatus(req.id, 'fulfilled');
                                    await deleteBloodRequest(req.id);
                                    setRequests((prev) => prev.filter((r) => r.id !== req.id));
                                    showSuccess('Request marked as fulfilled and removed.');
                                  } catch (e) {
                                    showError('Failed to update request.');
                                  }
                                }}
                              >
                                Mark Fulfilled
                              </Button>
                            )}
                            <Button
                              onClick={() => navigate(`/find-donor/${req.id}`)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              View Donors
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Donor Registration Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 px-4 pt-4 ">
                  <GiHeartDrop className="text-red-600" />
                  Donor Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${userData.isRegisteredDonor ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Registration Status</p>
                    <p className={`font-medium ${userData.isRegisteredDonor ? 'text-green-600' : 'text-gray-500'
                      }`}>
                      {userData.isRegisteredDonor ? 'Registered' : 'Not Registered'}
                    </p>
                  </div>
                </div>

                {userData.isRegisteredDonor && (
                  <>
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-gray-400 w-5" />
                      <div>
                        <p className="text-sm text-gray-600">Registration Date</p>
                        <p className="font-medium">{formatDate(userData.donorRegistrationDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaClock className="text-gray-400 w-5" />
                      <div>
                        <p className="text-sm text-gray-600">Donor Status</p>
                        <p className={`font-medium ${userData.donorStatus === 'registered' ? 'text-blue-600' :
                            userData.donorStatus === 'pending' ? 'text-yellow-600' :
                              userData.hasSuccessfullyDonated ? 'text-green-600' : 'text-gray-500'
                          }`}>
                          {userData.donorStatus === 'registered' ? 'Registered' :
                            userData.donorStatus === 'pending' ? 'Pending' :
                              userData.hasSuccessfullyDonated ? 'Successfully Donated' : 'Unknown'}
                        </p>
                      </div>
                    </div>

                    {userData.hasSuccessfullyDonated && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-800 font-medium">
                          🎉 Thank you for your successful blood donation!
                        </p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>


          </div>

          {/* Quick Actions */}
          <Card className="mt-6 p-4">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your account and blood donation activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.isRegisteredDonor ? (
                  <>
                    <Button
                      onClick={() => navigate("/donate")}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      View Donation Info
                    </Button>
                    <Button
                      onClick={() => navigate("/register")}
                      variant="outline"
                      className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
                    >
                      Update Registration
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => navigate("/register")}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    Register as Donor
                  </Button>
                )}
                <Button
                  onClick={() => navigate("/request")}
                  className="w-full border-red-600 text-red-600 hover:bg-red-50"
                >
                  Find Donor
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Statistics */}
          {userData.createdAt && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {(() => {
                        let createdDate;
                        if (userData.createdAt?.seconds) {
                          createdDate = new Date(userData.createdAt.seconds * 1000);
                        } else {
                          createdDate = new Date(userData.createdAt);
                        }
                        return Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
                      })()}
                    </p>
                    <p className="text-sm text-gray-600">Days as Member</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {userData.isRegisteredDonor ?
                        (userData.donorStatus === 'registered' ? 'Registered' :
                          userData.donorStatus === 'pending' ? 'Pending' :
                            userData.hasSuccessfullyDonated ? 'Donated' : 'Unknown') :
                        'Not Registered'}
                    </p>
                    <p className="text-sm text-gray-600">Donor Status</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">Active</p>
                    <p className="text-sm text-gray-600">Account Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;





