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
import {summaryMonthlyResponse, summaryYearlyResponse} from "./staticChartData";

// register components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ selectedTitle = "", className }) => {
  const [chartData, setChartData] =  useState({ labels: [], datasets: [] });

  const formatChartData = (response) => {
    return {
      labels: response.data.map((item) => item.label),
      datasets: [
        {
          label: "Income",
          data: response.data.map((item) => item.income),
          backgroundColor: "rgba(75, 192, 192, 0.7)", // teal
        },
        {
          label: "Expense",
          data: response.data.map((item) => item.expense),
          backgroundColor: "rgba(255, 99, 132, 0.7)", // red
        },
      ],
    }
  }

  const getChartData = async () => {
    let data = null;
    try {
      if (selectedTitle === "Monthly") {
        console.log("summaryMonthlyResponse :", summaryMonthlyResponse.data.map((item) => item.label));
        data = formatChartData(summaryMonthlyResponse);
          
        console.log("data :", data);
        setChartData(data);
      } else if (selectedTitle === "Yearly") {
        data = formatChartData(summaryYearlyResponse);
        setChartData(data);
      }

    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  }


  useEffect(() => {
    getChartData();
  }, [selectedTitle]);

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
