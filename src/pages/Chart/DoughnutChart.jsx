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
    console.log("noData :", noData);

    return {
      labels: response?.data?.map((item) => item.category),
      datasets: [
        {
          label: response?.type,
          data: response?.data?.map((item) => item.total),
          backgroundColor: [
            "rgba(244, 63, 94, 0.85)",    // rose-500
            "rgba(59, 130, 246, 0.85)",   // blue-500
            "rgba(251, 191, 36, 0.85)",   // amber-400
            "rgba(16, 185, 129, 0.85)",   // emerald-500
            "rgba(168, 85, 247, 0.85)",   // purple-500
            "rgba(236, 72, 153, 0.85)",   // pink-500
            "rgba(14, 165, 233, 0.85)",   // sky-500
            "rgba(249, 115, 22, 0.85)",   // orange-500
          ],
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    }
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%", // makes it look like a ring
    plugins: {
      title: {
        display: false,
      },
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          font: {
            size: 11,
            weight: '500',
          },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        titleFont: {
          size: 13,
          weight: 'bold',
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: (ctx) => {
            const label = ctx.label || '';
            const value = new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB',
              minimumFractionDigits: 0,
            }).format(ctx.parsed);
            return `${label}: ${value}`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  useEffect(() => {
    console.log("Doughnut data :", data);
    if (!data || !data?.data || data?.data?.length === 0) {
      setNoData(true);
      return;
    }
    setNoData(false);
    formatChartData(data);
  }, [data]);

  return (
    <div className="w-full h-[300px] md:h-[400px]">
      {noData ? (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <img src={noChartData} alt="No Chart Data" className="w-28 h-28 opacity-60" />
          <div className="text-center">
            <p className="text-gray-600 font-medium">No data available</p>
            <p className="text-gray-400 text-sm mt-1">Data will appear here when available</p>
          </div>
        </div>
      ) : (
        <Doughnut data={formatChartData(data)} options={options} />
      )}
    </div>
  );
};

export default DoughnutChart;