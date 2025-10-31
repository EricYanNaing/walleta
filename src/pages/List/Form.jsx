import React, { useState } from "react";
import TransactionForm from "./TransactionForm";
import SubCategoryForm from "./SubCategoryForm";

const Form = () => {
  const [isActive, setIsActive] = useState(1);

  return (
    <section className="bg-white h-[calc(100vh-80px)] p-5 flex flex-col gap-3">
      <div className="flex items-center justify-center text-center border border-gray-300 rounded-2xl text-purple-800">
        <div
          onClick={() => setIsActive(1)}
          className={`p-2 w-full rounded-2xl cursor-pointer transition-all duration-500 ease-in-out ${
            isActive === 1 ? "bg-[#b892ff] text-white" : ""
          }`}
        >
          <span>Transaction</span>
        </div>
        <div
          onClick={() => setIsActive(2)}
          className={`p-2 w-full rounded-2xl cursor-pointer transition-all duration-500 ease-in-out ${
            isActive === 2 ? "bg-[#b892ff] text-white" : ""
          }`}
        >
          <span>Sub-Category</span>
        </div>
      </div>

      {/* Form Section */}
      {isActive === 1 ? <TransactionForm isActive={isActive} /> : <SubCategoryForm isActive={isActive} />}
    </section>
  );
};

export default Form;
