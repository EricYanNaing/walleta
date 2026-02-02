import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { summaryMonthlyResponse, summaryYearlyResponse } from "./staticChartData";

// register components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ selectedTitle = "", className, data }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const formatChartData = (response) => {
    console.log("response :", response);
    return {
      labels: response.map((item) => selectedTitle === "Monthly" ? item.month : item.year),
      datasets: [
        {
          label: "Income",
          data: response.map((item) => item.income),
          backgroundColor: "rgba(75, 192, 192, 0.7)", // teal
        },
        {
          label: "Expense",
          data: response.map((item) => item.expense),
          backgroundColor: "rgba(255, 99, 132, 0.7)", // red
        },
      ],
    }
  }

  const getChartData = () => {
    try {
      if (data && data.data && data.data.length > 0) {
        console.log("Chart data received:", data.data);
        const fetchedData = formatChartData(data.data);
        console.log("Formatted chart data:", fetchedData);
        setChartData(fetchedData);
      }
    } catch (error) {
      console.error("Error formatting chart data:", error);
    }
  }

  useEffect(() => {
    getChartData();
  }, [selectedTitle, data]);

  return (
    <div className={`w-full h-[200px] md:h-[300px] ${className}`}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default BarChart;
