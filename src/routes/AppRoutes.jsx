import { Routes,Route } from "react-router-dom";
import Home from '@/pages/Home/Index';
import List from '@/pages/List/Index'
import Chart from '@/pages/Chart/Index'
import Profile from '@/pages/Profile/Index'
import Form from '../pages/List/Form'
import Testing from '@/pages/Testing/Index';
import ProtectRoutes from "./ProtectRoutes";
import Login from "../pages/Auth/Login";
import RegisterUser from "../pages/Auth/RegisterUser";
import ForgetPassword from "../pages/Auth/ForgetPassword";

const AppRoutes = () => {
    return(
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterUser />} />
            <Route path="/forget-password" element={<ForgetPassword />} />

            {/* Protected Routes */}
            <Route path="/" element={<ProtectRoutes><Home /></ProtectRoutes>} />
            <Route path="/list" element={<ProtectRoutes><List /></ProtectRoutes>} />
            <Route path="/chart" element={<ProtectRoutes><Chart /></ProtectRoutes>} />
            <Route path="/profile" element={<ProtectRoutes><Profile /></ProtectRoutes>} />
            <Route path="/transactionform" element={<ProtectRoutes><Form /></ProtectRoutes>} />
            {/* Protected Routes */}
        </Routes>
    )
}

export default AppRoutes;