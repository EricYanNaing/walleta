import React from 'react';

const AuthLoader = ({ isLoading }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[10000]">
            <div className="relative w-24 h-24 animate-spin">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 opacity-75 blur-sm"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 opacity-50 blur-md"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 opacity-25 blur-lg"></div>
                <div className="absolute inset-2 rounded-full bg-white"></div>
            </div>
        </div>
    );
};

export default AuthLoader;
