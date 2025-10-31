import React, { useEffect, useState } from "react";
import { FaBahtSign } from "react-icons/fa6";
import Dropdown from "../../components/CustomSelect";
import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";

const cashflowOptions = [
  { name: "Monthly", value: "monthly" },
  { name: "Yearly", value: "yearly" },
];

const Chart = () => {
  const [selectedOption, setSelectedOption] = useState(cashflowOptions[0]);

  const toggleCashflowOption = (option) => {
    console.log("Selected option :", option);
    setSelectedOption(option);
  };

  return (
    <div className="flex flex-col gap-5 main">
      <div className="grid grid-cols-2 gap-4 pt-5  text-nowrap">
        <div className="bg-green-300 p-5 rounded-[15px]">
          <span className="font-semibold">Total Income</span>
          <div className="text-xl font-extrabold">
            <FaBahtSign className="inline-block" /> 100,000
          </div>
        </div>
        <div className="bg-red-300 p-5 rounded-[15px]">
          <span className="font-semibold">Total Expense</span>
          <div className="text-xl font-extrabold">
            <FaBahtSign className="inline-block" /> 50,000
          </div>
        </div>
        <div className="bg-indigo-300 p-5 rounded-[15px]">
          <span className="font-semibold">Saving Limit</span>
          <div className="text-xl font-extrabold">
            <FaBahtSign className="inline-block" /> 100,000
          </div>
        </div>
        <div className="bg-purple-300 p-5 rounded-[15px]">
          <span className="font-semibold">Current Balance</span>
          <div className="text-xl font-extrabold">
            <FaBahtSign className="inline-block" /> 100,000
          </div>
        </div>
      </div>
      <hr className="bg-purple-800 my-3" />
      {/* Bar Chart */}
      <div className="text-red-300 text-xl font-semibold">
        <div className="flex justify-between items-center">
          <span>Cashflow Chart</span>
          <div className="min-w-[90px]">
            <Dropdown
              subCategoryList={cashflowOptions}
              handleSelectChange={toggleCashflowOption}
              className={"text-sm text-red-300 border-red-300"}
              searchFunc={false}
              selectedSubCategory={selectedOption}
            />
          </div>
        </div>

        <BarChart selectedTitle={selectedOption?.name} className="mt-5 " />
      </div>

      <hr className="bg-purple-800 my-3" />
      {/* Bar Chart */}
      <div className="text-red-300 text-xl font-semibold">
        <div className="flex justify-between items-center">
          <span>Budget Breakdown Chart</span>
          <div className="min-w-[90px]">
            <Dropdown
              subCategoryList={cashflowOptions}
              handleSelectChange={toggleCashflowOption}
              className={"text-sm text-red-300 border-red-300"}
              searchFunc={false}
              selectedSubCategory={selectedOption}
            />
          </div>
        </div>

        <DoughnutChart className="mt-5 " />
      </div>
    </div>
  );
};

export default Chart;
