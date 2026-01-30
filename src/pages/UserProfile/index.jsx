import React, { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import CustomButton from "../../components/CustomButton";
import useAuthStore from "../../store/useAuthStore";
import CustomModal from "../../components/CustomModal";
import { updateUserInfo } from "../../api";
import toast, { Toaster } from "react-hot-toast";

const Profile = () => {
  const { logout, user, getUserData } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);

  // Form state to track changes
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    limitAmount: user?.limitAmount ?? '', // Use nullish coalescing to allow 0 but default to empty string
    password: user?.password || '',
  });

  const handleLogout = () => {
    // Implement logout logic here
    logout();
    setOpen(false);
  };

  const [editing, setEditing] = useState({
    username: false,
    email: false,
    password: false,
    limitAmount: false,
  });

  const toggleEdit = (field) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Sync formData with user data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        limitAmount: user.limitAmount ?? '', // Use nullish coalescing
        password: user.password || '',
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async (field) => {
    let value = formData[field];
    console.log("Update User Info - Original value:", value, "Field:", field);

    // Convert limitAmount to number before sending
    if (field === 'limitAmount') {
      value = value === '' ? 0 : Number(value);
      console.log("Converted limitAmount to:", value);
    }

    // Allow 0 as a valid value
    if (value === null || value === undefined || (value === '' && field !== 'limitAmount')) {
      console.error("Value is null or undefined");
      return;
    }

    const params = {
      userId: user.id,
      data: {
        [field]: value,
      },
    };

    console.log("Sending params:", params);

    try {
      const res = await updateUserInfo(params);
      console.log("Update User Info Response:", res);

      // Refresh user data after successful update
      if (res.status === 201) {
        // await getUserData(user.id, 'profile');
        toast.success("User info updated successfully");
      }

      toggleEdit(field);
    } catch (error) {
      console.error("Error updating user info:", error);
      toast.error("Failed to update user info");
    }
  };
  return (
    <div className="flex flex-col gap-5 main !min-h-[80vh]">
      <div className="text-purple-400 pt-5 flex flex-col gap-7">
        <div>
          <label className="font-semibold">Nick Name</label>
          <div className="flex items-center justify-between gap-10">
            <input
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              disabled={!editing.username}
              className="border border-gray-300 p-2 rounded disabled:opacity-50"
            />
            {!editing.username && (
              <BsPencilSquare
                className="text-2xl ml-2 text-purple-500 cursor-pointer"
                onClick={() => toggleEdit("username")}
              />
            )}
            {editing.username && (
              <FaCheckCircle
                className="text-2xl text-green-500 cursor-pointer"
                onClick={() => handleUpdate("username")}
              />
            )}
          </div>
        </div>
        <div>
          <label className="font-semibold">Email</label>
          <div className="flex items-center justify-between gap-10">
            <input
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!editing.email}
              className="border border-gray-300 p-2 rounded disabled:opacity-50 "
            />
            {!editing.email && (
              <BsPencilSquare
                className="text-2xl ml-2 text-purple-500 cursor-pointer"
                onClick={() => toggleEdit("email")}
              />
            )}
            {editing.email && (
              <FaCheckCircle
                className="text-2xl text-green-500 cursor-pointer"
                onClick={() => handleUpdate("email")}
              />
            )}
          </div>
        </div>
        <div>
          <label className="font-semibold">Password</label>
          <div className="flex items-center justify-between gap-10 relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              disabled={!editing.password}
              className="border border-gray-300 p-2 rounded disabled:opacity-50 "
            />
            {!editing.password && (
              <BsPencilSquare
                className="text-2xl ml-2 text-purple-500 cursor-pointer"
                onClick={() => toggleEdit("password")}
              />
            )}
            {editing.password && !showPassword && (
              <FaEye
                className=" text-purple-500 cursor-pointer absolute right-20"
                onClick={() => setShowPassword(true)}
              />
            )}
            {editing.password && showPassword && (
              <FaEyeSlash
                className=" text-purple-500 cursor-pointer absolute right-20"
                onClick={() => setShowPassword(false)}
              />
            )}
            {editing.password && (
              <FaCheckCircle
                className="text-2xl text-green-500 cursor-pointer"
                onClick={() => handleUpdate("password")}
              />
            )}
          </div>
        </div>
        <div>
          <label className="font-semibold">Budget Limit</label>
          <div className="flex items-center justify-between gap-10">
            <input
              type="number"
              value={formData.limitAmount}
              onChange={(e) => handleInputChange('limitAmount', e.target.value)} // Keep as string while typing
              disabled={!editing.limitAmount}
              className="border border-gray-300 p-2 rounded disabled:opacity-50 "
            />
            {!editing.limitAmount && (
              <BsPencilSquare
                className="text-2xl ml-2 text-purple-500 cursor-pointer"
                onClick={() => toggleEdit("limitAmount")}
              />
            )}
            {editing.limitAmount && (
              <FaCheckCircle
                className="text-2xl text-green-500 cursor-pointer"
                onClick={() => handleUpdate("limitAmount")}
              />
            )}
          </div>
        </div>
        <div>
          <CustomButton
            onSubmit={() => setOpen(true)}
            text={"Logout"}
            className=""
          />
        </div>
      </div>

      <CustomModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleLogout}
        title="Logout Confirmation"
        confirmBtnText="Logout"
        cancelBtnText="Cancel"
        showCancelBtn={false}
        staticBackdrop={false}
      >
        <p>Are you sure you want to logout?</p>
      </CustomModal>
      <Toaster />
    </div>
  );
};

export default Profile;
