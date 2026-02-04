import React, { useState } from "react";
import TransactionForm from "./TransactionForm";
import SubCategoryForm from "./SubCategoryForm";
import { FaExchangeAlt, FaLayerGroup } from "react-icons/fa";

const Form = () => {
  const [isActive, setIsActive] = useState(1);

  const tabs = [
    { id: 1, label: "Transaction", icon: FaExchangeAlt },
    { id: 2, label: "Sub-Category", icon: FaLayerGroup },
  ];

  return (
    <section className="main !min-h-[calc(100vh-240px)] flex flex-col gap-6">
      {/* Header Section */}
      <div className="pt-6">
        <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Create New
        </p>
        <p className="text-gray-500 text-sm">Add a new transaction or category</p>
      </div>

      {/* Modern Tab Switcher */}
      <div className="relative bg-white/60 backdrop-blur-md rounded-2xl p-2 shadow-lg border border-white/40">
        {/* Sliding Background */}
        <div
          className={`absolute top-2 h-[calc(100%-16px)] bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl transition-all duration-300 ease-out shadow-md ${isActive === 1 ? "left-2 w-[calc(50%-8px)]" : "left-[calc(50%+2px)] w-[calc(50%-8px)]"
            }`}
        ></div>

        {/* Tab Buttons */}
        <div className="relative flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActiveTab = isActive === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setIsActive(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${isActiveTab
                  ? "text-white scale-105"
                  : "text-gray-600 hover:text-purple-600 hover:scale-102"
                  }`}
              >
                <Icon className={`text-lg transition-transform duration-300 ${isActiveTab ? "scale-110" : ""}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Section with Fade Animation */}
      <div className="flex-1 animate-fadeIn">
        {isActive === 1 ? (
          <TransactionForm isActive={isActive} />
        ) : (
          <SubCategoryForm isActive={isActive} />
        )}
      </div>

      {/* Add custom animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Form;
