import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Link } from "react-router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext";
import { 
  recordDonorRegistration, 
  checkDonationEligibility, 
  getNearbyBloodCamps,
  updateUserDocument,
  getUserDonationHistory,
  cancelDonorRegistration
} from "../services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/Card";
import { Button, ButtonLink } from "../components/Button";
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiCheckCircle } from "react-icons/fi";

const RegisterPage = () => {
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
  const [donationEligibility, setDonationEligibility] = useState(null);
  const [nearbyCamps, setNearbyCamps] = useState([]);
  const [showCamps, setShowCamps] = useState(false);
  const [existingDonations, setExistingDonations] = useState([]);
  const [latestDonationDate, setLatestDonationDate] = useState(null);
  const [formErrors, setFormErrors] = useState({});


    const bloodGroups = [
        "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
    ];

  const medicalConditions = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Asthma",
    "Epilepsy",
    "Cancer",
    "HIV/AIDS",
    "Hepatitis B/C",
    "Tuberculosis",
    "None of the above"
  ];

  // Calculate age from birth date
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Check if all required fields are filled
  const checkRequiredFields = (values) => {
    const requiredFields = [
      'fullName', 'contact', 'bloodGroup', 'pincode', 'dateOfBirth', 
      'weight', 'height', 'haveDonatedBefore', 'emergencyContact', 'emergencyContactPhone'
    ];
    
    const missingFields = requiredFields.filter(field => !values[field] || values[field] === '');
    return missingFields.length === 0;
  };

  // Validate specific requirements for registration
  const validateSpecificRequirements = (values) => {
    const errors = [];
    
    // Check age requirement
    if (values.dateOfBirth) {
      const age = calculateAge(values.dateOfBirth);
      if (age < 17) {
        errors.push(`You must be at least 17 years old to register as a blood donor. Current age: ${age} years`);
      }
    }
    
    // Check weight requirement
    if (values.weight) {
      const weight = parseFloat(values.weight);
      if (weight < 45) {
        errors.push(`Minimum weight required is 45 kg. Current weight: ${weight} kg`);
      } else if (weight > 200) {
        errors.push(`Maximum weight allowed is 200 kg. Current weight: ${weight} kg`);
      }
    }
    
    // Check height requirement
    if (values.height) {
      const height = parseFloat(values.height);
      if (height < 120) {
        errors.push(`Minimum height required is 120 cm. Current height: ${height} cm`);
      } else if (height > 250) {
        errors.push(`Maximum height allowed is 250 cm. Current height: ${height} cm`);
      }
    }
    
    // Check medical conditions
    if (!values.medicalConditions || values.medicalConditions.length === 0) {
      errors.push("Please select at least one medical condition option");
    }
    
    // Check consent
    if (!values.consentToDonate) {
      errors.push("You must consent to donate blood");
    }
    
    if (!values.agreeToTerms) {
      errors.push("You must agree to the terms and conditions");
    }

    // Check 56-day consent if they have donated before
    if (values.haveDonatedBefore === 'yes' && !values.consentNoRecentDonation) {
      errors.push("You must confirm your last donation was more than 56 days ago");
    }

    // Check blood request consent
    if (!values.consentBloodRequests) {
      errors.push("You must consent to be contacted for blood requests in your area");
    }
    
    // Check location
    if (!locationDetails.state) {
      errors.push("Please enter a valid pincode to get location details");
    }
    
    return errors;
  };

  // Check donation eligibility and load existing donations on component mount
  useEffect(() => {
    if (user) {
      checkEligibility();
      loadExistingDonations();
      refreshUserData();
    }
  }, [user, refreshUserData]);

  // Load existing donations from database
  const loadExistingDonations = async () => {
    if (!user) return;
    
    try {
      const donations = await getUserDonationHistory(user.uid);
      setExistingDonations(donations);
      
      if (donations.length > 0) {
        // Find the latest donation date
        const latestDonation = donations[0]; // Already sorted by date desc
        const latestDate = latestDonation.donationDate ? new Date(latestDonation.donationDate) : null;
        setLatestDonationDate(latestDate);
      }
    } catch (error) {
      console.error("Error loading existing donations:", error);
    }
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

  const checkEligibility = async () => {
    if (!user) return;
    
    try {
      const eligibility = await checkDonationEligibility(user.uid);
      setDonationEligibility(eligibility);
      
      if (eligibility.canDonate && userData?.state && userData?.district) {
        const camps = await getNearbyBloodCamps(userData.state, userData.district);
        setNearbyCamps(camps);
        setShowCamps(camps.length > 0);
      }
    } catch (error) {
      console.error("Error checking eligibility:", error);
    }
  };

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

    // Helper function to format date to yyyy-MM-dd
    const formatDateForInput = (dateValue) => {
      if (!dateValue) return "";
      try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch (error) {
        return "";
      }
    };

    const initialValues = {
    fullName: userData?.displayName || userData?.fullName || "",
    contact: userData?.phone || "",
    bloodGroup: userData?.bloodType || userData?.bloodGroup || "",
    pincode: userData?.pincode || "",
    dateOfBirth: formatDateForInput(userData?.dob || userData?.dateOfBirth || ""),
    weight: userData?.weight || "",
    height: userData?.height || "",
    medicalConditions: userData?.medicalConditions || [],
    medications: "",
    emergencyContact: "",
    emergencyContactPhone: "",
    haveDonatedBefore: "",
    consentToDonate: false,
    agreeToTerms: false,
    consentNoRecentDonation: false,
    consentBloodRequests: false
    };

    const validationSchema = Yup.object().shape({
        fullName: Yup.string()
            .required("Full name is required")
            .min(3, "Name must be at least 3 characters")
      .max(50, "Name cannot exceed 50 characters")
            .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),
        contact: Yup.string()
            .required("Contact number is required")
            .matches(/^[0-9]{10}$/, "Contact must be exactly 10 digits")
            .test('is-valid-phone', 'Please enter a valid phone number', value => {
                if (!value) return true;
                return /^[6-9]\d{9}$/.test(value);
            }),
        bloodGroup: Yup.string()
            .required("Blood group is required"),
        pincode: Yup.string()
            .required("Pincode is required")
      .matches(/^[0-9]{6}$/, "Pincode must be exactly 6 digits"),
    dateOfBirth: Yup.date()
      .required("Date of birth is required")
      .max(new Date(), "Date of birth cannot be in the future")
      .test('age-check', 'You must be at least 17 years old to donate blood', function(value) {
        if (!value) return true;
        const age = calculateAge(value);
        return age >= 17;
      }),
    weight: Yup.number()
      .required("Weight is required")
      .min(45, "Minimum weight required is 45 kg")
      .max(200, "Weight cannot exceed 200 kg"),
    height: Yup.number()
      .required("Height is required")
      .min(120, "Minimum height required is 120 cm")
      .max(250, "Height cannot exceed 250 cm"),
    medicalConditions: Yup.array()
      .min(1, "Please select at least one option"),
    haveDonatedBefore: Yup.string()
      .required("Please select if you have donated blood before"),
    emergencyContact: Yup.string()
      .required("Emergency contact name is required")
      .min(3, "Emergency contact name must be at least 3 characters"),
    emergencyContactPhone: Yup.string()
      .required("Emergency contact phone is required")
      .matches(/^[0-9]{10}$/, "Emergency contact phone must be exactly 10 digits"),
    consentToDonate: Yup.boolean()
      .oneOf([true], "You must consent to donate blood"),
    agreeToTerms: Yup.boolean()
      .oneOf([true], "You must agree to the terms and conditions"),
    consentNoRecentDonation: Yup.boolean()
      .when('haveDonatedBefore', {
        is: 'yes',
        then: (schema) => schema.oneOf([true], "You must confirm your last donation was more than 56 days ago"),
        otherwise: (schema) => schema.notRequired()
      }),
    consentBloodRequests: Yup.boolean()
      .oneOf([true], "You must consent to be contacted for blood requests in your area")
  });

    const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
        console.log('Form submitted with values:', values);
        console.log('Location details:', locationDetails);
        console.log('Pincode error:', pincodeError);
        console.log('Is loading:', isLoading);
        
        setIsSubmitting(true);
    
    try {
      // Check if all required fields are filled
      if (!checkRequiredFields(values)) {
        console.log('Required fields check failed');
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
        console.log('Validation errors:', validationErrors);
        // Show first error as toast
        toast.error(validationErrors[0], {
          position: "top-right",
          autoClose: 7000,
        });
        
        // Show additional errors if any
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
      
      console.log('All validations passed, proceeding with registration...');

      // Format dateOfBirth to ISO string (backend expects ISO format)
      const formattedDateOfBirth = values.dateOfBirth ? new Date(values.dateOfBirth).toISOString() : null;

      // Prepare donor registration data - ensure numeric fields are numbers
      const donorRegistrationData = {
        donorName: values.fullName,
        phone: values.contact,
        bloodGroup: values.bloodGroup,
        dateOfBirth: formattedDateOfBirth,
        weight: parseFloat(values.weight),
        height: parseFloat(values.height),
        medicalConditions: values.medicalConditions,
        medications: values.medications || "",
        emergencyContact: values.emergencyContact,
        emergencyContactPhone: values.emergencyContactPhone,
        location: {
          pincode: values.pincode,
          state: locationDetails.state,
          district: locationDetails.district,
          city: locationDetails.city
        },
        consentBloodRequests: values.consentBloodRequests,
        registrationDate: new Date().toISOString(),
        status: 'registered', // Status: registered, active, inactive
        isEligible: true // Will be updated based on actual donation eligibility checks
      };

      console.log('Submitting donor registration:', donorRegistrationData);

      // Record the donor registration
      console.log('Calling recordDonorRegistration with userId:', user.uid);
      const success = await recordDonorRegistration(user.uid, donorRegistrationData);
      console.log('Registration result:', success);
      
      if (success) {
        // Format dateOfBirth for user document (store as ISO string)
        const formattedDobForUser = values.dateOfBirth ? new Date(values.dateOfBirth).toISOString() : null;

        // Update user profile with new information
        await updateUserDocument(user.uid, {
          fullName: values.fullName,
          phone: values.contact,
          bloodType: values.bloodGroup,
          bloodGroup: values.bloodGroup,
          dob: formattedDobForUser,
          dateOfBirth: formattedDobForUser,
          weight: values.weight,
          height: values.height,
          medicalConditions: values.medicalConditions,
          emergencyContact: values.emergencyContact,
          emergencyContactPhone: values.emergencyContactPhone,
          pincode: values.pincode,
          state: locationDetails.state,
          district: locationDetails.district,
          city: locationDetails.city,
          consentBloodRequests: values.consentBloodRequests
        });

        // Check for nearby blood camps after successful registration
        let campMessage = "";
        if (locationDetails.state && locationDetails.district) {
          const camps = await getNearbyBloodCamps(locationDetails.state, locationDetails.district);
          setNearbyCamps(camps);
          setShowCamps(camps.length > 0);
          
          if (camps.length > 0) {
            campMessage = ` We found ${camps.length} blood camp(s) near your location!`;
          } else {
            campMessage = " We will contact you when blood donation opportunities are available or when someone needs blood in your area.";
          }
        }

        // Immediately redirect to Donate page with overlay countdown message
        navigate('/donate', { state: { justRegistered: true } });
        return;

      } else {
        throw new Error("Failed to record donor registration");
      }
        } catch (error) {
      console.error("Error saving donor registration:", error);
      const errorMessage = error.message || 'Error saving donor registration. Please try again.';
      toast.error(errorMessage, {
                position: "top-right",
                autoClose: 7000,
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
              Please sign in to register for blood donation.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user is already registered
  if (userData?.isRegisteredDonor) {
    return (
      <div className="min-h-[calc(100vh-14rem)] bg-white flex items-center justify-center py-8 px-4">
        <Card className="w-full max-w-md mx-4 border-2 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="pt-6 text-center text-green-600 flex items-center justify-center gap-2">
              <FiCheckCircle className="h-6 w-6" />
              Already Registered
            </CardTitle>
          </CardHeader>
           <CardContent className="text-center">
             <p className="text-gray-600 mb-4">
               You are already registered as a blood donor. We will contact you when donation opportunities are available in your area.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Registration Date: {userData.donorRegistrationDate ? new Date(userData.donorRegistrationDate).toLocaleDateString() : 'N/A'}
            </p>
            <div className="space-y-2">
              <Link to="/profile">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  View Registration Details
                </Button>
</Link>    
               <ButtonLink 
                className="w-full text-center py-2 px-4 border border-red-300 rounded-md hover:bg-red-50 text-sm mt-3"
                onClick={async () => {
                  if (window.confirm('Are you sure you want to cancel your blood donor registration? This action cannot be undone.')) {
                    try {
                      const success = await cancelDonorRegistration(user.uid);
                      if (success) {
                        // Refresh user profile before showing message
                        await refreshUserData();

                        // Redirect to Donate page with overlay and countdown
                        navigate('/donate', { state: { donorCancelled: true } });
                        return;
                      } else {
                        throw new Error('Failed to cancel registration');
                      }
                    } catch (error) {
                      console.error('Error cancelling registration:', error);
                      toast.error('Failed to cancel registration. Please try again.', {
                        position: "top-right",
                        autoClose: 5000,
                      });
                    }
                  }
                }}
              >
                 Cancel Registration
               </ButtonLink>
             </div>
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
            Blood Donor Registration
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Register as a blood donor to help save lives. You will be contacted when donation opportunities are available in your area.
          </p>
        </div>


        {/* Blood Camps */}
        {showCamps && nearbyCamps.length > 0 && (
          <Card className="mb-8 border-2 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-green-600 flex items-center gap-2">
                <FiMapPin className="h-5 w-5" />
                Blood Camps Near You
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nearbyCamps.map((camp) => (
                  <div key={camp.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h3 className="font-semibold text-green-800">{camp.campName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="h-4 w-4 text-green-600" />
                        <span>{camp.campDate ? new Date(camp.campDate).toLocaleDateString() : 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock className="h-4 w-4 text-green-600" />
                        <span>{camp.campTime || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="h-4 w-4 text-green-600" />
                        <span>{camp.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiUsers className="h-4 w-4 text-green-600" />
                        <span>{camp.organizer}</span>
                      </div>
                    </div>
                    {camp.description && (
                      <p className="text-sm text-gray-600 mt-2">{camp.description}</p>
                    )}
                  </div>
                ))}
                </div>
            </CardContent>
          </Card>
        )}

        {/* Registration Form */}
        <Card className="border-2 border-gray-200 shadow-lg p-6">
          <CardHeader>
            <CardTitle>Blood Donor Registration Form</CardTitle>
            <CardDescription className = "text-gray-600">
              Please fill in all the required information accurately. This registration will make you eligible for blood donation opportunities.
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
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                                    </label>
                                    <Field
                                        name="fullName"
                                        type="text"
                          className={`w-full px-3 py-2 border rounded-md ${
                                            errors.fullName && touched.fullName ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        />
                        {errors.fullName && touched.fullName && (
                          <div className="text-red-500 text-sm mt-1">{errors.fullName}</div>
                        )}
                                </div>

                                <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Number *
                                    </label>
                                    <Field
                                        name="contact"
                                        type="tel"
                                        maxLength="10"
                          className={`w-full px-3 py-2 border rounded-md ${
                                            errors.contact && touched.contact ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-red-500`}
                                    />
                                    {errors.contact && touched.contact && (
                          <div className="text-red-500 text-sm mt-1">{errors.contact}</div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth *
                        </label>
                        <Field
                          name="dateOfBirth"
                          type="date"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.dateOfBirth && touched.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        />
                        {errors.dateOfBirth && touched.dateOfBirth && (
                          <div className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</div>
                        )}
                        {values.dateOfBirth && (
                          <div className="text-sm text-gray-500 mt-1">
                            Age: {calculateAge(values.dateOfBirth)} years
                          </div>
                                    )}
                                </div>

                                <div>
                        <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                          Blood Group *
                                    </label>
                                    <Field
                                        as="select"
                                        name="bloodGroup"
                          className={`w-full px-3 py-2 border rounded-md ${
                                            errors.bloodGroup && touched.bloodGroup ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-red-500`}
                                    >
                                        <option value="">Select Blood Group</option>
                                        {bloodGroups.map((group) => (
                            <option key={group} value={group}>{group}</option>
                                        ))}
                                    </Field>
                                    {errors.bloodGroup && touched.bloodGroup && (
                          <div className="text-red-500 text-sm mt-1">{errors.bloodGroup}</div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (kg) *
                        </label>
                        <Field
                          name="weight"
                          type="number"
                          min="45"
                          max="200"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.weight && touched.weight ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        />
                        {errors.weight && touched.weight && (
                          <div className="text-red-500 text-sm mt-1">{errors.weight}</div>
                                    )}
                                </div>

                                <div>
                        <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                          Height (cm) *
                        </label>
                        <Field
                          name="height"
                          type="number"
                          min="120"
                          max="250"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.height && touched.height ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        />
                        {errors.height && touched.height && (
                          <div className="text-red-500 text-sm mt-1">{errors.height}</div>
                        )}
                      </div>
                    </div>

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
                  </div>

                  {/* Medical Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Medical Information
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Medical Conditions *
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {medicalConditions.map((condition) => (
                          <label key={condition} className="flex items-center space-x-2">
                            <Field
                              type="checkbox"
                              name="medicalConditions"
                              value={condition}
                              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700">{condition}</span>
                          </label>
                        ))}
                      </div>
                      {errors.medicalConditions && touched.medicalConditions && (
                        <div className="text-red-500 text-sm mt-1">{errors.medicalConditions}</div>
                      )}
                    </div>


                    <div>
                      <label htmlFor="medications" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Medications (if any)
                      </label>
                      <Field
                        name="medications"
                        as="textarea"
                        rows="3"
                        className={`w-full px-3 py-2 border rounded-md ${
                          errors.medications && touched.medications ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        placeholder="List any medications you are currently taking..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Have you donated blood before? *
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <Field
                            type="radio"
                            name="haveDonatedBefore"
                            value="yes"
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <Field
                            type="radio"
                            name="haveDonatedBefore"
                            value="no"
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-700">No</span>
                        </label>
                      </div>
                      {errors.haveDonatedBefore && touched.haveDonatedBefore && (
                        <div className="text-red-500 text-sm mt-1">{errors.haveDonatedBefore}</div>
                      )}
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Emergency Contact
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                          Emergency Contact Name *
                        </label>
                        <Field
                          name="emergencyContact"
                          type="text"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.emergencyContact && touched.emergencyContact ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        />
                        {errors.emergencyContact && touched.emergencyContact && (
                          <div className="text-red-500 text-sm mt-1">{errors.emergencyContact}</div>
                        )}
                            </div>

                            <div>
                        <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                          Emergency Contact Phone *
                        </label>
                        <Field
                          name="emergencyContactPhone"
                          type="tel"
                          maxLength="10"
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.emergencyContactPhone && touched.emergencyContactPhone ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-red-500`}
                        />
                        {errors.emergencyContactPhone && touched.emergencyContactPhone && (
                          <div className="text-red-500 text-sm mt-1">{errors.emergencyContactPhone}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Consent */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                      Consent & Agreement
                    </h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-start space-x-3">
                        <Field
                          type="checkbox"
                          name="consentToDonate"
                          className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">
                          I consent to donate blood and understand the donation process. *
                        </span>
                      </label>
                      {errors.consentToDonate && touched.consentToDonate && (
                        <div className="text-red-500 text-sm">{errors.consentToDonate}</div>
                      )}

                      {values.haveDonatedBefore === 'yes' && (
                        <label className="flex items-start space-x-3">
                          <Field
                            type="checkbox"
                            name="consentNoRecentDonation"
                            className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-sm text-gray-700">
                            I confirm my last donation was more than 56 days ago. *
                          </span>
                        </label>
                      )}
                      {errors.consentNoRecentDonation && touched.consentNoRecentDonation && (
                        <div className="text-red-500 text-sm">{errors.consentNoRecentDonation}</div>
                      )}

                      <label className="flex items-start space-x-3">
                        <Field
                          type="checkbox"
                          name="agreeToTerms"
                          className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">
                          I agree to the terms and conditions and privacy policy. *
                        </span>
                      </label>
                      {errors.agreeToTerms && touched.agreeToTerms && (
                        <div className="text-red-500 text-sm">{errors.agreeToTerms}</div>
                      )}

                      <label className="flex items-start space-x-3">
                        <Field
                          type="checkbox"
                          name="consentBloodRequests"
                          className="mt-1 rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">
                          I consent to be contacted if someone needs blood in my area (same pincode). *
                        </span>
                      </label>
                      {errors.consentBloodRequests && touched.consentBloodRequests && (
                        <div className="text-red-500 text-sm">{errors.consentBloodRequests}</div>
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
                        // Debug button state
                        const isDisabled = isSubmitting || 
                          !isValid || 
                          pincodeError || 
                          isLoading || 
                          !locationDetails.state ||
                          !checkRequiredFields(values) ||
                          validateSpecificRequirements(values).length > 0;
                        
                        console.log('Button clicked. Disabled:', isDisabled);
                        console.log('Button state check:', {
                          isSubmitting,
                          isValid,
                          pincodeError,
                          isLoading,
                          hasLocationState: !!locationDetails.state,
                          requiredFieldsFilled: checkRequiredFields(values),
                          validationErrors: validateSpecificRequirements(values).length
                        });
                        
                        // Only prevent default if button is actually disabled
                        // If enabled, let Formik handle the submission
                        if (isDisabled) {
                          e.preventDefault();
                          e.stopPropagation();
                          // Show helpful message
                          if (!checkRequiredFields(values)) {
                            toast.error("Please fill in all required fields", {
                              position: "top-right",
                              autoClose: 5000,
                            });
                          } else if (validateSpecificRequirements(values).length > 0) {
                            toast.error(validateSpecificRequirements(values)[0], {
                              position: "top-right",
                              autoClose: 7000,
                            });
                          } else if (!locationDetails.state) {
                            toast.error("Please enter a valid pincode", {
                              position: "top-right",
                              autoClose: 5000,
                            });
                          }
                        } else {
                          // Button is enabled, allow form submission
                          console.log('Button enabled, allowing form submission');
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
                          : 'bg-red-600 hover:bg-red-700 text-white cursor-pointer'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Registering...
                        </div>
                      ) : (
                        'Register as Blood Donor'
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

export default RegisterPage;