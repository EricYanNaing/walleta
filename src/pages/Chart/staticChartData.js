export const summaryMonthlyResponse = {
  status: "success",
  code: 200,
  message: "Summary fetched successfully",
  granularity: "monthly", // "monthly" | "yearly"
  currency: "THB",
  year: 2025, // optional, for monthly
  totalBalance: {
    income: 23500.0,
    expense: 14210.45,
    balance: 9289.55,
  },
  data: [
    { key: "2025-01", label: "Jan", income: 0, expense: 0 },
    { key: "2025-02", label: "Feb", income: 0, expense: 0 },
    { key: "2025-03", label: "Mar", income: 3200.0, expense: 1800.0 },
    { key: "2025-04", label: "Apr", income: 4500.0, expense: 2700.0 },
    { key: "2025-05", label: "May", income: 3800.0, expense: 2400.0 },
    { key: "2025-06", label: "Jun", income: 4100.0, expense: 2900.0 },
    { key: "2025-07", label: "Jul", income: 4800.0, expense: 3110.45 },
    { key: "2025-08", label: "Aug", income: 3100.0, expense: 2300.0 },
    { key: "2025-09", label: "Sep", income: 0, expense: 0 },
    { key: "2025-10", label: "Oct", income: 0, expense: 0 },
    { key: "2025-11", label: "Nov", income: 0, expense: 0 },
    { key: "2025-12", label: "Dec", income: 0, expense: 0 },
  ],
};

export const summaryYearlyResponse = {
  status: "success",
  code: 200,
  message: "Summary fetched successfully",
  granularity: "yearly",
  currency: "THB",
  totalBalance: {
    income: 117200.0,
    expense: 84510.45,
    balance: 32689.55,
  },
  data: [
    { key: "2021", label: "2021", income: 19500.0, expense: 15300.0 },
    { key: "2022", label: "2022", income: 23100.0, expense: 18200.0 },
    { key: "2023", label: "2023", income: 25400.0, expense: 19800.0 },
    { key: "2024", label: "2024", income: 25600.0, expense: 19100.45 },
    { key: "2025", label: "2025", income: 23900.0, expense: 12110.0 },
  ],
};
