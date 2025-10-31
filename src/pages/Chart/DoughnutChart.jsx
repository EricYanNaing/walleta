import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DoughnutChart = () => {
  const data = {
    labels: ["Food", "Transport", "Health", "Entertainment", "Education"],
    datasets: [
      {
        label: "Expense",
        data: [500, 300, 200, 400, 150],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",   // red
          "rgba(54, 162, 235, 0.7)",   // blue
          "rgba(255, 206, 86, 0.7)",   // yellow
          "rgba(75, 192, 192, 0.7)",   // teal
          "rgba(153, 102, 255, 0.7)",  // purple
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%", // makes it look like a ring
    plugins: {
      title: {
        display: true,
        text: 'Expense Distribution',
        font: { size: 16 },
      },
      legend: {
        position: "bottom",
        labels: { boxWidth: 15, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `${ctx.label}: ${ctx.parsed.toLocaleString()} THB`,
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;