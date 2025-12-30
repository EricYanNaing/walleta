import React, { useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import CustomButton from "../../components/CustomButton";
import useAuthStore from "../../store/useAuthStore";
import CustomModal from "../../components/CustomModal";

const Profile = () => {
  const { logout, user } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);


  const handleLogout = () => {
    // Implement logout logic here
    logout();
    setOpen(false);
  };
  const [editing, setEditing] = useState({
    username: false,
    email: false,
    password: false,
    budget: false,
  });

  const toggleEdit = (field) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  return (
    <div className="flex flex-col gap-5 main !min-h-[80vh]">
      <div className="text-purple-400 pt-5 flex flex-col gap-7">
        <div>
          <label className="font-semibold">Nick Name</label>
          <div className="flex items-center justify-between gap-10">
            <input
              value={user.username}
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
                onClick={() => toggleEdit("username")}
              />
            )}
          </div>
        </div>
        <div>
          <label className="font-semibold">Email</label>
          <div className="flex items-center justify-between gap-10">
            <input
              value={user.email}
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
                onClick={() => toggleEdit("email")}
              />
            )}
          </div>
        </div>
        {/* <div>
          <label className="font-semibold">Password</label>
          <div className="flex items-center justify-between gap-10 relative">
            <input
              type={showPassword ? "text" : "password"}
              value={user.password}
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
                onClick={() => toggleEdit("password")}
              />
            )}
          </div>
        </div> */}
        <div>
          <label className="font-semibold">Budget Limit</label>
          <div className="flex items-center justify-between gap-10">
            <input
              type="number"
              value={user.limitAmount}
              disabled={!editing.budget}
              className="border border-gray-300 p-2 rounded disabled:opacity-50 "
            />
            {!editing.budget && (
              <BsPencilSquare
                className="text-2xl ml-2 text-purple-500 cursor-pointer"
                onClick={() => toggleEdit("budget")}
              />
            )}
            {editing.budget && (
              <FaCheckCircle
                className="text-2xl text-green-500 cursor-pointer"
                onClick={() => toggleEdit("budget")}
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
    </div>
  );
};

export default Profile;
