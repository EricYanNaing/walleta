import React, { useEffect } from "react";
import { FaBahtSign } from "react-icons/fa6";
import { splitNumberComma, emotionEmoji } from "../../utils/common";
import { BiSolidDownArrow } from 'react-icons/bi';
import { BiSolidUpArrow } from 'react-icons/bi';
import List from "./List";
import useAuthStore from "../../store/useAuthStore";
import WelcomeCard from "../../components/WelcomeCard";
import "./Home.css";
import { getUserBalance } from "../../api";

const Home = () => {
  const { user, getUserData } = useAuthStore();
  const [userTotalbalance, setUserTotalbalance] = useState({});

  const getUserAllBalance = async () => {
    const res = await getUserBalance(user?.id);
    if (res.status === 200) {
      setUserTotalbalance(res.data);
    }
  }

  useEffect(() => {
    if (user?.id) {
      getUserData(user.id, 'home');
      getUserAllBalance();
    }
  }, [userTotalbalance]);

  // Check if user has any transactions or balance
  const hasBalance = user?.totalAmount > 0 || user?.totalIncome > 0 || user?.totalExpense > 0;

  console.log("User in Home:", user);
  return (
    <div className="flex flex-col gap-4 main home-container">
      {/* Show welcome card for new users */}
      {!hasBalance && <WelcomeCard />}

      {/* Balance Card with Glassmorphism */}
      <div className="balance-card group">
        <div className="balance-card-inner">
          <div className="flex-1">
            <p className="balance-label">Your total balance is</p>
            <div className="balance-amount">
              <FaBahtSign className="currency-icon" />
              <span className="amount-text">
                {user?.totalAmount ? splitNumberComma(user.totalAmount) : '0'}
              </span>
            </div>
          </div>
          <div className="emoji-container">
            <img
              src={emotionEmoji(user?.totalAmount || 0)}
              alt="emotion"
              className="emotion-emoji"
            />
          </div>
        </div>
      </div>

      {/* Income & Expense Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {/* Income Card */}
        <div className="stat-card income-card group">
          <div className="stat-card-content">
            <div className="stat-header">
              <div className="stat-icon-wrapper income-icon">
                <BiSolidDownArrow className="stat-icon" />
              </div>
              <p className="stat-label">Income</p>
            </div>
            <div className="stat-amount">
              <FaBahtSign className="stat-currency" />
              <span className="stat-value">
                {user?.totalIncome ? splitNumberComma(user.totalIncome) : '0'}
              </span>
            </div>
          </div>
        </div>

        {/* Expense Card */}
        <div className="stat-card expense-card group">
          <div className="stat-card-content">
            <div className="stat-header">
              <div className="stat-icon-wrapper expense-icon">
                <BiSolidUpArrow className="stat-icon" />
              </div>
              <p className="stat-label">Expense</p>
            </div>
            <div className="stat-amount">
              <FaBahtSign className="stat-currency" />
              <span className="stat-value">
                {user?.totalExpense ? splitNumberComma(user.totalExpense) : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="divider"></div>

      {/* Transaction List */}
      <div>
        <List />
      </div>
    </div>
  );
};

export default Home;
