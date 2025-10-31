import React, { useEffect, useState } from "react";
import useAuthStore from "../../store/useAuthStore.js";
import CustomButton from "../../components/CustomButton.jsx";
import Logo from "../../assets/img/logo.png";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useFormValidation } from "../../hooks/useValidateForm.js";
import {
  required,
  minLen,
  pattern,
  confirmPassword,
} from "../../utils/validate";

const RegisterUser = () => {
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const crossFieldRule = (values) => {
    const errors = {};
    if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormValidation({
    initialValues: { username: "", password: "", confirmPassword: "" },
    rules: {
      username: [required()],
      password: [required()],
      confirmPassword: [required()],
    },
    formRule: crossFieldRule,
  });

  const submitForm = handleSubmit(async (vals) => {
    console.log("Validated Values :", vals);
    const payload = {
      ...vals,
    };
    console.log("Payload :", payload);
  });

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", username, password);
    return;
    // Call the login function from the auth store
    login(username, password);
  };

  useEffect(() => {
    // Any side effects or cleanup can be handled here
  }, []);
  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-gray-300 rounded-2xl shadow bg-white text-purple-400">
      <div>
        <div className="flex items-center justify-center gap-4  mb-5">
          <img src={Logo} alt="Walleta Logo" className="w-16 h-16" />
          <span className="text-3xl lg:text-4xl font-bold text-center pt-3">
            Walleta
          </span>
        </div>

        <div onSubmit={submitForm} className="flex flex-col gap-4">
          <div>
            <label className="font-semibold">User Name</label>
            <input
              onChange={handleChange({ name: "username" })}
              type="text"
              name="username"
              placeholder="Enter User Name"
              className="border border-gray-300 p-2 rounded"
              value={values.username}
            />
            {touched.username && errors.username && (
              <span className="text-red-600 text-sm">{errors.username}</span>
            )}
          </div>
          <div className="relative">
            <label className="font-semibold">Password</label>
            <input
              placeholder="Enter Password"
              onChange={handleChange({ name: "password" })}
              type={showPassword ? "text" : "password"}
              className="border border-gray-300 p-2 rounded"
              value={values.password}
              name="password"
            />
            {touched.password && errors.password && (
              <span className="text-red-600 text-sm">{errors.password}</span>
            )}
            {showPassword ? (
              <FaEyeSlash
                className="absolute right-5 top-[45px] -translate-y-1/2 text-purple-400 cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <FaEye
                className="absolute right-5 top-[45px] -translate-y-1/2 text-purple-400 cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>

          <div className="relative">
            <label className="font-semibold">Confirm Password</label>
            <input
              placeholder="Enter Confirm Password"
              onChange={handleChange({ name: "confirmPassword" })}
              type={showConfirmPassword ? "text" : "password"}
              className="border border-gray-300 p-2 rounded"
              value={values.confirmPassword}
              name="confirmPassword"
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <span className="text-red-600 text-sm">
                {errors.confirmPassword}
              </span>
            )}
            {showConfirmPassword ? (
              <FaEyeSlash
                className="absolute right-5 top-[45px] -translate-y-1/2 text-purple-400 cursor-pointer"
                onClick={() => setShowConfirmPassword(false)}
              />
            ) : (
              <FaEye
                className="absolute right-5 top-[45px] -translate-y-1/2 text-purple-400 cursor-pointer"
                onClick={() => setShowConfirmPassword(true)}
              />
            )}
          </div>

          <div className="flex flex-col items-center justify-between gap-5">
            <span className="text-sm text-purple-400 cursor-pointer">
              Already Registered?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-semibold"
              >
                Login Here
              </span>
            </span>
          </div>

          <CustomButton
            onSubmit={submitForm}
            text={"Register"}
            className="text-white mb-5"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
