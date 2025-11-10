import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/Card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/SelectComponent";
import { Checkbox } from "../components/Checkbox";
import { GiHeartDrop } from "react-icons/gi";
import { IoArrowBack } from "react-icons/io5";
import { useAuth } from "../Context/AuthContext";
import { isTCAccepted } from "../utils/tcUtils";
import useToast from "../hooks/useToast";
import Toast from "../components/Toast";
import AuthPage from "./AuthPage";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "", // Store only digits, +91 is displayed as prefix
    dob: "",
    gender: "",
    bloodType: "",
    agreeToTerms: false,
  });

  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [tcAccepted, setTcAccepted] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const navigate = useNavigate();
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast();
  const { signUp } = useAuth();

  // Check T&C acceptance status on component mount
  useEffect(() => {
    const accepted = isTCAccepted();
    setTcAccepted(accepted);
  }, []);

  const handleSignupChange = (e) => { 
    const { name, value } = e.target;
    
    // Handle phone number - store only digits (10 digits max)
    if (name === 'phone') {
      // Remove all non-digit characters
      const digitsOnly = value.replace(/\D/g, '');
      
      // If it starts with 91, remove it (we'll display +91 as prefix)
      const phoneDigits = digitsOnly.startsWith('91') && digitsOnly.length > 10 
        ? digitsOnly.slice(2) 
        : digitsOnly;
      
      // Limit to 10 digits only
      const limitedDigits = phoneDigits.slice(0, 10);
      
      // Store only the digits (without +91)
      setSignupData((prev) => ({ ...prev, [name]: limitedDigits }));
    } else {
      setSignupData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBloodTypeChange = (value) => { 
    setSignupData((prev) => ({ ...prev, bloodType: value }));
  };

  const handleCheckboxChange = (checked) => { 
    setSignupData((prev) => ({ ...prev, agreeToTerms: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!signupData.agreeToTerms) {
      showWarning("You must agree to the terms and conditions.");
      return;
    }

    if (signupData.password.length < 6) {
      showError("Password must be at least 6 characters long.");
      return;
    }

    setIsSignupLoading(true);

    try {
      // Format DOB to ISO string (remove time component)
      const formattedDob = signupData.dob ? new Date(signupData.dob + 'T00:00:00').toISOString() : null;
      
      // Validate phone number (must be exactly 10 digits)
      if (!signupData.phone || signupData.phone.length !== 10) {
        showError("Please enter a valid 10-digit mobile number.");
        return;
      }
      
      await signUp(signupData.email, signupData.password, {
        fullName: signupData.fullName,
        phone: signupData.phone, // Already stored as 10 digits only
        dob: formattedDob,
        gender: signupData.gender,
        bloodType: signupData.bloodType,
        displayName: signupData.fullName
      });

        showSuccess("You have successfully created an account!");
        navigate("/");
    } catch (error) {
      showError(error.message || "An error occurred during sign up. Please try again.");
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
    <AuthPage>
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
      
      <div className="flex flex-col min-h-screen justify-center mx-8 py-10">
        {/* Back Arrow - Fixed position */}
        <div className="fixed top-6 left-6 z-50">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-red-700 hover:text-red-800 transition-colors duration-200"
          >
            <IoArrowBack className="text-2xl" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>

        <div className="md:hidden text-center mb-7">
          <div className="flex items-center justify-center gap-2">
            <GiHeartDrop className="h-10 w-10 text-red-700" />
            <h1 className="text-red-700 text-4xl font-bold"> Blood Bond</h1>
          </div>
          <p className="text-red-700 mt-2">- where hope begins and lives are saved</p>
        </div>

        <div className="flex items-center justify-center bg-red-100">
          <Card className="py-10 px-8 md:px-4 bg-white w-full max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome</CardTitle>
              <CardDescription className="text-gray-500 text-center">
                Join our blood donation community
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="fullName">Full Name</label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={signupData.fullName}
                    onChange={handleSignupChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password">Password</label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    required
                    minLength="6"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone">Contact Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium pointer-events-none z-10">
                      +91
                    </span>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="XXXXXXXXXX"
                      value={signupData.phone}
                      onChange={handleSignupChange}
                      onBlur={() => setPhoneTouched(true)}
                      maxLength={10}
                      required
                      className="pl-12"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Enter 10-digit mobile number (India only)</p>
                  {phoneTouched && signupData.phone && signupData.phone.length !== 10 && (
                    <p className="text-xs text-red-500">Please enter exactly 10 digits</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="dob">Date of Birth</label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    placeholder="DD-MM-YYYY"
                    value={signupData.dob}
                    onChange={handleSignupChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="gender">Gender</label>
                  <Select onValueChange={(value) => setSignupData((prev) => ({ ...prev, gender: value }))} value={signupData.gender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="bloodType">Blood Type</label>
                  <Select onValueChange={handleBloodTypeChange} value={signupData.bloodType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={signupData.agreeToTerms}
                      onCheckedChange={handleCheckboxChange}
                    />
                    <label htmlFor="terms" className="text-sm font-normal">
                      I agree to the{" "}
                      <Link 
                        to="/terms-and-conditions" 
                        target="_blank"
                        className="text-red-600 hover:text-red-800 underline font-medium"
                      >
                        Terms and Conditions
                      </Link>
                    </label>
                  </div>
                  
                  {tcAccepted && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700">
                        ✅ Terms and Conditions have been accepted
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button
                  type="submit"
                  className="w-full bg-blood hover:bg-blood-dark"
                  disabled={isSignupLoading}
                >
                  {isSignupLoading ? "Creating Account..." : "Create Account"}
                </Button>
                
                <div className="text-center text-sm mt-2">
                  Already have an account?{" "}
                  <Link to="/login" className="text-red-600 hover:underline">
                    Sign In
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AuthPage>
  );
};

export default SignUpPage;
