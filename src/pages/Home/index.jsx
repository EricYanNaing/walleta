import React, { useEffect, useState } from "react";
import { FaBahtSign } from "react-icons/fa6";
import { splitNumberComma, emotionEmoji } from "../../utils/common";
import { BiSolidDownArrow } from 'react-icons/bi';
import { BiSolidUpArrow } from 'react-icons/bi';
import List from "./List";
import useAuthStore from "../../store/useAuthStore";
import WelcomeCard from "../../components/WelcomeCard";
import "./Home.css";
import { getUserBalance } from "../../api";
import OnboardingCoachMarks from "../../components/OnboardingCoachMarks";
import { SAMPLE_BALANCE_SNAPSHOT } from "../../constants/onboardingSamples";

const Home = () => {
  const { user, getUserData } = useAuthStore();
  const [userTotalbalance, setUserTotalbalance] = useState({});
  const [showOnboardingCoach, setShowOnboardingCoach] = useState(false);

  const getUserAllBalance = async () => {
    const res = await getUserBalance(); // No userId needed - backend uses auth token
    if (res.status === 200) {
      setUserTotalbalance(res.data);
    }
  }

  useEffect(() => {
    if (user?.id) {
      getUserData(user.id, 'home');
      getUserAllBalance();
    }
  }, [user?.id]); // Only re-run when user.id changes

  useEffect(() => {
    console.log("User Total Balance:", userTotalbalance);
  }, [userTotalbalance]);

  // Check if user has any transactions or balance
  const newAccount = !user?.limitAmount;

  useEffect(() => {
    if (!newAccount) {
      setShowOnboardingCoach(false);
      return;
    }
    const dismissed =
      typeof window !== "undefined"
        ? window.localStorage.getItem("walleta-home-onboarding") === "dismissed"
        : false;
    setShowOnboardingCoach(!dismissed);
  }, [newAccount]);

  const handleCompleteOnboarding = () => {
    setShowOnboardingCoach(false);
  };

  return (
    <div className="flex flex-col gap-4 main home-container">
      {/* Show welcome card for new users */}
      {newAccount && <WelcomeCard />}

      {newAccount && (
        <div className="rounded-2xl border border-dashed border-purple-200 bg-white/80 p-4 shadow-sm text-sm text-gray-600">
          <p>
            You are in guided mode. We will show sample balances and coach marks
            so your first transaction feels familiar. Add your first record to
            exit guided mode automatically.
          </p>
        </div>
      )}

      {/* Balance Card with Glassmorphism */}
      <div className="balance-card group" id="balance-card">
        <div className="balance-card-inner">
          <div className="flex-1">
            <p className="balance-label">Your total balance is</p>
            <div className="balance-amount">
              <FaBahtSign className="currency-icon" />
              <span className="amount-text">
                {userTotalbalance?.totalBalance ? splitNumberComma(userTotalbalance.totalBalance) : '0'}
              </span>
            </div>
            {newAccount && (
              <p className="text-sm text-purple-700 mt-2 bg-white/60 inline-flex px-3 py-1 rounded-full">
                Example target: ฿{SAMPLE_BALANCE_SNAPSHOT.totalBalance.toLocaleString()} ·{" "}
                {SAMPLE_BALANCE_SNAPSHOT.goal}
              </p>
            )}
          </div>
          <div className="emoji-container">
            <img
              src={emotionEmoji(userTotalbalance?.totalBalance || 0)}
              alt="emotion"
              className="emotion-emoji"
            />
          </div>
        </div>
      </div>

      {/* Income & Expense Cards */}
      <div className="grid grid-cols-2 gap-3 md:gap-4" id="stat-card">
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
                {userTotalbalance?.totalIncome ? splitNumberComma(userTotalbalance.totalIncome) : '0'}
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
                {userTotalbalance?.totalExpense ? splitNumberComma(userTotalbalance.totalExpense) : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="divider"></div>

      {/* Transaction List */}
      <div id="transaction-list-section">
        <List showSamplePreview={newAccount} />
      </div>

      {showOnboardingCoach && (
        <OnboardingCoachMarks onDismiss={handleCompleteOnboarding} />
      )}
    </div>
  );
};

export default Home;
