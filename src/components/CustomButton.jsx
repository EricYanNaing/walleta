import React from "react";

const CustomButton = ({ text, outline = false, onSubmit ,className }) => {
  return (
    <div className={`pt-6 w-full cursor-pointer ${className}`} onClick={onSubmit}>
      <div
        className={` w-full p-2 rounded-[10px] text-center duration-500 transition-all ease-in-out
            
        ${
          outline
            ? "border border-purple-700 text-purple-700 hover:bg-purple-100"
            : "bg-purple-700 text-white hover:bg-purple-500"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default CustomButton;
