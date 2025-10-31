import React, { useState } from "react";
import useAuthStore from "../../store/useAuthStore.js";
import CustomButton from "../../components/CustomButton.jsx";
import Logo from "../../assets/img/logo.png";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { required } from "../../utils/validate";
import { useFormValidation } from "../../hooks/useValidateForm.js";

const Login = () => {
  const { login } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      username: [required()],
      password: [required()],
    },
    // formRule: crossFieldRule,
    validateOnBlur: true,
    validateOnChange: true,
  });

  const submitForm = handleSubmit(async (vals) => {
    console.log("Validated Values :", vals);
    const payload = {
      ...vals,
    };
    console.log("Payload :", payload);
    await login(payload.username, payload.password);
    navigate("/");
  });

  const routeToLogin = () => {
    navigate("/register");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in with:", username, password);
    // Call the login function from the auth store
    await login(username, password);
    navigate("/");
  };
  return (
    <div className="max-w-md mx-auto mt-20 p-8 border border-gray-300 rounded-2xl shadow bg-white text-purple-400">
      <div>
        <div className="flex items-center justify-center gap-4  mb-5">
          <img src={Logo} alt="Walleta Logo" className="w-16 h-16" />
          <span className="text-3xl lg:text-4xl font-bold text-center pt-3">
            Walleta
          </span>
        </div>

        <div className="flex flex-col gap-4" onSubmit={submitForm}>
          <div>
            <label className="font-semibold">User Name</label>
            <input
              placeholder="Enter User Name"
              type="text"
              name="username"
              onChange={handleChange({ name: "username" })}
              onBlur={handleBlur}
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
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange({ name: "password" })}
              onBlur={handleBlur}
              className="border border-gray-300 p-2 rounded"
              value={values.password}
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

          <div className="flex flex-col items-center justify-between gap-5">
            <span className="text-sm text-purple-400 cursor-pointer">
              No account?{" "}
              <span onClick={routeToLogin} className="font-semibold">
                Register Here
              </span>
            </span>
            <span
              className="text-sm text-purple-400 cursor-pointer"
              onClick={() => navigate("/forget-password")}
            >
              Forgot Password?
            </span>
          </div>

          <CustomButton
            onSubmit={submitForm}
            text={"Login"}
            className="text-white mb-5"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
