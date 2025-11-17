import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

// 🧩 Validation Schemas
const emailSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .length(6, "OTP must be 6 digits")
    .required("OTP is required"),
});

const passwordSchema = yup.object().shape({
  new_password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password")], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 New States for Timer
  const [timeLeft, setTimeLeft] = useState(300); // 5 min = 300s
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();

  // --- Step 1: Email (Send OTP) ---
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(emailSchema) });

  const onEmailSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post(
        "/opticalfiber/forgot/password/",
        { email: data.email },
        { headers: { Accept: "application/json" } }
      );
      toast.success("OTP sent to your registered email!");
      setEmail(data.email);
      setStep(2);
      setTimeLeft(300); // start timer
      setCanResend(false);
      reset();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to send OTP. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: OTP Verify ---
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    reset: resetOtp,
  } = useForm({ resolver: yupResolver(otpSchema) });

  const onOtpSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post(
        "/opticalfiber/verify/otp/",
        { email, otp: data.otp.toString() },
        { headers: { Accept: "application/json" } }
      );
      toast.success("OTP verified successfully!");
      setStep(3);
      resetOtp();
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Resend OTP Function
  const handleResendOtp = async () => {
    try {
      setLoading(true);
      await api.post(
        "/opticalfiber/forgot/password/",
        { email },
        { headers: { Accept: "application/json" } }
      );
      toast.success("New OTP sent to your email!");
      setTimeLeft(300); // restart 5-minute countdown
      setCanResend(false);
    } catch (err) {
      toast.error("Failed to resend OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🕒 Countdown Timer Logic
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (step === 2 && timeLeft === 0) {
      setCanResend(true);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // --- Step 3: Reset Password ---
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm({ resolver: yupResolver(passwordSchema) });

  const onPasswordSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post(
        "/opticalfiber/reset/password/",
        { email, new_password: data.new_password },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Password reset successfully!");
      resetPasswordForm();
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to reset password. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-background">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-card/90 p-6 rounded-xl shadow-xl backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>

        {/* Step 1: Send OTP */}
        {step === 1 && (
          <form className="space-y-4" onSubmit={handleSubmit(onEmailSubmit)}>
            <div>
              <Label>Email</Label>
              <Input {...register("email")} placeholder="you@example.com" />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <Button className="w-full bg-gradient-primary" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <form className="space-y-4" onSubmit={handleOtpSubmit(onOtpSubmit)}>
            <div>
              <Label>Enter OTP</Label>
              <Input {...registerOtp("otp")} placeholder="6-digit OTP" />
              {otpErrors.otp && (
                <p className="text-red-500 text-sm">{otpErrors.otp.message}</p>
              )}
            </div>

            {/* Countdown + Resend */}
            <div className="flex justify-between items-center text-sm text-gray-500">
              <p>
                OTP expires in{" "}
                <span className="font-medium text-primary">
                  {formatTime(timeLeft)}
                </span>
              </p>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-primary font-semibold hover:underline"
                  disabled={loading}
                >
                  Resend OTP
                </button>
              ) : (
                <p className="opacity-70">(Wait to resend)</p>
              )}
            </div>

            <Button
              className="w-full bg-gradient-primary"
              disabled={loading || timeLeft === 0}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <form
            className="space-y-4"
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
          >
            <div>
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  {...registerPassword("new_password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-primary transition"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordErrors.new_password && (
                <p className="text-red-500 text-sm">
                  {passwordErrors.new_password.message}
                </p>
              )}
            </div>
            <div>
              <Label>Confirm Password</Label>
              <div className="relative">
                <Input
                  {...registerPassword("confirm_password")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-primary transition"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordErrors.confirm_password && (
                <p className="text-red-500 text-sm">
                  {passwordErrors.confirm_password.message}
                </p>
              )}
            </div>
            <Button className="w-full bg-gradient-primary" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
