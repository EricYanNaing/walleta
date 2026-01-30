import React from 'react';
import { FaHandSparkles } from 'react-icons/fa6';
import { BiPlusCircle } from 'react-icons/bi';
import CustomButton from './CustomButton';
import { useNavigate } from 'react-router-dom';

const WelcomeCard = () => {
    const navigate = useNavigate();
    const onAction = () => {
        navigate("/profile");
    }
    return (
        <div className="bg-gradient-to-br from-purple-100 to-white border-2 border-purple-200 p-6 rounded-[35px] text-center flex flex-col items-center gap-4 my-4 shadow-sm">
            <div className="bg-purple-500 p-4 rounded-full text-white text-3xl">
                <FaHandSparkles />
            </div>
            <div>
                <h3 className="text-xl font-bold text-purple-900">Welcome to Walleta!</h3>
                <p className="text-purple-600 mt-2 text-sm px-4">
                    It looks like you're new here. Let's start tracking your finances by adding your first transaction.
                </p>
            </div>
            <CustomButton
                onSubmit={onAction}
                text={"Get Started"}
                className="mt-2 flex items-center gap-2  text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
            />
        </div>
    );
};

export default WelcomeCard;
