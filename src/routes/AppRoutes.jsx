import { Routes,Route } from "react-router-dom";
import Home from '../pages/pages/Home/Index.jsx';
import List from '../pages/pages/List/Index.jsx'
import Chart from '../pages/pages/Chart/Index.jsx'
import Profile from '../pages/pages/Profile/Index.jsx'
import Form from '../pages/List/Form.jsx'
import Testing from '../pages/pages/Testing/Index.jsx';
import ProtectRoutes from "./ProtectRoutes.jsx";
import Login from "../pages/Auth/Login.jsx";
import RegisterUser from "../pages/Auth/RegisterUser.jsx";
import ForgetPassword from "../pages/Auth/ForgetPassword.jsx";

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