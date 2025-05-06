import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProductionChartCard = ({ hourlyProductionData }) => {
  const validItems = hourlyProductionData && hourlyProductionData.length > 0 ? hourlyProductionData : [];

  if (validItems.length === 0) {
    return (
      <div className="bg-sky-600 p-4 rounded-lg shadow-md text-white text-center min-h-[250px] w-full sm:w-[840px] flex-shrink-0 flex flex-col justify-center items-center">
        <h3 className="text-xl font-semibold mb-2">Produção Horária de Cápsulas</h3>
        <p className="text-lg">N/A</p>
      </div>
    );
  }

  const chartData = {
    labels: validItems.map(item => item.intervalo),
    datasets: [
      {
        label: 'Cápsulas Produzidas',
        data: validItems.map(item => item.produzido),
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#fff',
        },
      },
      title: {
        display: true,
        text: 'Produção Horária de Cápsulas',
        color: '#fff',
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' unidades';
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantidade Produzida',
          color: '#fff',
        },
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Intervalo de Hora',
          color: '#fff',
        },
        ticks: {
          color: '#fff',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-sky-700 p-4 rounded-lg shadow-md text-white min-h-[250px] w-full sm:w-[964px] flex-shrink-0 flex flex-col">
      <div className="flex-grow relative">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ProductionChartCard;