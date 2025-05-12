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

  // Definir horas fixas para o eixo X (das 08:00 às 20:00)
  const fixedHours = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  // Organizar dados por hora
  const dataByHour = {};
  const partTypes = new Set();

  validItems.forEach(item => {
    const hourKey = item.intervalo;
    partTypes.add(item.part);
    
    if (!dataByHour[hourKey]) {
      dataByHour[hourKey] = {};
    }
    
    dataByHour[hourKey][item.part] = item.produzido;
  });

  // Obter tipos de partes únicos
  const uniqueParts = Array.from(partTypes);
  if (uniqueParts.length === 0) {
    uniqueParts.push('Unidades'); // Fallback para quando não há dados
  }
  
  // Define cores para cada tipo de parte
  const partColors = {
    'Capsules': 'rgba(255, 99, 132, 0.8)', // vermelho
    'Box10': 'rgba(54, 162, 235, 0.8)',   // azul
    'Box24': 'rgba(255, 206, 86, 0.8)',   // amarelo
    'Units': 'rgba(75, 192, 192, 0.8)',   // verde
    'Unidades': 'rgba(75, 192, 192, 0.8)' // verde (para compatibilidade)
  };

  // Cria datasets para cada tipo de parte usando as horas fixas
  const datasets = uniqueParts.map(part => ({
    label: part,
    data: fixedHours.map(hour => {
      // Se houver dados para esta hora e parte, use-os, caso contrário use 0
      if (dataByHour[hour] && dataByHour[hour][part] !== undefined) {
        return dataByHour[hour][part];
      }
      return 0;
    }),
    backgroundColor: partColors[part] || 'rgba(153, 102, 255, 0.8)', // cor padrão caso não tenha predefinida
    borderColor: partColors[part]?.replace('0.8', '1') || 'rgba(153, 102, 255, 1)',
    borderWidth: 1
  }));

  const chartData = {
    labels: fixedHours,
    datasets
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
        text: 'Produção Horária',
        color: '#fff',
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            return `${label}: ${context.parsed.y} unidades`;
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
          text: 'Hora',
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
    <div className="bg-sky-700 p-4 rounded-lg shadow-md text-white min-h-[300px] w-full sm:w-[964px] flex-shrink-0 flex flex-col">
      <div className="flex-grow relative min-h-[250px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ProductionChartCard;