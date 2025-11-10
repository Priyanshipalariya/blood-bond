import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Button } from "../components/Button";
import { IoArrowBack } from "react-icons/io5";
import { GiHeartDrop } from "react-icons/gi";
import AuthPage from "./AuthPage";

const TermsAndConditionsPage = () => {
  return (
    <AuthPage>
      <div className="flex flex-col min-h-screen justify-center mx-8 py-10">
        {/* Back Arrow */}
        <div className="absolute top-6 left-6">
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
          <Card className="py-10 px-8 md:px-4 bg-white w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-red-700 mb-2">
                Terms and Conditions
              </CardTitle>
              <p className="text-center text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6 text-gray-700">
              <div>
                <h2 className="text-xl font-semibold text-red-700 mb-3">1. Acceptance of Terms</h2>
                <p className="text-sm leading-relaxed">
                  By accessing and using Blood Bond ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-red-700 mb-3">2. Description of Service</h2>
                <p className="text-sm leading-relaxed">
                  Blood Bond is a platform that connects blood donors with those in need of blood transfusions. Our service facilitates the matching of compatible blood types and helps coordinate blood donation requests in emergency situations.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-red-700 mb-3">3. User Responsibilities</h2>
                <ul className="text-sm leading-relaxed space-y-2 ml-4">
                  <li>• Provide accurate and truthful information during registration</li>
                  <li>• Maintain the confidentiality of your account credentials</li>
                  <li>• Notify us immediately of any unauthorized use of your account</li>
                  <li>• Comply with all applicable laws and regulations</li>
                  <li>• Use the service only for legitimate blood donation purposes</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-red-700 mb-3">4. Medical Disclaimer</h2>
                <p className="text-sm leading-relaxed">
                  Blood Bond is not a medical service provider. We do not provide medical advice, diagnosis, or treatment. All blood donations and transfusions should be conducted through proper medical channels and facilities. Users are responsible for ensuring their own health and safety.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-red-700 mb-3">5. Privacy and Data Protection</h2>
                <p className="text-sm leading-relaxed">
                  We are committed to protecting your privacy. Your personal information, including medical data, will be handled in accordance with our Privacy Policy. We will not share your personal information with third parties without your explicit consent, except as required by law.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-red-700 mb-3">6. Prohibited Activities</h2>
                <ul className="text-sm leading-relaxed space-y-2 ml-4">
                  <li>• Providing false or misleading information</li>
                  <li>• Using the service for commercial purposes without authorization</li>
                  <li>• Attempting to gain unauthorized access to the system</li>
                  <li>• Harassing or threatening other users</li>
                  <li>• Violating any applicable laws or regulations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-red-700 mb-3">7. Limitation of Liability</h2>
                <p className="text-sm leading-relaxed">
                  Blood Bond shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the service, including but not limited to medical complications arising from blood donations or transfusions.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-red-700 mb-3">8. Service Availability</h2>
                <p className="text-sm leading-relaxed">
                  We strive to maintain continuous service availability but cannot guarantee uninterrupted access. The service may be temporarily unavailable due to maintenance, updates, or technical issues beyond our control.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-red-700 mb-3">9. Changes to Terms</h2>
                <p className="text-sm leading-relaxed">
                  We reserve the right to modify these terms and conditions at any time. Users will be notified of significant changes via email or through the service. Continued use of the service after changes constitutes acceptance of the new terms.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-red-700 mb-3">10. Contact Information</h2>
                <p className="text-sm leading-relaxed">
                  If you have any questions about these Terms and Conditions, please contact us at:
                  <br />
                  Email: support@bloodbond.com
                  <br />
                  Phone: +1 (555) 123-4567
                </p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-8">
                <p className="text-sm text-red-700 font-medium">
                  By using Blood Bond, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthPage>
  );
};

export default TermsAndConditionsPage;
