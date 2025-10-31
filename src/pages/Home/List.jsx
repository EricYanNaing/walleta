import React, { useEffect, useState } from "react";
import { BiSolidRightArrowCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { transactionsResponse } from "./fakeTransactionsList";
import { FaBahtSign } from "react-icons/fa6";

const List = () => {
  const navigate = useNavigate();
  const [transactionsData, setTransactionsData] = useState([]);

  const getTransactions = async () => {
    try {
      const response = transactionsResponse; // Simulated API fetch
      console.log("Fetched Transactions:", response.data);
      // Step 1: Sort & group by date
      const grouped = groupTransactionsByDate(response.data);
      //   console.log("Grouped Transactions:", grouped);
      // Step 2: Save to state
      //   setTransactionsData(grouped);
      setTransactionsData(response.data);
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
    <section className="">
      <div className="flex items-center justify-between text-purple-800">
        <p className="font-bold">Recent Transactions</p>
        <div onClick={() => navigate("/list")}>
          <BiSolidRightArrowCircle className="text-3xl" />
        </div>
      </div>
      <div className="text-black">
        {transactionsData.map((transaction, index) => (
          <div key={index} className="my-10">
            {/* <p className="mb-1">{transaction.date}</p> */}
            <div className="">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {transaction.categoryImg ? (
                    <img
                      src={transaction.categoryImg}
                      alt="img"
                      width={40}
                      height={40}
                    />
                  ) : <img
                      src='https://cdn-icons-png.flaticon.com/128/13906/13906210.png'
                      alt="img"
                      width={40}
                      height={40}
                    />}
                  <div className="ml-4">
                    <p className="text-gray-700">{transaction.subCategory}</p>
                    <p className="text-gray-400 text-xs">{transaction.title}</p>
                  </div>
                </div>
                <div
                  className={
                    transaction.category === "Income"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {transaction.category === "Income" ? "+" : "-"}
                    <FaBahtSign className="inline mb-1" />
                  <span>{transaction.amount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default List;
