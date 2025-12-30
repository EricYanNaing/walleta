import React, { useEffect, useState } from "react";
import { BiSolidRightArrowCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { getTransactionsList } from "../../api";
import { FaBahtSign } from "react-icons/fa6";
import useAuthStore from "../../store/useAuthStore";

const List = () => {
  const navigate = useNavigate();
  const [transactionsData, setTransactionsData] = useState([]);
  const { user } = useAuthStore();

  const getTransactions = async () => {
    try {
      const payload = {
        userId: user.id,
        page: 1,
        // pageSize: 1,
      }
      console.log("Payload:", payload);
      const { data, status } = await getTransactionsList(payload);
      if (status === 200) {
        console.log("Fetched Transactions:", data?.items);
        // Step 1: Sort & group by date
        const grouped = groupTransactionsByDate(data?.items);
        console.log("Grouped Transactions:", grouped);
        setTransactionsData(data?.items);
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
    console.log("Transactions Data:", transactionsData);
  }, []);

  return (
    <section className="">
      <div className="flex items-center justify-between text-purple-800">
        <p className="font-bold">Recent Transactions</p>
        <div onClick={() => navigate("/list")}>
          <BiSolidRightArrowCircle className="text-3xl cursor-pointer" />
        </div>
      </div>
      <div className="text-black">
        {transactionsData.map((transaction, index) => (
          <div key={index} className="my-10">
            {/* <p className="mb-1">{transaction.date}</p> */}
            <div className="">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {transaction.subCategory?.categoryImg ? (
                    <img
                      src={transaction.subCategory.categoryImg}
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
                    <p className="text-gray-700">{transaction.subCategory.name}</p>
                    <p className="text-gray-400 text-xs">{transaction.description}</p>
                  </div>
                </div>
                <div
                  className={
                    transaction.type === "INCOME"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {transaction.type === "INCOME" ? "+" : "-"}
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
