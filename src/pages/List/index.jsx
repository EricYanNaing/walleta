import React, { useEffect, useState } from "react";
import { FaBahtSign } from "react-icons/fa6";
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from "react-router-dom";
import { getTransactionsList } from "../../api";
import useAuthStore from "../../store/useAuthStore";
import { formatPrettyDate } from "../../utils/common";
import NoData from "../../components/NoData";
import "./List.css";

const List = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [transactionsData, setTransactionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const filterList = [
    {
      name: "All",
      value: "",
      icon: "📊",
    },
    {
      name: "Expense",
      value: "EXPENSE",
      icon: "💸",
    },
    {
      name: "Income",
      value: "INCOME",
      icon: "💰",
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
      setIsLoading(true);
      const payload = {
        userId: user.id,
        page: 1,
      };
      const response = await getTransactionsList(payload);
      console.log("Response:", response);

      if (response.status === 200) {
        console.log("Data:", response.data?.items);

        if (filterValue) {
          const filterTransactions = response.data?.items.filter(
            (data) => data.type === filterValue
          );
          const grouped = groupTransactionsByDate(filterTransactions);
          setTransactionsData(grouped);
        } else {
          const grouped = groupTransactionsByDate(response.data?.items);
          setTransactionsData(grouped);
        }
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupTransactionsByDate = (transactions) => {
    const grouped = transactions.reduce((acc, tx) => {
      const date = tx.date;
      if (!acc[date]) acc[date] = { date, items: [] };
      acc[date].items.push(tx);
      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <section className="list-page-container main">
      {/* Header with gradient background */}
      <div className="list-header">
        <h1 className="list-title">All Transactions</h1>
        <p className="list-subtitle">Track your financial journey</p>
      </div>

      {/* Filter Pills */}
      <div className="filter-container">
        {filterList.map((v) => {
          const isActive = v.value === filter;
          return (
            <button
              onClick={() => toggleFilter(v)}
              key={v.name}
              className={`filter-pill ${isActive ? "active" : ""}`}
            >
              <span className="filter-icon">{v.icon}</span>
              <span className="filter-text">{v.name}</span>
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading transactions...</p>
        </div>
      )}

      {/* Transactions List */}
      {!isLoading && transactionsData.length === 0 ? (
        <NoData />
      ) : (
        !isLoading && (
          <div className="transactions-container">
            {transactionsData.map((transaction, index) => (
              <div
                key={index}
                className="date-group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Date Header */}
                <div className="date-header">
                  <div className="date-badge">
                    {formatPrettyDate(transaction.date)}
                  </div>
                  <div className="date-line"></div>
                </div>

                {/* Transaction Items */}
                <div className="transaction-items">
                  {transaction.items.map((value, i) => (
                    <div
                      key={i}
                      className="transaction-card"
                      style={{ animationDelay: `${(index * 0.1) + (i * 0.05)}s` }}
                    >
                      {/* Left Side - Icon & Details */}
                      <div className="transaction-left">
                        <div className="transaction-icon-container">
                          <img
                            src={value.subCategory?.categoryImg || "https://cdn-icons-png.flaticon.com/128/13906/13906210.png"}
                            alt="category"
                            className="transaction-icon-img"
                          />
                        </div>
                        <div className="transaction-info">
                          <p className="transaction-name">{value.subCategory?.name}</p>
                          <p className="transaction-desc">{value.description}</p>
                        </div>
                      </div>

                      {/* Right Side - Amount */}
                      <div className={`transaction-amount-badge ${value.type === "INCOME" ? "income" : "expense"}`}>
                        <span className="amount-sign">
                          {value.type === "INCOME" ? "+" : "-"}
                        </span>
                        <FaBahtSign className="amount-icon" />
                        <span className="amount-number">{value.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Floating Add Button */}
      <button
        onClick={() => navigate('/transactionform')}
        className="fab-button"
        aria-label="Add new transaction"
      >
        <FaPlus className="fab-icon" />
      </button>
    </section>
  );
};

export default List;
