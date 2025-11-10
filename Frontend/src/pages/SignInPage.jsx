import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/Card";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { GiHeartDrop } from "react-icons/gi";
import { IoArrowBack } from "react-icons/io5";
import { useAuth } from "../Context/AuthContext";
import useToast from "../hooks/useToast";
import Toast from "../components/Toast";
import AuthPage from "./AuthPage";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoginLoading(true);

    try {
      await signIn(email, password);
      showSuccess("You have successfully signed in!");
      navigate("/");
    } catch (error) {
      showError(error.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoginLoading(false);
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

      <div className="flex flex-col min-h-screen justify-center mx-8">
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
            <h1 className="text-red-700 text-4xl font-bold">Blood Bond</h1>
          </div>
          <p className="text-red-700 mt-2">- where hope begins and lives are saved</p>
        </div>

        <div className="flex items-center justify-center bg-red-100">
          <Card className="py-10 px-8 mx-auto w-full max-w-lg bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome Back!</CardTitle>
              <CardDescription className="text-center text-gray-500">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password">Password</label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoginLoading}
                >
                  {isLoginLoading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center text-sm space-y-2">
                  <div>
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-red-600 hover:underline">
                      Sign up
                    </Link>
                  </div>
                  <div>
                    By signing in, you agree to our{" "}
                    <Link
                      to="/terms-and-conditions"
                      target="_blank"
                      className="text-red-600 hover:text-red-800 underline font-medium"
                    >
                      Terms and Conditions
                    </Link>
                  </div>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AuthPage>
  );
};

export default SignInPage;
