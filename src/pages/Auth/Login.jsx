import React, { useState } from "react";
import useAuthStore from "../../store/useAuthStore.js";
import CustomButton from "../../components/CustomButton.jsx";
import Logo from "../../assets/img/logo.png";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFormValidation } from "../../hooks/useValidateForm.js";
import {
  required,
  minLen,
} from "../../utils/validate";
import AuthLoader from "../../components/AuthLoader.jsx";
import { Toaster } from "react-hot-toast";

const Login = () => {
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormValidation({
    initialValues: { username: "", password: "" },
    rules: {
      username: [required("Username is required"), minLen(5, "Username must be at least 5 characters")],
      password: [required("Password is required"), minLen(8, "Password must be at least 8 characters")],
    },
    validateOnBlur: true,
    validateOnChange: true,
  });

  const submitForm = handleSubmit(async (vals) => {
    console.log("Validated Values :", vals);
    setIsLoading(true);
    try {
      const payload = {
        identifier: vals.username,
        password: vals.password,
      };
      console.log("Payload :", payload);
      await login(payload.identifier, payload.password);
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  });

  const routeToRegister = () => {
    navigate("/register");
  };

  return (
    <>
      <AuthLoader isLoading={isLoading} />
      <div className="auth-page-wrapper min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        {/* Login Card */}
        <div className="relative w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 space-y-4 sm:space-y-6">
            {/* Logo & Title */}
            <div className="text-center space-y-2 sm:space-y-3">
              <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <img src={Logo} alt="Paisa Logo" className="w-12 h-12 sm:w-16 sm:h-16 animate-pulse" />
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Paisa
                </h1>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Welcome Back!</h2>
              <p className="text-gray-500 text-xs sm:text-sm">Sign in to continue to your account</p>
            </div>

            {/* Login Form */}
            <form onSubmit={submitForm} className="space-y-3 sm:space-y-4">
              {/* Username Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-gray-700">Username or Email</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                    <FaUser className="text-base sm:text-lg" />
                  </div>
                  <input
                    placeholder="Enter your username or email"
                    type="text"
                    name="username"
                    onChange={handleChange({ name: "username" })}
                    onBlur={handleBlur}
                    className="w-full !pl-[38px] sm:!pl-[42px] pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/60 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-gray-700"
                    value={values.username}
                  />
                </div>
                {touched.username && errors.username && (
                  <p className="text-red-500 text-xs mt-1 ml-1 animate-slideIn">{errors.username}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5 sm:space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400">
                    <FaLock className="text-base sm:text-lg" />
                  </div>
                  <input
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange({ name: "password" })}
                    onBlur={handleBlur}
                    className="w-full !pl-[38px] sm:!pl-[42px] pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base bg-white/60 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-gray-700"
                    value={values.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash className="text-base sm:text-lg" /> : <FaEye className="text-base sm:text-lg" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-red-500 text-xs mt-1 ml-1 animate-slideIn">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/forget-password")}
                  className="text-xs sm:text-sm text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Register Link */}
            <div className="text-center pt-3 sm:pt-4 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={routeToRegister}
                  className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Login;
