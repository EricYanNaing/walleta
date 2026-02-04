import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAuthStore from "../../store/useAuthStore";
import CustomModal from "../../components/CustomModal";
import { updateUserInfo } from "../../api";
import toast, { Toaster } from "react-hot-toast";
import { useFormValidation } from "../../hooks/useValidateForm";
import { required, minLen, pattern } from "../../utils/validate";

const Profile = () => {
  const { logout, user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);

  // Track original values to detect changes
  const [originalData, setOriginalData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    limitAmount: user?.limitAmount ?? '',
    password: user?.password || '',
  });

  const {
    values,
    errors,
    touched,
    setValues,
    handleChange,
    handleBlur,
    validateForm,
  } = useFormValidation({
    initialValues: {
      username: user?.username || '',
      email: user?.email || '',
      limitAmount: user?.limitAmount ?? '',
      password: user?.password || '',
    },
    rules: {
      username: [
        minLen(3, "Username must be at least 3 characters"),
        pattern(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
      ],
      email: [
        pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
      ],
      limitAmount: [
        // Optional field, no required validation
      ],
    },
    validateOnBlur: true,
    validateOnChange: false,
  });

  // Sync form values with user data when user changes
  useEffect(() => {
    if (user) {
      const userData = {
        username: user.username || '',
        email: user.email || '',
        limitAmount: user.limitAmount ?? '',
        password: user.password || '',
      };
      setValues(userData);
      setOriginalData(userData);
    }
  }, [user, setValues]);

  // Check if any field has been modified
  const hasChanges = () => {
    return Object.keys(values).some(key => {
      if (key === 'limitAmount') {
        return Number(values[key]) !== Number(originalData[key]);
      }
      return values[key] !== originalData[key];
    });
  };

  // Check if a specific field has been modified
  const isFieldModified = (field) => {
    if (field === 'limitAmount') {
      return Number(values[field]) !== Number(originalData[field]);
    }
    return values[field] !== originalData[field];
  };

  const handleSaveChanges = async () => {
    // Validate form first
    const validationErrors = await validateForm();
    const hasError = Object.values(validationErrors).some(Boolean);

    if (hasError) {
      toast.error("Please fix validation errors before saving");
      return;
    }

    const changedFields = {};

    Object.keys(values).forEach(field => {
      if (isFieldModified(field)) {
        let value = values[field];
        if (field === 'limitAmount') {
          value = value === '' ? 0 : Number(value);
        }
        changedFields[field] = value;
      }
    });

    if (Object.keys(changedFields).length === 0) {
      toast.error("No changes to save");
      return;
    }

    const params = {
      userId: user.id,
      data: changedFields,
    };

    try {
      const res = await updateUserInfo(params);

      if (res.status === 201) {
        toast.success("Profile updated successfully");
        // Update original data to match current form data
        setOriginalData({ ...values });
      }
    } catch (error) {
      console.error("Error updating user info:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setValues({ ...originalData });
    setShowPassword(false);
  };

  return (
    <div className="flex flex-col gap-6 main pb-8">
      {/* Header Section */}
      <div className="pt-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Profile Settings
        </h1>
        <p className="text-gray-500 text-sm">Manage your account information</p>
      </div>

      {/* Profile Card with Avatar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-6 shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-8 -mb-8"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold border-4 border-white/30">
            {values.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{values.username || 'User'}</h2>
            <p className="text-white/80 text-sm">{values.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>

      {/* Account Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Account Information</h3>

        {/* Username Field */}
        <div className={`bg-white/40 backdrop-blur-md rounded-2xl p-5 shadow-lg border transition-all duration-300 hover:shadow-xl ${isFieldModified('username') ? 'border-purple-400 ring-2 ring-purple-200' : 'border-white/20'}`}>
          <label className="text-sm font-semibold text-gray-600 mb-2 block">
            Username
            {isFieldModified('username') && <span className="ml-2 text-xs text-purple-600 font-normal">(modified)</span>}
          </label>
          <input
            name="username"
            value={values.username}
            onChange={handleChange()}
            onBlur={handleBlur}
            className="w-full bg-white/60 border border-purple-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder="Enter your username"
          />
          {touched.username && errors.username && (
            <p className="text-red-500 text-sm mt-2">{errors.username}</p>
          )}
        </div>

        {/* Email Field */}
        <div className={`bg-white/40 backdrop-blur-md rounded-2xl p-5 shadow-lg border transition-all duration-300 hover:shadow-xl ${isFieldModified('email') ? 'border-purple-400 ring-2 ring-purple-200' : 'border-white/20'}`}>
          <label className="text-sm font-semibold text-gray-600 mb-2 block">
            Email Address
            {isFieldModified('email') && <span className="ml-2 text-xs text-purple-600 font-normal">(modified)</span>}
          </label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange()}
            onBlur={handleBlur}
            className="w-full bg-white/60 border border-purple-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder="Enter your email"
          />
          {touched.email && errors.email && (
            <p className="text-red-500 text-sm mt-2">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className={`bg-white/40 backdrop-blur-md rounded-2xl p-5 shadow-lg border transition-all duration-300 hover:shadow-xl ${isFieldModified('password') ? 'border-purple-400 ring-2 ring-purple-200' : 'border-white/20'}`}>
          <label className="text-sm font-semibold text-gray-600 mb-2 block">
            Password
            {isFieldModified('password') && <span className="ml-2 text-xs text-purple-600 font-normal">(modified)</span>}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={values.password}
              onChange={handleChange()}
              onBlur={handleBlur}
              className="w-full bg-white/60 border border-purple-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-gray-700 pr-12"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-700 transition-colors"
            >
              {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
            </button>
          </div>
          {touched.password && errors.password && (
            <p className="text-red-500 text-sm mt-2">{errors.password}</p>
          )}
        </div>

        {/* Budget Limit Field */}
        <div className={`bg-white/40 backdrop-blur-md rounded-2xl p-5 shadow-lg border transition-all duration-300 hover:shadow-xl ${isFieldModified('limitAmount') ? 'border-purple-400 ring-2 ring-purple-200' : 'border-white/20'}`}>
          <label className="text-sm font-semibold text-gray-600 mb-2 block">
            Monthly Budget Limit
            {isFieldModified('limitAmount') && <span className="ml-2 text-xs text-purple-600 font-normal">(modified)</span>}
          </label>
          <input
            type="number"
            name="limitAmount"
            value={values.limitAmount}
            onChange={handleChange()}
            onBlur={handleBlur}
            className="w-full bg-white/60 border border-purple-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-gray-700"
            placeholder="Enter budget limit"
          />
          {touched.limitAmount && errors.limitAmount && (
            <p className="text-red-500 text-sm mt-2">{errors.limitAmount}</p>
          )}
        </div>
      </div>

      {/* Action Buttons - Show when changes detected */}
      {hasChanges() && (
        <div className="flex gap-3 animate-slideIn">
          <button
            onClick={handleCancel}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            Save Changes
          </button>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default Profile;
