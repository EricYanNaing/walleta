import React, { useMemo } from "react";
import Logo from "@/assets/img/logo.png";
import { HiMenuAlt3 } from "react-icons/hi";
import toast,{Toaster} from "react-hot-toast";
import { useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";


const Header = () => {
  const {user} = useAuthStore();
  const {pathname} = useLocation();
  const notify = () => toast.success('Here is your toast.');

  const routeTitles = {
    '/' : 'Walleta',
    '/list' : 'All Transactions',
    '/chart' : 'Data Analysis',
    '/profile' : 'Profile'
  };

  const headerText = useMemo(() => {
    return routeTitles[pathname] || 'Walleta';
  },[pathname])
  
  return (
    <section className="header p-5">
      <div className="flex justify-between items-center">
        <div className="">
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="h-12 w-12" />
            <span className="font-bold pt-1.5">{headerText}</span>
          </div>
          <p className="text-white font-bold">Your personal finance tracker</p>
        </div>
        <div className="mb-5 text-white cursor-pointer">
          {/* <HiMenuAlt3 onClick={notify} className="text-2xl" />
          <Toaster /> */}
        </div>
      </div>
      <div className="mt-8 mb-2 font-bold">
          <p>Hi, {user.name}</p>
      </div>
    </section>
  );
};

export default Header;
