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
import noChartData from '../../assets/img/no-chart-data.png';

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
  const [noData, setNoData] = useState(false);

  const formatChartData = (response) => {
    console.log("response :", response);
    if (response?.length === 0) {
      setNoData(true);
    }
    return {
      labels: response.map((item) => selectedTitle === "Monthly" ? item.month : item.year),
      datasets: [
        {
          label: "Income",
          data: response.map((item) => item.income),
          backgroundColor: "rgba(16, 185, 129, 0.8)", // emerald-500
          borderColor: "rgba(16, 185, 129, 1)",
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: "Expense",
          data: response.map((item) => item.expense),
          backgroundColor: "rgba(244, 63, 94, 0.8)", // rose-500
          borderColor: "rgba(244, 63, 94, 1)",
          borderWidth: 0,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    }
  }

  const getChartData = () => {
    try {
      if (data && data.data && data.data.length > 0) {
        console.log("Chart data received:", data.data);
        setNoData(false);
        const fetchedData = formatChartData(data.data);
        console.log("Formatted chart data:", fetchedData);
        setChartData(fetchedData);
      } else {
        setNoData(true);
      }
    } catch (error) {
      console.error("Error formatting chart data:", error);
      setNoData(true);
    }
  }

  useEffect(() => {
    getChartData();
  }, [selectedTitle, data]);

  return (
    <div className={`w-full h-[200px] md:h-[300px] ${className}`}>
      {noData ? (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <img src={noChartData} alt="No Chart Data" className="w-28 h-28 opacity-60" />
          <div className="text-center">
            <p className="text-gray-600 font-medium">No data available</p>
            <p className="text-gray-400 text-sm mt-1">Data will appear here when available</p>
          </div>
        </div>
      ) : (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: {
                  usePointStyle: true,
                  padding: 15,
                  font: {
                    size: 12,
                    weight: '500',
                  },
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
                  label: (context) => {
                    let label = context.dataset.label || '';
                    if (label) {
                      label += ': ';
                    }
                    label += new Intl.NumberFormat('th-TH', {
                      style: 'currency',
                      currency: 'THB',
                      minimumFractionDigits: 0,
                    }).format(context.parsed.y);
                    return label;
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  font: {
                    size: 11,
                  },
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)',
                  drawBorder: false,
                },
                ticks: {
                  font: {
                    size: 11,
                  },
                  callback: function (value) {
                    return new Intl.NumberFormat('th-TH', {
                      notation: 'compact',
                      compactDisplay: 'short',
                    }).format(value);
                  },
                },
              },
            },
            animation: {
              duration: 750,
              easing: 'easeInOutQuart',
            },
          }}
        />
      )}
    </div>
  );
};

export default BarChart;
