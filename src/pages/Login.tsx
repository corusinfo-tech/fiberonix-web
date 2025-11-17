import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { registerCompanyAdmin, loginUser } from "@/services/api";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";

// Validation Schemas
const companySchema = yup.object().shape({
  name: yup.string().required("Company name is required"),
  registration_number: yup.string().required("Registration number is required"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Company email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone number is required"),
  address: yup.string().required("Address is required"),
});

const adminSchema = yup.object().shape({
  name: yup.string().required("Admin name is required"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Admin email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const { login } = useAuth();

  const [signupStep, setSignupStep] = useState(1);
  const [companyData, setCompanyData] = useState({});

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1 - Company Form
  const {
    register: registerCompany,
    handleSubmit: handleCompanySubmit,
    reset: resetCompany,
    setError: setCompanyError,
    formState: { errors: companyErrors },
  } = useForm({
    resolver: yupResolver(companySchema),
    mode: "onChange",
  });

  // Step 2 - Admin Form
  const {
    register: registerAdmin,
    handleSubmit: handleAdminSubmit,
    reset: resetAdmin,
    setError: setAdminError,
    formState: { errors: adminErrors },
  } = useForm({
    resolver: yupResolver(adminSchema),
    mode: "onChange",
  });

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    reset: resetLogin,
    setError: setLoginError,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  // Login Submit
  const onLoginSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await loginUser(data);
      toast.success("Login successful!");
      login(res.token, res.name);
      resetLogin();
      setTimeout(() => navigate("/dashboard"), 500);
    } catch (error) {
      const msg = error.response?.data?.message;
      if (msg?.includes("email")) {
        setLoginError("email", { type: "server", message: msg });
      } else if (msg?.includes("password")) {
        setLoginError("password", { type: "server", message: msg });
      } else {
        toast.error(msg || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 1 Submit
  const onCompanySubmit = (data) => {
    setCompanyData(data);
    setSignupStep(2);
  };

  // Step 2 Submit
  const onAdminSubmit = async (data) => {
    setLoading(true);
    const payload = {
      ...companyData,
      admin_name: data.name,
      admin_email: data.email,
      admin_password: data.password,
    };
    try {
      const res = await registerCompanyAdmin(payload);
      toast.success(res.message || "Registration successful!");
      resetCompany();
      resetAdmin();
      setSignupStep(1);
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      const details = err.response?.data?.details;

      if (details && typeof details === "object") {
        // Map backend field errors to only valid fields for Company
        const companyFields = [
          "name",
          "registration_number",
          "email",
          "phone",
          "address",
        ];
        companyFields.forEach((field) => {
          if (details[field]) {
            setSignupStep(1);
            setCompanyError(
              field as
                | "name"
                | "registration_number"
                | "email"
                | "phone"
                | "address",
              {
                type: "server",
                message: details[field][0],
              }
            );
          }
        });
      } else if (
        typeof details === "string" &&
        details.includes("duplicate key value")
      ) {
        // Admin email already exists
        setAdminError("email", {
          type: "server",
          message: "Admin email already exists.",
        });
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-background">
      <Toaster position="top-right" reverseOrder={false} />
      <Card className="w-full max-w-md shadow-xl border-0 bg-card/90 backdrop-blur-md">
        <CardHeader className="relative text-center">
          {/* Home navigation arrow */}
          <button
            onClick={() => navigate("/")}
            className="absolute right-2 top-2 p-2 rounded-full bg-primary/10 text-primary shadow-md hover:bg-primary/20 hover:scale-110 transition-all duration-200"
            title="Go to Home"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome to Network Command Center
          </CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* LOGIN TAB */}
            <TabsContent value="login">
              <form
                className="space-y-4"
                onSubmit={handleLoginSubmit(onLoginSubmit)}
              >
                <div>
                  <Label>Email</Label>
                  <Input
                    {...registerLogin("email")}
                    type="email"
                    placeholder="you@example.com"
                  />
                  {loginErrors.email && (
                    <p className="text-red-500 text-sm">
                      {loginErrors.email.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      {...registerLogin("password")}
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-primary transition"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {loginErrors.password && (
                    <p className="text-red-500 text-sm">
                      {loginErrors.password.message}
                    </p>
                  )}

                  {/* Right-aligned Forgot Password */}
                  <div className="text-right mt-1">
                    <a
                      className="text-sm text-primary hover:underline cursor-pointer"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-primary text-primary-foreground shadow-glow"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* SIGNUP TAB */}
            <TabsContent value="signup">
              {/* STEP 1 - Company */}
              {signupStep === 1 && (
                <form
                  className="space-y-4"
                  onSubmit={handleCompanySubmit(onCompanySubmit)}
                >
                  <div>
                    <Label>Company Name</Label>
                    <Input
                      {...registerCompany("name")}
                      placeholder="Company Pvt Ltd"
                    />
                    {companyErrors.name && (
                      <p className="text-red-500 text-sm">
                        {companyErrors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Registration Number</Label>
                    <Input
                      {...registerCompany("registration_number")}
                      placeholder="REG-123456"
                    />
                    {companyErrors.registration_number && (
                      <p className="text-red-500 text-sm">
                        {companyErrors.registration_number.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Company Email</Label>
                    <Input
                      {...registerCompany("email")}
                      placeholder="company@example.com"
                    />
                    {companyErrors.email && (
                      <p className="text-red-500 text-sm">
                        {companyErrors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      {...registerCompany("phone")}
                      placeholder="9876543210"
                    />
                    {companyErrors.phone && (
                      <p className="text-red-500 text-sm">
                        {companyErrors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input
                      {...registerCompany("address")}
                      placeholder="123 Main Street, Kochi"
                    />
                    {companyErrors.address && (
                      <p className="text-red-500 text-sm">
                        {companyErrors.address.message}
                      </p>
                    )}
                  </div>
                  <Button className="w-full bg-gradient-primary" type="submit">
                    Next: Create Admin
                  </Button>
                </form>
              )}

              {/* STEP 2 - Admin */}
              {signupStep === 2 && (
                <form
                  className="space-y-4"
                  onSubmit={handleAdminSubmit(onAdminSubmit)}
                >
                  <div>
                    <Label>Admin Name</Label>
                    <Input {...registerAdmin("name")} placeholder="John Doe" />
                    {adminErrors.name && (
                      <p className="text-red-500 text-sm">
                        {adminErrors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Admin Email</Label>
                    <Input
                      {...registerAdmin("email")}
                      placeholder="admin@example.com"
                    />
                    {adminErrors.email && (
                      <p className="text-red-500 text-sm">
                        {adminErrors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        {...registerAdmin("password")}
                        type={showAdminPassword ? "text" : "password"}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-gray-500 hover:text-primary transition"
                        onClick={() => setShowAdminPassword((prev) => !prev)}
                      >
                        {showAdminPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {adminErrors.password && (
                      <p className="text-red-500 text-sm">
                        {adminErrors.password.message}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSignupStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      className="bg-gradient-primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Creating Account..." : "Complete Signup"}
                    </Button>
                  </div>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
