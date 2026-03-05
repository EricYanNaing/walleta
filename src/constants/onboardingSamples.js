export const SAMPLE_BALANCE_SNAPSHOT = {
  totalBalance: 42500,
  goal: "Stay under ฿40k in flexible spending",
  categories: [
    { name: "Essentials", value: 18500, percent: 44, color: "#8b5cf6" },
    { name: "Lifestyle", value: 9200, percent: 22, color: "#ec4899" },
    { name: "Savings", value: 9800, percent: 23, color: "#10b981" },
    { name: "Giving", value: 3000, percent: 11, color: "#f97316" },
  ],
};

export const SAMPLE_TRANSACTIONS = [
  {
    id: 1,
    name: "Groceries · Fresh Mart",
    description: "Weekly essentials",
    amount: 1800,
    type: "EXPENSE",
    category: "Essentials",
    date: "Today • 9:42 AM",
  },
  {
    id: 2,
    name: "Salary · Product Lead",
    description: "Auto-categorised income",
    amount: 38000,
    type: "INCOME",
    category: "Income",
    date: "Yesterday • 6:00 PM",
  },
  {
    id: 3,
    name: "Transit · BTS Rabbit",
    description: "Daily commute",
    amount: 120,
    type: "EXPENSE",
    category: "Lifestyle",
    date: "Tue • 7:10 AM",
  },
];

export const ONBOARDING_STEPS = [
  {
    id: "balance",
    title: "Your balance snapshot",
    description: "See available funds update instantly as you log income or expenses.",
    target: "balance-card",
  },
  {
    id: "categories",
    title: "Smart categories",
    description: "Buckets show where your money flows. Add custom categories anytime.",
    target: "stat-card",
  },
  {
    id: "transactions",
    title: "Transaction timeline",
    description: "Swipe-friendly ledger helps you review and edit entries in seconds.",
    target: "transaction-list-section",
  },
];

export const AUTH_TIPS = [
  {
    title: "Sample balance",
    metric: "฿42,500",
    caption: "Projected end-of-month cash if you stay on plan.",
  },
  {
    title: "3 starter categories",
    metric: "Essentials · Lifestyle · Savings",
    caption: "We preload suggestions so you categorise faster.",
  },
  {
    title: "Realtime nudges",
    metric: "+2 coach marks",
    caption: "Contextual tips show up the first time you enter each screen.",
  },
];
