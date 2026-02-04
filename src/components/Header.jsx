import React, { useMemo } from "react";
import Logo from "@/assets/img/logo.png";
import { HiMenuAlt3 } from "react-icons/hi";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";


const Header = () => {
  const { user } = useAuthStore();
  const { pathname } = useLocation();
  const notify = () => toast.success('Here is your toast.', {
    duration: 3000,
  });
  const navigate = useNavigate();

  const routeTitles = {
    '/': 'Paisa',
    '/list': 'All Transactions',
    '/chart': 'Data Analysis',
    '/profile': 'Profile'
  };

  const headerText = useMemo(() => {
    return routeTitles[pathname] || 'Paisa';
  }, [pathname])

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.username) return 'U';
    const names = user.username.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <section className="header relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-600"></div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24"></div>

      {/* Content */}
      <div className="relative z-10 p-5">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="h-20 w-20 cursor-pointer" onClick={() => navigate('/')} />
            <div>
              <p className="font-bold text-4xl md:text-6xl text-white tracking-tight">{headerText}</p>
              <p className="text-white/80 text-xs font-medium">Your personal finance tracker</p>
            </div>
          </div>

          {/* Menu Icon */}
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl cursor-pointer hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95">
            <HiMenuAlt3 onClick={notify} className="text-2xl text-white" />
          </div>
        </div>

        {/* User Greeting Section */}
        <div className="mt-6 flex items-center gap-3">
          {/* User Avatar */}
          <div className="bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-sm p-1 rounded-2xl shadow-lg">
            <div className="bg-gradient-to-br from-violet-400 to-fuchsia-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">{getUserInitials()}</span>
            </div>
          </div>

          {/* Greeting Text */}
          <div>
            <p className="text-white/70 text-xs font-medium">Welcome back,</p>
            <p className="text-white font-bold text-lg md:text-xl">{user?.username || 'Guest'}</p>
          </div>
        </div>
      </div>
      <Toaster />

    </section>
  );
};

export default Header;
