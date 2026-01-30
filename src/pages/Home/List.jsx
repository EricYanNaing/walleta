import React, { useEffect, useState } from "react";
import { BiSolidRightArrowCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { getTransactionsList } from "../../api";
import { FaBahtSign } from "react-icons/fa6";
import useAuthStore from "../../store/useAuthStore";
import NoData from "../../components/NoData";

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
    <section className="transaction-list-section">
      <div className="transaction-header">
        <p className="transaction-title">Recent Transactions</p>
        <div onClick={() => navigate("/list")} className="view-all-btn">
          <BiSolidRightArrowCircle className="view-all-icon" />
        </div>
      </div>

      {transactionsData.length === 0 ? (
        <NoData />
      ) : (
        <div className="transaction-list">
          {transactionsData.map((transaction, index) => (
            <div
              key={index}
              className="transaction-item"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="transaction-content">
                <div className="transaction-left">
                  <div className="transaction-icon-wrapper">
                    {transaction.subCategory?.categoryImg ? (
                      <img
                        src={transaction.subCategory.categoryImg}
                        alt="category"
                        className="transaction-icon"
                      />
                    ) : (
                      <img
                        src='https://cdn-icons-png.flaticon.com/128/13906/13906210.png'
                        alt="category"
                        className="transaction-icon"
                      />
                    )}
                  </div>
                  <div className="transaction-details">
                    <p className="transaction-category">{transaction.subCategory.name}</p>
                    <p className="transaction-description">{transaction.description}</p>
                  </div>
                </div>
                <div className={`transaction-amount ${transaction.type === "INCOME" ? "income" : "expense"}`}>
                  <span className="amount-sign">{transaction.type === "INCOME" ? "+" : "-"}</span>
                  <FaBahtSign className="amount-currency" />
                  <span className="amount-value">{transaction.amount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default List;
