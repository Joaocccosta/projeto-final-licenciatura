import React, { useEffect, useState } from 'react';
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

// Função para traduzir os termos da API
const traduzirTermo = (termo) => {
  const mapeamento = {
    'Capsules': 'Cápsulas',
    'Units': 'Unidades',
    // Box10 e Box24 permanecem inalterados
  };
  
  return mapeamento[termo] || termo;
};

const ProductionChartCard = ({ hourlyProductionData }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const validItems = hourlyProductionData && hourlyProductionData.length > 0 ? hourlyProductionData : [];

  // Animação na entrada
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Gerar as últimas 8 horas dinamicamente
  const generateLast8Hours = () => {
    const now = new Date();
    const hours = [];
    for (let i = 7; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = date.getHours().toString().padStart(2, '0');
      hours.push(`${hour}:00`);
    }
    return hours;
  };

  const fixedHours = generateLast8Hours();

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

  // Preencher horas ausentes com 0
  fixedHours.forEach(hour => {
    if (!dataByHour[hour]) {
      dataByHour[hour] = {};
    }
  });

  // Obter tipos de partes únicos
  const uniqueParts = Array.from(partTypes);
  if (uniqueParts.length === 0) {
    uniqueParts.push('Units'); // Fallback para quando não há dados
  }

  // Define cores mais vibrantes para cada tipo de parte
  const partColors = {
    'Capsules': 'rgba(255, 99, 132, 0.9)',  // Vermelho
    'Box10': 'rgba(54, 162, 235, 0.9)',     // Azul
    'Box24': 'rgba(255, 206, 86, 0.9)',     // Amarelo
    'Units': 'rgba(75, 192, 192, 0.9)',     // Verde
    'Unidades': 'rgba(75, 192, 192, 0.9)'   // Verde
  };

  // Cria datasets para cada tipo de parte
  const datasets = uniqueParts.map(part => ({
    label: traduzirTermo(part), // Traduz o nome da parte aqui
    data: fixedHours.map(hour => {
      if (dataByHour[hour] && dataByHour[hour][part] !== undefined) {
        return dataByHour[hour][part];
      }
      return 0;
    }),
    backgroundColor: partColors[part] || 'rgba(153, 102, 255, 0.9)',
    borderColor: partColors[part]?.replace('0.9', '1') || 'rgba(153, 102, 255, 1)',
    borderWidth: 2,  // Borda mais grossa
    borderRadius: 6,  // Bordas arredondadas nas barras
  }));

  const chartData = {
    labels: fixedHours,
    datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,  // Animação mais suave
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#fff',
          font: {
            size: 13,
            weight: 'bold'
          },
          usePointStyle: true,  // Usa pontos em vez de retângulos
          pointStyle: 'circle'
        },
      },
      title: {
        display: false, // Removido pois adicionamos um título personalizado
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          weight: 'bold'
        },
        padding: 12,
        cornerRadius: 8,
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
          font: {
            weight: 'bold'
          }
        },
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Hora',
          color: '#fff',
          font: {
            weight: 'bold'
          }
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

  // Calcular totais por tipo de produto
  const totalsByPart = {};
  validItems.forEach(item => {
    if (!totalsByPart[item.part]) {
      totalsByPart[item.part] = 0;
    }
    totalsByPart[item.part] += item.produzido;
  });

  // Calcular total geral
  const totalProduction = Object.values(totalsByPart).reduce((sum, count) => sum + count, 0);

  return (
    <div className={`bg-gradient-to-br from-purple-700 to-blue-900 rounded-xl shadow-xl p-6 text-white 
                    min-h-[400px] w-full sm:w-[964px] flex-shrink-0 flex flex-col
                    transition-all duration-300 hover:shadow-2xl
                    border border-blue-500/20 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Produção Horária
          </span>
        </h2>
        <div className="flex space-x-2 items-center">
          {Object.entries(totalsByPart).map(([part, count]) => (
            <div 
              key={part} 
              className="px-3 py-1 rounded-lg flex items-center" 
              style={{ backgroundColor: partColors[part]?.replace('0.9', '0.7') || 'rgba(153, 102, 255, 0.7)' }}
            >
              <span className="text-xs font-semibold mr-1">{traduzirTermo(part)}:</span>
              <span className="font-bold">{count.toLocaleString()}</span>
            </div>
          ))}
          {Object.keys(totalsByPart).length > 0 && (
            <div className="bg-white/20 px-3 py-1 rounded-lg">
              <span className="text-xs font-semibold mr-1">Total:</span>
              <span className="font-bold">{totalProduction.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white/5 p-4 rounded-lg backdrop-blur-sm flex-grow">
        <div className="relative h-[300px]">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ProductionChartCard;