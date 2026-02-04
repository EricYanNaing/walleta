import React, { useEffect, useState } from "react";
import { FaBahtSign } from "react-icons/fa6";
import Dropdown from "../../components/CustomSelect";
import BarChart from "./BarChart";
import DoughnutChart from "./DoughnutChart";
import { getCashFlowChart, getBudgetChart, getUserBalance } from "../../api";
import { MdDateRange, MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { PiDotsNineBold } from "react-icons/pi";
import { FaWallet, FaPiggyBank } from "react-icons/fa";
import useAuthStore from "../../store/useAuthStore";

const cashflowOptions = [
  { name: "Monthly", value: "monthly" },
  { name: "Yearly", value: "yearly" },
];

const budgetOptions = [
  { name: "Monthly", value: "monthly" },
  { name: "Yearly", value: "yearly" },
];

const categoryTypeOptions = [
  { name: "Income", value: "INCOME" },
  { name: "Expense", value: "EXPENSE" },
];

const Chart = () => {
  const [selectedOption, setSelectedOption] = useState(cashflowOptions[0]);
  const [selectedBudgetOption, setSelectedBudgetOption] = useState(budgetOptions[0]);
  const [selectedCategoryTypeOption, setSelectedCategoryTypeOption] = useState(categoryTypeOptions[0]);
  const [cashFlowChartData, setCashFlowChartData] = useState([]);
  const [budgetChartData, setBudgetChartData] = useState([]);
  const [userBalance, setUserBalance] = useState([]);
  const [cashflowIsOpen, setCashflowIsOpen] = useState(false);
  const [budgetIsOpen, setBudgetIsOpen] = useState(false);
  const [categoryTypeIsOpen, setCategoryTypeIsOpen] = useState(false);
  const { user } = useAuthStore();

  const toggleCashflowOption = (option) => {
    console.log("Selected option :", option);
    setSelectedOption(option);
  };

  const toggleBudgetOption = (option) => {
    console.log("Selected option :", option);
    setSelectedBudgetOption(option);
  };

  const toggleCategoryTypeOption = (option) => {
    console.log("Selected option :", option);
    setSelectedCategoryTypeOption(option);
  };

  const fetchCashFlowChart = async () => {
    const res = await getCashFlowChart(selectedOption.value);
    if (res.status === 200) {
      console.log("Cash Flow Chart :", res.data);
      setCashFlowChartData(res.data);
    }
  };

  const fetchBudgetChart = async () => {
    const payload = {
      period: selectedBudgetOption.value,
      type: selectedCategoryTypeOption.value
    }
    const res = await getBudgetChart(payload);
    if (res.status === 200) {
      console.log("Budget Chart :", res.data);
      setBudgetChartData(res.data);
    }
  };

  const fetchUserBudget = async () => {
    const res = await getUserBalance();
    if (res.status === 200) {
      console.log("User Budget :", res.data);
      setUserBalance(res.data);
    }
  };

  useEffect(() => {
    fetchUserBudget();
  }, []);

  useEffect(() => {
    fetchCashFlowChart();
  }, [selectedOption.value]);

  useEffect(() => {
    fetchBudgetChart();
  }, [selectedBudgetOption.value, selectedCategoryTypeOption.value]);

  return (
    <div className="flex flex-col gap-6 main pb-8">
      {/* Header Section */}
      <div className="pt-6">
        <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Data Analysis
        </p>
        <p className="text-gray-500 text-sm">Your personal finance tracker</p>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Income Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 font-medium text-sm">Total Income</span>
              <MdTrendingUp className="text-white/80" size={24} />
            </div>
            <div className="text-2xl font-bold text-white flex items-center gap-1">
              <FaBahtSign className="text-xl" />
              {userBalance?.totalIncome}
            </div>
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-400 to-red-500 p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 font-medium text-sm">Total Expense</span>
              <MdTrendingDown className="text-white/80" size={24} />
            </div>
            <div className="text-2xl font-bold text-white flex items-center gap-1">
              <FaBahtSign className="text-xl" />
              {userBalance?.totalExpense || 0}
            </div>
          </div>
        </div>

        {/* Saving Limit Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 font-medium text-sm">Saving Limit</span>
              <FaPiggyBank className="text-white/80" size={22} />
            </div>
            <div className="text-2xl font-bold text-white flex items-center gap-1">
              <FaBahtSign className="text-xl" />
              {user?.limitAmount || 0}
            </div>
          </div>
        </div>

        {/* Current Balance Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 font-medium text-sm">Current Balance</span>
              <FaWallet className="text-white/80" size={22} />
            </div>
            <div className="text-2xl font-bold text-white flex items-center gap-1">
              <FaBahtSign className="text-xl" />
              {userBalance?.totalBalance || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Cashflow Chart Section */}
      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Cashflow Chart
            </h2>
            <p className="text-gray-500 text-xs mt-1">
              <span className="font-bold">
                {selectedOption?.name}</span> Income vs Expense over time</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-sm">
            <Dropdown
              icon={<MdDateRange size={20} />}
              subCategoryList={cashflowOptions}
              handleSelectChange={toggleCashflowOption}
              className={"text-sm text-purple-600 border-purple-300"}
              searchFunc={false}
              selectedSubCategory={selectedOption}
              dropDownDirection={"right"}
              isOpen={cashflowIsOpen}
              setIsOpen={(value) => {
                setCashflowIsOpen(value);
                if (value) {
                  setBudgetIsOpen(false);
                  setCategoryTypeIsOpen(false);
                }
              }}
            />
          </div>
        </div>
        <BarChart selectedTitle={selectedOption?.name} data={cashFlowChartData} className="mt-2" />
      </div>

      {/* Budget Breakdown Chart Section */}
      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Budget Breakdown Chart
            </h2>
            <p className="text-gray-500 text-xs mt-1"><span className="font-bold">
              {selectedBudgetOption?.name} {selectedCategoryTypeOption?.name}</span> Category distribution analysis</p>
          </div>
          <div className="flex gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-sm">
            <Dropdown
              icon={<MdDateRange size={20} />}
              subCategoryList={budgetOptions}
              handleSelectChange={toggleBudgetOption}
              className={"text-sm text-purple-600 border-purple-300"}
              searchFunc={false}
              selectedSubCategory={selectedBudgetOption}
              dropDownDirection={"right"}
              isOpen={budgetIsOpen}
              setIsOpen={(value) => {
                setBudgetIsOpen(value);
                if (value) {
                  setCashflowIsOpen(false);
                  setCategoryTypeIsOpen(false);
                }
              }}
            />

            <Dropdown
              icon={<PiDotsNineBold size={20} />}
              subCategoryList={categoryTypeOptions}
              handleSelectChange={toggleCategoryTypeOption}
              className={"text-sm text-purple-600 border-purple-300"}
              searchFunc={false}
              selectedSubCategory={selectedCategoryTypeOption}
              dropDownDirection={"right"}
              isOpen={categoryTypeIsOpen}
              setIsOpen={(value) => {
                setCategoryTypeIsOpen(value);
                if (value) {
                  setCashflowIsOpen(false);
                  setBudgetIsOpen(false);
                }
              }}
            />
          </div>
        </div>
        <DoughnutChart data={budgetChartData} className="mt-2" />
      </div>
    </div>
  );
};

export default Chart;
