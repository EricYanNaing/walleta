import React, { useEffect, useState } from "react";
import { BiSolidRightArrowCircle } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { getTransactionsList } from "../../api";
import { FaBahtSign } from "react-icons/fa6";
import useAuthStore from "../../store/useAuthStore";
import NoData from "../../components/NoData";
import { SAMPLE_TRANSACTIONS } from "../../constants/onboardingSamples";

const List = ({ showSamplePreview = false }) => {
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

  const shouldShowSample = showSamplePreview && transactionsData.length === 0;

  return (
    <section className="transaction-list-section">
      <div className="transaction-header">
        <p className="transaction-title">Recent Transactions</p>
        <div onClick={() => navigate("/list")} className="view-all-btn">
          <BiSolidRightArrowCircle className="view-all-icon" />
        </div>
      </div>

      {shouldShowSample ? (
        <SampleTransactionsPreview
          sampleItems={SAMPLE_TRANSACTIONS}
          onStart={() => navigate("/list")}
        />
      ) : transactionsData.length === 0 ? (
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

const SampleTransactionsPreview = ({ sampleItems, onStart }) => (
  <div className="rounded-3xl border border-dashed border-purple-200 bg-white/70 p-6 shadow-inner">
    <p className="text-sm font-semibold text-purple-600 uppercase tracking-[0.3em]">
      Guided preview
    </p>
    <h4 className="mt-1 text-xl font-semibold text-gray-800">
      See what your ledger will look like
    </h4>
    <p className="text-sm text-gray-600">
      We will replace these cards with your actual transactions after you add
      the first one.
    </p>

    <div className="mt-4 flex flex-col gap-3">
      {sampleItems.map((transaction) => (
        <div
          key={transaction.id}
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
            <div>
              <p className="text-base">{transaction.name}</p>
              <p className="text-xs text-gray-500">
                {transaction.description} • {transaction.date}
              </p>
            </div>
            <span
              className={`text-lg ${
                transaction.type === "INCOME"
                  ? "text-green-600"
                  : "text-rose-500"
              }`}
            >
              {transaction.type === "INCOME" ? "+" : "-"}฿
              {transaction.amount.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>

    <button
      type="button"
      onClick={onStart}
      className="mt-5 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
    >
      Add my first transaction
    </button>
  </div>
);
