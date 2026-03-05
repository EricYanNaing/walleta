import React, { useEffect, useState } from "react";
import { FaBahtSign } from "react-icons/fa6";
import { FaPlus } from 'react-icons/fa6';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getTransactionsList, deleteTransaction, updateTransaction } from "../../api";
import useAuthStore from "../../store/useAuthStore";
import { AiOutlineEdit } from "react-icons/ai";
import { formatPrettyDate } from "../../utils/common";
import NoData from "../../components/NoData";
import EditTransactionModal from "./EditTransactionModal";
import "./List.css";
import toast from "react-hot-toast";

const List = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [transactionsData, setTransactionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isShowActionBtns, setIsShowActionBtns] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

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

  // Select Transaction
  const selectTransaction = (t) => {
    console.log("Selected Transaction:", t);
    console.log("Selected Transaction:", isShowActionBtns);
    if (selectedTransaction?.id === t.id) {
      setSelectedTransaction(null);
      setIsShowActionBtns(false);
      return;
    }
    setSelectedTransaction(t);
    setIsShowActionBtns(true);
  };

  // Delete Transaction
  const deleteTransactionHandler = async (id) => {
    try {
      setIsLoading(true);
      const response = await deleteTransaction(id);
      console.log("Response:", response);
      if (response.status === 204) {
        toast.success("Transaction deleted successfully");
        // Optimistically remove the item from local state — no reload needed
        setTransactionsData((prev) =>
          prev
            .map((group) => ({
              ...group,
              items: group.items.filter((item) => item.id !== id),
            }))
            .filter((group) => group.items.length > 0)
        );
        setSelectedTransaction(null);
        setIsShowActionBtns(false);
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    } finally {
      setIsLoading(false);
    }
  };

  // Update transaction in local state after edit saved
  const handleSaved = (updated) => {
    setTransactionsData((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.id === updated.id ? { ...item, ...updated } : item
        ),
      }))
    );
    setSelectedTransaction(null);
    setIsShowActionBtns(false);
  };

  const updateTransactionHandler = (t) => {
    console.log("Selected Transaction:", t);
    setEditingTransaction(t)
    setIsShowActionBtns(false);
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
                    <div key={i} className="flex items-center gap-2 justify-between">
                      {isShowActionBtns && selectedTransaction.id === value.id && (
                        <div className="action-btns flex flex-col gap-2 w-fit">
                          <button className="bg-emerald-100! text-emerald-800! font-semibold hover:shadow-md hover:shadow-emerald-200!  p-2!" onClick={() => updateTransactionHandler(value)}>
                            <AiOutlineEdit />
                          </button>
                          <button className="bg-red-100! text-red-600! font-semibold hover:shadow-md hover:shadow-red-200! p-2!" onClick={() => deleteTransactionHandler(value.id)}>
                            <FaTrashAlt />
                          </button>
                        </div>
                      )}
                      <div
                        className="transaction-card w-full"
                        style={{ animationDelay: `${(index * 0.1) + (i * 0.05)}s` }}
                        onClick={() => selectTransaction(value)}
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
                      </div></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Floating Add Button */}
      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSaved={handleSaved}
        />
      )}

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
