import { Routes,Route } from "react-router-dom";
import Home from '../pages/Home/index.jsx';
import List from '../pages/List/index.jsx'
import Chart from '../pages/Chart/index.jsx'
import Profile from '../pages/Profile/index.jsx'
import Form from '../pages/List/Form.jsx'
import Testing from '../pages/Testing/index.jsx';
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