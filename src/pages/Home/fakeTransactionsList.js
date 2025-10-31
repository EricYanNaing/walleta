export const transactionsResponse = {
  "status": "success",
  "code" : 200,
  "message": "Transactions fetched successfully",
  "total": 12,
  "totalBalance": {
    "income": 2300.00,
    "expense": 421.45,
    "balance": 1878.55
  },
  "data": [
    { id: 1,  title: "Grocery Shopping",  amount: 50.75,  date: "2023-10-01", category: "Expense", subCategory: "Food", categoryImg:'https://cdn-icons-png.flaticon.com/128/3170/3170733.png' },
    { id: 2,  title: "Salary",            amount: 1500.00, date: "2023-10-01", category: "Income", subCategory: "Salary", categoryImg:'https://cdn-icons-png.flaticon.com/128/2738/2738435.png' },
    { id: 3,  title: "Electricity Bill",  amount: 75.20,  date: "2023-10-05", category: "Expense", subCategory: "Utilities", categoryImg:'https://cdn-icons-png.flaticon.com/128/1527/1527434.png' },
    { id: 4,  title: "Dinner Out",        amount: 30.00,  date: "2023-10-05", category: "Expense", subCategory: "Food", categoryImg:'https://cdn-icons-png.flaticon.com/128/3170/3170733.png' },
    { id: 5,  title: "Freelance Project", amount: 600.00, date: "2023-10-10", category: "Income", subCategory: "Freelance", categoryImg:'' },
    { id: 6,  title: "Gym Membership",    amount: 45.00,  date: "2023-10-12", category: "Expense", subCategory: "Health", categoryImg:'https://cdn-icons-png.flaticon.com/128/2382/2382461.png' },
    { id: 7,  title: "Movie Night",       amount: 20.00,  date: "2023-10-15", category: "Expense", subCategory: "Entertainment", categoryImg:'https://cdn-icons-png.flaticon.com/128/5912/5912749.png' },
    { id: 8,  title: "Car Maintenance",   amount: 120.00, date: "2023-10-20", category: "Expense", subCategory: "Transport" ,categoryImg:'https://cdn-icons-png.flaticon.com/128/11210/11210304.png' },
    { id: 9,  title: "Book Purchase",     amount: 15.50,  date: "2023-10-20", category: "Expense", subCategory: "Education" ,categoryImg:'https://cdn-icons-png.flaticon.com/128/201/201614.png' },
    { id: 10, title: "Bonus",             amount: 200.00, date: "2023-10-22", category: "Income", subCategory: "Bonus" ,categoryImg:'' },
    { id: 11, title: "Coffee",            amount: 5.00,   date: "2023-10-25", category: "Expense", subCategory: "Food" ,categoryImg:'https://cdn-icons-png.flaticon.com/128/3170/3170733.png' },
    { id: 12, title: "Internet Bill",     amount: 60.00,  date: "2023-10-25", category: "Expense", subCategory: "Utilities" ,categoryImg:'https://cdn-icons-png.flaticon.com/128/1527/1527434.png' }
  ]
}