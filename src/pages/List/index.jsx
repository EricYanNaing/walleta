import React, { useEffect, useState } from "react";
import { transactionsResponse } from "../Home/fakeTransactionsList";
import { FaBahtSign } from "react-icons/fa6";
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from "react-router-dom";
import { getTransactionsList } from "../../api";
import useAuthStore from "../../store/useAuthStore";
import { formatPrettyDate } from "../../utils/common";

const List = () => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user);
  const [transactionsData, setTransactionsData] = useState([]);
  const filterList = [
    {
      name: "All",
      value: "",
    },
    {
      name: "EXPENSE",
      value: "EXPENSE",
    },
    {
      name: "INCOME",
      value: "INCOME",
    },
  ];

  const [filter, setFilter] = useState(filterList[0].value);

  const toggleFilter = (v) => {
    console.log("Filter Value:", v.value);
    setFilter(v.value);
    getTransactions(v.value);
  };

  const getTransactions = async (filterValue = "") => {
    try {
      const payload = {
        userId: user.id,
        page: 1,
        // pageSize: 1,
      }
      const response = await getTransactionsList(payload); // Simulated API fetch
      console.log("Response :", response);
      if (response.status === 200) {
        console.log("Data :", response.data?.items);
      }
      if (filterValue) {
        const filterTransactions = response.data?.items.filter(
          (data) => data.type === filterValue
        );
        const grouped = groupTransactionsByDate(filterTransactions);
        setTransactionsData(grouped);
      } else {
        // Step 1: Sort & group by date
        const grouped = groupTransactionsByDate(response.data?.items);

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

      //   if (tx.category === "INCOME") acc[date].totals.income += tx.amount;
      //   if (tx.category === "EXPENSE") acc[date].totals.expense += tx.amount;

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
              className={`cursor-pointer p-3 rounded-2xl min-w-[80px] text-center duration-700 transition-all ease-in-out  ${isActive ? "bg-[#b892ff] text-white" : ""
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
            <p className="mb-2 font-bold text-purple-500">{formatPrettyDate(transaction.date)}</p>
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
                      <p className="text-gray-700">{value.subCategory?.name}</p>
                      <p className="text-gray-400 text-xs">{value.description}</p>
                    </div>
                  </div>
                  <div
                    className={
                      value.type === "INCOME"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {value.type === "INCOME" ? "+" : "-"}
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
