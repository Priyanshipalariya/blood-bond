import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { 
  createBloodRequest, 
  findAvailableDonors,
  updateUserDocument
} from "../services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/Card";
import { Button, ButtonLink } from "../components/Button";
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiPhone, FiHeart, FiAlertCircle } from "react-icons/fi";

const RequestPage = () => {
  const { user, userData, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [locationDetails, setLocationDetails] = useState({
    state: "",
    district: "",
    city: ""
  });
  const [debouncedPincode, setDebouncedPincode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableDonors, setAvailableDonors] = useState([]);
  const [showDonors, setShowDonors] = useState(false);
  

    const bloodGroups = [
        "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
    ];

  const urgencyLevels = [
    { value: "low", label: "Low - Can wait 1-2 days", color: "text-green-600" },
    { value: "medium", label: "Medium - Needed within 24 hours", color: "text-yellow-600" },
    { value: "high", label: "High - Needed within 6 hours", color: "text-orange-600" },
    { value: "critical", label: "Critical - Needed immediately", color: "text-red-600" }
  ];

 
  // Donors section ref for scrolling into view after search
  const donorsSectionRef = useRef(null);

  // Check if all required fields are filled
  const checkRequiredFields = (values) => {
    const requiredFields = [
      'patientName', 'patientAge', 'bloodType', 'unitsNeeded', 'pincode', 
      'hospitalName', 'urgencyLevel', 'contactName', 'contactPhone'
    ];
    
    const missingFields = requiredFields.filter(field => !values[field] || values[field] === '');
    return missingFields.length === 0;
  };

  // Validate specific requirements for blood request
  const validateSpecificRequirements = (values) => {
    const errors = [];
    
    // Check patient age
    if (values.patientAge) {
      const age = parseInt(values.patientAge);
      if (age < 0 || age > 120) {
        errors.push("Patient age must be between 0 and 120 years");
      }
    }
    
    // Check units needed
    if (values.unitsNeeded) {
      const units = parseInt(values.unitsNeeded);
      if (units < 1 || units > 10) {
        errors.push("Units needed must be between 1 and 10");
      }
    }
    
    // Check location
    if (!locationDetails.state) {
      errors.push("Please enter a valid pincode to get location details");
    }
    
    // Check scheduled date if provided
    if (values.scheduledDate) {
      const scheduledDate = new Date(values.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (scheduledDate < today) {
        errors.push("Scheduled date cannot be in the past");
      }
    }
    
    return errors;
  };

  // Prefill user data when component mounts
  useEffect(() => {
    if (userData) {
      setLocationDetails({
        state: userData.state || "",
        district: userData.district || "",
        city: userData.city || ""
      });
      setDebouncedPincode(userData.pincode || "");
    }
  }, [userData]);

  // Debounce pincode lookup
  useEffect(() => {
    const timer = setTimeout(() => {
      if (debouncedPincode.length === 6) {
        fetchAreaFromPincode(debouncedPincode);
      } else {
        setLocationDetails({
          state: "",
          district: "",
          city: ""
        });
        setPincodeError("");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [debouncedPincode]);

  const fetchAreaFromPincode = async (pincode) => {
    setIsLoading(true);
    setPincodeError("");
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setLocationDetails({
          state: postOffice.State,
          district: postOffice.District,
          city: postOffice.Name
        });
        setPincodeError("");
      } else {
        setLocationDetails({
          state: "",
          district: "",
          city: ""
        });
        setPincodeError("Pincode not found");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocationDetails({
        state: "",
        district: "",
        city: ""
      });
      setPincodeError("Error fetching pincode details");
    } finally {
      setIsLoading(false);
    }
  };

    const initialValues = {
    patientName: "",
    patientAge: "",
    bloodType: "",
    unitsNeeded: "",
    pincode: userData?.pincode || "",
    hospitalName: "",
    urgencyLevel: "",
    scheduledDate: "",
    contactName: userData?.fullName || userData?.displayName || "",
    contactPhone: userData?.phone || "",
    acknowledgeCorrectInfo: false
    };

    const validationSchema = Yup.object().shape({
    patientName: Yup.string()
      .required("Patient name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
    patientAge: Yup.number()
      .required("Patient age is required")
      .min(0, "Age cannot be negative")
      .max(120, "Age cannot exceed 120 years"),
    bloodType: Yup.string()
      .required("Blood type is required"),
    unitsNeeded: Yup.number()
      .required("Units needed is required")
      .min(1, "At least 1 unit is required")
      .max(10, "Maximum 10 units allowed"),
        pincode: Yup.string()
            .required("Pincode is required")
      .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits"),
    hospitalName: Yup.string()
      .required("Hospital name is required")
      .min(2, "Hospital name must be at least 2 characters")
      .max(100, "Hospital name cannot exceed 100 characters"),
    urgencyLevel: Yup.string()
      .required("Urgency level is required"),
    contactName: Yup.string()
      .required("Contact name is required")
      .min(2, "Contact name must be at least 2 characters"),
    contactPhone: Yup.string()
      .required("Contact phone is required")
      .matches(/^[0-9]{10}$/, "Contact phone must be exactly 10 digits")
      .test('is-valid-phone', 'Please enter a valid phone number', value => {
        if (!value) return true;
        return /^[6-9]\d{9}$/.test(value);
      }),
    scheduledDate: Yup.date()
      .nullable()
      .test('not-past', 'Scheduled date cannot be in the past', function(value) {
        if (!value) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(value) >= today;
      }),
    acknowledgeCorrectInfo: Yup.boolean()
      .oneOf([true], "You must acknowledge that the information is correct")
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    
    try {
      // Check if all required fields are filled
      if (!checkRequiredFields(values)) {
        toast.error("Please fill in all required fields", {
                    position: "top-right",
                    autoClose: 5000,
                });
        setIsSubmitting(false);
        setSubmitting(false);
                return;
            }

      // Validate specific requirements
      const validationErrors = validateSpecificRequirements(values);
      if (validationErrors.length > 0) {
        toast.error(validationErrors[0], {
                    position: "top-right",
          autoClose: 7000,
        });
        
        if (validationErrors.length > 1) {
          setTimeout(() => {
            toast.error(`Additional issues: ${validationErrors.slice(1).join(", ")}`, {
                    position: "top-right",
              autoClose: 7000,
            });
          }, 2000);
        }
        
        setIsSubmitting(false);
        setSubmitting(false);
        return;
      }

      // Prepare blood request data
      const requestData = {
        patientName: values.patientName,
        patientAge: parseInt(values.patientAge),
        bloodType: values.bloodType,
        unitsNeeded: parseInt(values.unitsNeeded),
        hospitalName: values.hospitalName,
        urgencyLevel: values.urgencyLevel,
        scheduledDate: values.scheduledDate || null,
        contactName: values.contactName,
        contactPhone: values.contactPhone,
        location: {
          pincode: values.pincode,
          state: locationDetails.state,
          district: locationDetails.district,
          city: locationDetails.city
        },
        requestDate: new Date().toISOString()
      };

      // Create the blood request
      const requestId = await createBloodRequest(user.uid, requestData);
      
      if (requestId) {
        // Find available donors, then navigate to Find Donor page with overlay state
        console.log('RequestPage: Searching for donors with blood type:', values.bloodType, 'pincode:', values.pincode);
        const donors = await findAvailableDonors(values.bloodType, values.pincode);
        console.log('RequestPage: Received donors:', donors);
        console.log('RequestPage: Number of donors found:', donors.length);
        navigate(`/find-donor/${requestId}`, { state: { justRequested: true, donorsFound: donors.length } });
        return;
      } else {
        throw new Error("Failed to create blood request");
      }
        } catch (error) {
      console.error("Error creating blood request:", error);
      toast.error('Error creating blood request. Please try again.', {
                position: "top-right",
                autoClose: 5000,
            });
        } finally {
      setIsSubmitting(false);
            setSubmitting(false);
        }
    };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-14rem)] bg-white flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 border-2 border-gray-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              Please sign in to request blood.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

    return (
    <div className="min-h-[calc(100vh-14rem)] bg-white py-8 px-4">
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
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-4">
            Request Blood
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Submit a blood request and we'll help you find available donors in your area. Your request will be shared with registered donors who can help.
          </p>
        </div>

        {/* Available Donors Section */}
        {showDonors && availableDonors.length > 0 && (
          <Card className="mb-8 border-2 border-green-200 shadow-lg" ref={donorsSectionRef}>
            <CardHeader>
              <CardTitle className="text-green-600 flex items-center gap-2">
                <FiUsers className="h-5 w-5" />
                Available Donors in Your Area
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableDonors.map((donor) => (
                  <div key={donor.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-800 text-lg">{donor.donorName}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 text-sm">
                          <div className="flex items-center gap-2">
                            <FiHeart className="h-4 w-4 text-green-600" />
                            <span>Blood Group: <strong className="text-green-800">{donor.bloodGroup}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiUsers className="h-4 w-4 text-green-600" />
                            <span>Age: <strong className="text-green-800">{donor.age || 'N/A'}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiPhone className="h-4 w-4 text-green-600" />
                            <span>Contact: <strong className="text-green-800">{donor.phone}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiMapPin className="h-4 w-4 text-green-600" />
                            <span>{donor.location.city}, {donor.location.district}</span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="h-3 w-3" />
                            <span>Registered: {donor.registrationDate ? new Date(donor.registrationDate).toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        <a 
                          href={`tel:${donor.phone}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <FiPhone className="h-4 w-4" />
                          Call Now
                        </a>
                        <div className="text-xs text-center text-gray-600">
                          {donor.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <FiAlertCircle className="inline h-4 w-4 mr-1" />
                  <strong>Note:</strong> Please contact donors directly using the provided phone numbers. 
                  Be respectful and explain your urgent need for blood.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Link to Profile to manage requests */}
        <div className="text-center mb-8">
          <Link to="/profile" className="text-red-600 hover:underline font-medium">
            Go to Profile to view and manage your blood requests →
          </Link>
        </div>

        {/* No Donors Found */}
        {showDonors && availableDonors.length === 0 && (
          <Card className="mb-8 border-2 border-yellow-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-yellow-600 flex items-center gap-2">
                <FiAlertCircle className="h-5 w-5" />
                Sorry, no donors found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-700">
                <p>
                  We couldn't find any registered donors with the requested blood type in your pincode right now.
                </p>
                <ul className="list-disc pl-5 text-sm">
                  <li>Double-check the blood type and pincode entered</li>
                  <li>Try nearby pincodes in your district if possible</li>
                  <li>We will also notify registered donors in your area who opted in</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blood Request Form */}
        <Card className="border-2 border-gray-200 shadow-lg p-6">
          <CardHeader>
            <CardTitle>Blood Request Form</CardTitle>
            <CardDescription className="text-gray-600">
              Please provide accurate information about the blood requirement. This will help us find the right donors for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ errors, touched, values, setFieldValue, isValid }) => (
                <Form className="space-y-6">
                  {/* Patient Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Patient Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                          Patient Name *
                        </label>
                        <Field
                          name="patientName"
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.patientName && touched.patientName ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        />
                        {errors.patientName && touched.patientName && (
                          <div className="text-red-500 text-sm mt-1">{errors.patientName}</div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="patientAge" className="block text-sm font-medium text-gray-700 mb-1">
                          Patient Age *
                        </label>
                        <Field
                          name="patientAge"
                          type="number"
                          min="0"
                          max="120"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.patientAge && touched.patientAge ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        />
                        {errors.patientAge && touched.patientAge && (
                          <div className="text-red-500 text-sm mt-1">{errors.patientAge}</div>
                        )}
                      </div>

                                        <div>
                        <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-1">
                          Blood Type Required *
                                            </label>
                                            <Field
                                                as="select"
                          name="bloodType"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.bloodType && touched.bloodType ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        >
                          <option value="">Select Blood Type</option>
                                                {bloodGroups.map((group) => (
                            <option key={group} value={group}>{group}</option>
                                                ))}
                                            </Field>
                        {errors.bloodType && touched.bloodType && (
                          <div className="text-red-500 text-sm mt-1">{errors.bloodType}</div>
                                            )}
                                        </div>

                                        <div>
                        <label htmlFor="unitsNeeded" className="block text-sm font-medium text-gray-700 mb-1">
                          Units Needed *
                                            </label>
                        <Field
                          name="unitsNeeded"
                          type="number"
                          min="1"
                          max="10"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.unitsNeeded && touched.unitsNeeded ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        />
                        {errors.unitsNeeded && touched.unitsNeeded && (
                          <div className="text-red-500 text-sm mt-1">{errors.unitsNeeded}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Location Information
                    </h3>
                    
                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                        Pincode *
                      </label>
                      <div className="relative">
                                            <Field
                                                name="pincode"
                                                type="text"
                                                maxLength="6"
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setFieldValue("pincode", value);
                            setDebouncedPincode(value);
                          }}
                          className={`w-full px-3 py-2 border rounded-md ${
                                (errors.pincode && touched.pincode) || pincodeError ? 'border-red-500' : 'border-gray-300'
                              } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        />
                        {isLoading && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          </div>
                        )}
                      </div>
                                            {errors.pincode && touched.pincode && (
                                                <div className="text-red-500 text-sm mt-1">{errors.pincode}</div>
                                            )}
                      {pincodeError && (
                        <div className="text-red-500 text-sm mt-1">{pincodeError}</div>
                      )}
                      {locationDetails.state && !pincodeError && (
                        <div className="mt-2 space-y-1">
                          <div className="text-green-600 text-sm">
                            State: {locationDetails.state}
                          </div>
                          <div className="text-green-600 text-sm">
                            District: {locationDetails.district}
                          </div>
                          <div className="text-green-600 text-sm">
                            Area: {locationDetails.city}
                                        </div>
                                                    </div>
                                                )}
                                        </div>

                    <div>
                      <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 mb-1">
                        Hospital Name *
                      </label>
                      <Field
                        name="hospitalName"
                        type="text"
                        className={`w-full px-3 py-2 border rounded-md ${
                          errors.hospitalName && touched.hospitalName ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        placeholder="Enter hospital or medical center name"
                      />
                      {errors.hospitalName && touched.hospitalName && (
                        <div className="text-red-500 text-sm mt-1">{errors.hospitalName}</div>
                      )}
                        </div>
                    </div>

                  {/* Urgency and Schedule */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Urgency & Schedule
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency Level *
                      </label>
                      <div className="space-y-2">
                        {urgencyLevels.map((level) => (
                          <label key={level.value} className="flex items-center space-x-3">
                            <Field
                              type="radio"
                              name="urgencyLevel"
                              value={level.value}
                              className="text-red-600 focus:ring-red-500"
                            />
                            <span className={`text-sm ${level.color} font-medium`}>
                              {level.label}
                            </span>
                          </label>
                        ))}
                            </div>
                      {errors.urgencyLevel && touched.urgencyLevel && (
                        <div className="text-red-500 text-sm mt-1">{errors.urgencyLevel}</div>
                      )}
                                        </div>

                    <div>
                      <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1">
                        When is blood needed? (Optional)
                      </label>
                      <Field
                        name="scheduledDate"
                        type="date"
                        className={`w-full px-3 py-2 border rounded-md ${
                          errors.scheduledDate && touched.scheduledDate ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-red-500`}
                      />
                      {errors.scheduledDate && touched.scheduledDate && (
                        <div className="text-red-500 text-sm mt-1">{errors.scheduledDate}</div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Leave empty if blood is needed immediately
                      </p>
                                            </div>
                                            </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Contact Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Person Name *
                        </label>
                        <Field
                          name="contactName"
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.contactName && touched.contactName ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        />
                        {errors.contactName && touched.contactName && (
                          <div className="text-red-500 text-sm mt-1">{errors.contactName}</div>
                        )}
                                            </div>

                      <div>
                        <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Phone Number *
                        </label>
                        <Field
                          name="contactPhone"
                          type="tel"
                          maxLength="10"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.contactPhone && touched.contactPhone ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        />
                        {errors.contactPhone && touched.contactPhone && (
                          <div className="text-red-500 text-sm mt-1">{errors.contactPhone}</div>
                        )}
                                            </div>
                                        </div>
                                    </div>

                  {/* Acknowledgment */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Acknowledgment
                    </h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-start space-x-3">
                        <Field
                          type="checkbox"
                          name="acknowledgeCorrectInfo"
                          className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">
                          I acknowledge that all the information provided above is correct and accurate. 
                          I understand that this information will be shared with potential blood donors. *
                        </span>
                      </label>
                      {errors.acknowledgeCorrectInfo && touched.acknowledgeCorrectInfo && (
                        <div className="text-red-500 text-sm">{errors.acknowledgeCorrectInfo}</div>
                      )}
                            </div>
                        </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={
                        isSubmitting || 
                        !isValid || 
                        pincodeError || 
                        isLoading || 
                        !locationDetails.state ||
                        !checkRequiredFields(values) ||
                        validateSpecificRequirements(values).length > 0
                      }
                      onClick={(e) => {
                        if (isSubmitting || 
                            !isValid || 
                            pincodeError || 
                            isLoading || 
                            !locationDetails.state ||
                            !checkRequiredFields(values) ||
                            validateSpecificRequirements(values).length > 0) {
                          e.preventDefault();
                          
                          // Show validation errors
                          const validationErrors = validateSpecificRequirements(values);
                          if (validationErrors.length > 0) {
                            toast.error(validationErrors[0], {
                              position: "top-right",
                              autoClose: 7000,
                            });
                            
                            if (validationErrors.length > 1) {
                              setTimeout(() => {
                                toast.error(`Additional issues: ${validationErrors.slice(1).join(", ")}`, {
                                  position: "top-right",
                                  autoClose: 7000,
                                });
                              }, 2000);
                            }
                          } else if (!checkRequiredFields(values)) {
                            toast.error("Please fill in all required fields", {
                              position: "top-right",
                              autoClose: 5000,
                            });
                          }
                        }
                      }}
                      className={`w-full py-3 px-4 rounded-md font-medium ${
                        isSubmitting || 
                        !isValid || 
                        pincodeError || 
                        isLoading || 
                        !locationDetails.state ||
                        !checkRequiredFields(values) ||
                        validateSpecificRequirements(values).length > 0
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Submitting Request...
                        </div>
                      ) : (
                        'Submit Blood Request'
                      )}
                    </Button>
                    
                    {/* Helper text for disabled button */}
                    {(!checkRequiredFields(values) || validateSpecificRequirements(values).length > 0) && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800 font-medium mb-2">Please complete the following:</p>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          {!checkRequiredFields(values) && (
                            <li>• Fill in all required fields</li>
                          )}
                          {validateSpecificRequirements(values).map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                    </div>
                )}
            </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </div>

     
        </div>
    );
};

export default RequestPage;