import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import noChartData from '../../assets/img/no-chart-data.png'

// Register chart components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const DoughnutChart = ({ data }) => {
  const [noData, setNoData] = useState(false);

  const formatChartData = (response) => {
    console.log("formatChartData response :", response);
    if (response?.data?.length === 0) {
      setNoData(true);
    }
    return {
      labels: response?.data?.map((item) => item.category),
      datasets: [
        {
          label: response?.type,
          data: response?.data?.map((item) => item.total),
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",   // red
            "rgba(54, 162, 235, 0.7)",   // blue
            "rgba(255, 206, 86, 0.7)",   // yellow
            "rgba(75, 192, 192, 0.7)",   // teal
            "rgba(153, 102, 255, 0.7)",  // purple
          ],
          borderWidth: 0,
        },
      ],
    }
  }

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

  useEffect(() => {
    if (!data || !data?.data || data?.data?.length === 0) {
      setNoData(true);
      return;
    }
    formatChartData(data);
  }, [data]);

  return (
    <div className="w-full h-[300px] md:h-[400px]">
      {noData ? (
        <div className="flex flex-col items-center justify-center h-full">
          <img src={noChartData} alt="No Chart Data" className="w-20 h-20" />
          <span className="text-gray-500">No data available</span>
        </div>
      ) : (
        <Doughnut data={formatChartData(data)} options={options} />
      )}
    </div>
  );
};

export default DoughnutChart;