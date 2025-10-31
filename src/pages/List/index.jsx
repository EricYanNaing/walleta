import React, { useEffect, useState } from "react";
import { transactionsResponse } from "../Home/fakeTransactionsList";
import { FaBahtSign } from "react-icons/fa6";
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from "react-router-dom";

const List = () => {
  const navigate = useNavigate()
  const [transactionsData, setTransactionsData] = useState([]);
  const filterList = [
    {
      name: "All",
      value: "",
    },
    {
      name: "Expense",
      value: "Expense",
    },
    {
      name: "Income",
      value: "Income",
    },
  ];

  const [filter, setFilter] = useState(filterList[0].value);

  const toggleFilter = (v) => {
    setFilter(v.value);
    getTransactions(v.value);
  };

  const getTransactions = async (filterValue = "") => {
    try {
      const response = transactionsResponse; // Simulated API fetch

      if (filterValue) {
        const filterTransactions = response.data.filter(
          (data) => data.category === filterValue
        );
        const grouped = groupTransactionsByDate(filterTransactions);
        setTransactionsData(grouped);
      } else {
        // Step 1: Sort & group by date
        const grouped = groupTransactionsByDate(response.data);

        // Step 2: Save to state
        setTransactionsData(grouped);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Grouping function
  const groupTransactionsByDate = (transactions) => {
    const grouped = transactions.reduce((acc, tx) => {
      const date = tx.date;
      if (!acc[date]) acc[date] = { date, items: [] };

      acc[date].items.push(tx);

      //   if (tx.category === "Income") acc[date].totals.income += tx.amount;
      //   if (tx.category === "Expense") acc[date].totals.expense += tx.amount;

      return acc;
    }, {});

    // Convert to array & sort newest → oldest
    return Object.values(grouped).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <section className="main p-5 relative">
      <div className="flex justify-between items-center text-purple-800">
        {filterList.map((v) => {
          const isActive = v.value === filter;
          return (
            <div
              onClick={() => toggleFilter(v)}
              key={v.name}
              className={`cursor-pointer p-3 rounded-2xl min-w-[80px] text-center duration-700 transition-all ease-in-out  ${
                isActive ? "bg-[#b892ff] text-white" : ""
              }`}
            >
              <span>{v.name}</span>
            </div>
          );
        })}
      </div>

      <div className="text-black">
        {transactionsData.map((transaction, index) => (
          <div key={index} className="my-10">
            <p className="mb-2 font-bold text-purple-500">{transaction.date}</p>
            <div className="">
              {transaction.items.map((value, i) => (
                <div key={i} className="flex justify-between items-center py-2">
                  <div className="flex items-center">
                    {value.categoryImg ? (
                      <img
                        src={value.categoryImg}
                        alt="img"
                        width={40}
                        height={40}
                      />
                    ) : (
                      <img
                        src="https://cdn-icons-png.flaticon.com/128/13906/13906210.png"
                        alt="img"
                        width={40}
                        height={40}
                      />
                    )}
                    <div className="ml-4">
                      <p className="text-gray-700">{value.subCategory}</p>
                      <p className="text-gray-400 text-xs">{value.title}</p>
                    </div>
                  </div>
                  <div
                    className={
                      value.category === "Income"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {value.category === "Income" ? "+" : "-"}
                    <FaBahtSign className="inline mb-1" />
                    <span>{value.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Transactions or Category  */}
      <div onClick={() => navigate('/transactionform')} className="bg-purple-800 w-fit p-3 rounded-full add-btn border-2 border-purple-400">
        <FaPlus className="text-2xl" />
      </div>
    </section>
  );
};

export default List;
