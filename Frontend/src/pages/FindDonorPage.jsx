import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/Card";
import { Button } from "../components/Button";
import { FiUsers, FiHeart, FiMapPin, FiCalendar, FiPhone, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "../Context/AuthContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FindDonorPage = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, getBloodRequestById, findAvailableDonors, updateBloodRequestStatus, deleteBloodRequest } = useAuth();
  const [request, setRequest] = useState(null);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(!!location.state?.justRequested);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!showMessageBox) return;
    setCountdown(5);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowMessageBox(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showMessageBox]);

  useEffect(() => {
    const load = async () => {
      try {
        // If not authenticated, do not redirect; allow header/footer to remain
        if (!user) {
          setLoading(false);
          return;
        }
        const req = await getBloodRequestById(requestId);
        if (!req) {
          toast.error('Blood request not found.', {
            position: "top-right",
            autoClose: 3000,
          });
          navigate("/");
          return;
        }
        setRequest(req);
        const ds = await findAvailableDonors(req.bloodType, req.location?.pincode);
        setDonors(ds);
      
      } catch (error) {
        console.error('Error loading request:', error);
        toast.error('Failed to load blood request. Please try again.', {
          position: "top-right",
          autoClose: 5000,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [requestId, user, getBloodRequestById, findAvailableDonors, navigate]);

  const handleFulfilled = async () => {
    if (!request) return;
    setMarking(true);
    try {
      await updateBloodRequestStatus(request.id, 'fulfilled');
      toast.success('Blood request marked as fulfilled!', {
        position: "top-right",
        autoClose: 3000,
      });
      // delay delete to allow propagation / UX
      setTimeout(async () => {
        await deleteBloodRequest(request.id);
        toast.info('Redirecting to profile...', {
          position: "top-right",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/profile");
        }, 1500);
      }, 1500);
    } catch (error) {
      console.error('Error marking request as fulfilled:', error);
      toast.error('Failed to mark request as fulfilled. Please try again.', {
        position: "top-right",
        autoClose: 5000,
      });
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-14rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!request) return null;

  return (
    <div className="min-h-[calc(100vh-14rem)] bg-white py-12 px-6 md:py-16 md:px-8">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
  
      {/* Overlay message with blur */}
      {showMessageBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 bg-white rounded-lg shadow-xl px-8 py-6 w-full max-w-md text-center">
            <h3 className="text-xl font-semibold text-red-700 mb-2">Blood Request Submitted</h3>
            <p className="text-gray-700 mb-4">
              We found {location.state?.donorsFound ?? 0} donor(s) for your request.
            </p>
            <div className="text-5xl font-bold text-red-600 mb-1">{countdown}</div>
            <p className="text-sm text-gray-500">This message will close automatically</p>
          </div>
        </div>
      )}
  
      <div className={`max-w-5xl mx-auto space-y-12 ${showMessageBox ? "blur-sm pointer-events-none select-none" : ""}`}>
        {/* Request Details Card */}
        <Card className="border-2 border-gray-200 shadow-lg rounded-xl p-6">
          <CardHeader className="mb-4">
            <CardTitle className="text-2xl mb-1">Request Details</CardTitle>
            <CardDescription className="text-gray-600">
              Keep this page open until your request is fulfilled.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm">
              <div><span className="text-gray-600">Patient:</span> <span className="font-medium">{request.patientName} ({request.patientAge})</span></div>
              <div><span className="text-gray-600">Blood Type:</span> <span className="font-medium">{request.bloodType}</span></div>
              <div><span className="text-gray-600">Units Needed:</span> <span className="font-medium">{request.unitsNeeded}</span></div>
              <div><span className="text-gray-600">Hospital:</span> <span className="font-medium">{request.hospitalName}</span></div>
              <div><span className="text-gray-600">Pincode:</span> <span className="font-medium">{request.location?.pincode}</span></div>
              <div><span className="text-gray-600">Urgency:</span> <span className="font-medium capitalize">{request.urgencyLevel}</span></div>
              {request.scheduledDate && (
                <div><span className="text-gray-600">When Needed:</span> <span className="font-medium">{new Date(request.scheduledDate).toLocaleDateString()}</span></div>
              )}
              <div><span className="text-gray-600">Contact:</span> <span className="font-medium">{request.contactName} ({request.contactPhone})</span></div>
            </div>
  
            <div className="mt-8 flex flex-wrap gap-4">
              <Button className="bg-green-600 hover:bg-green-700 px-6 py-2" onClick={handleFulfilled} disabled={marking}>
                {marking ? 'Marking…' : 'Mark as Fulfilled'}
              </Button>
              <Button variant="outline" onClick={() => navigate('/profile')}>
                Go to Profile
              </Button>
            </div>
          </CardContent>
        </Card>
  
        {/* Donor Results */}
        {donors.length > 0 ? (
          <Card className="border-2 border-green-200 shadow-lg rounded-xl p-6">
            <CardHeader className="mb-4">
              <CardTitle className="text-green-600 flex items-center gap-2 text-xl">
                <FiUsers className="h-5 w-5" />
                Available Donors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {donors.map((donor) => (
                  <div key={donor.id} className="border border-green-200 rounded-lg p-5 bg-green-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-800 text-lg">{donor.donorName}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-sm">
                          <div className="flex items-center gap-2"><FiHeart className="h-4 w-4 text-green-600" /><span>Blood Group: <strong className="text-green-800">{donor.bloodGroup}</strong></span></div>
                          <div className="flex items-center gap-2"><FiPhone className="h-4 w-4 text-green-600" /><span>Contact: <strong className="text-green-800">{donor.phone}</strong></span></div>
                          <div className="flex items-center gap-2"><FiMapPin className="h-4 w-4 text-green-600" /><span>{donor.location.city}, {donor.location.district}</span></div>
                          <div className="flex items-center gap-2"><FiCalendar className="h-4 w-4 text-green-600" /><span>Registered: {donor.registrationDate ? new Date(donor.registrationDate).toLocaleDateString() : 'N/A'}</span></div>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        <a href={`tel:${donor.phone}`} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium">
                          <FiPhone className="h-4 w-4" />
                          Call Now
                        </a>
                        <div className="text-xs text-center text-gray-600">{donor.phone}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <FiAlertCircle className="inline h-4 w-4 mr-1" />
                  Please contact donors directly using the provided phone numbers.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-yellow-200 shadow-lg rounded-xl p-6">
            <CardHeader className="mb-2">
              <CardTitle className="text-yellow-600 flex items-center gap-2 text-xl">
                <FiAlertCircle className="h-5 w-5" />
                Sorry, no donors found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Please try nearby pincodes or contact emergency hotline: <strong>108</strong>.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FindDonorPage;


