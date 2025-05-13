import React, { useRef, useEffect, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const GaugeCard = ({ title, current, target }) => {
  // Certifique-se de que current e target sejam números
  const currentNum = Number(current) || 0;
  const targetNum = Number(target) || 1; // Evitar divisão por zero

  // Calcular a porcentagem de conclusão (limitado a 100%)
  const percentage = useMemo(() => {
    if (!targetNum || targetNum <= 0) return 0;
    return Math.min(currentNum / targetNum, 1);
  }, [currentNum, targetNum]);

  // Determinar a cor do gauge com base na porcentagem
  const gaugeColor = useMemo(() => {
    if (percentage < 0.4) return "#FF5F6D"; // Vermelho para progresso baixo
    if (percentage < 0.7) return "#FFC371"; // Amarelo para progresso médio
    return "#2ECC71";                       // Verde para bom progresso
  }, [percentage]);

  // Configuração do Chart.js para um gauge semicircular
  const data = {
    datasets: [
      {
        data: [percentage, 1 - percentage], // Valor atual e espaço restante
        backgroundColor: [
          gaugeColor,
          '#e0e0e0', // Cor cinza clara para o fundo
        ],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const options = {
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true
    },
    events: [],
  };

  // Referência ao canvas para desenhar a agulha
  const chartRef = useRef(null);

  // Desenhar uma agulha sobre o gauge após a renderização
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      
      // Usar um callback quando o gráfico for atualizado
      const originalDraw = chart.draw;
      chart.draw = function() {
        originalDraw.apply(this, arguments);
        
        const ctx = this.ctx;
        const centerX = this.chartArea.left + (this.chartArea.right - this.chartArea.left) / 2;
        const centerY = this.chartArea.bottom;
        const radius = Math.min(this.chartArea.right - this.chartArea.left, this.chartArea.bottom - this.chartArea.top) / 2;
        
        // Calcular a posição da agulha
        const angle = Math.PI * (percentage - 0.5); // -90 a 90 graus em radianos
        
        // Desenhar a agulha
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);
        
        // Linha da agulha
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -radius * 0.9);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#464A4F';
        ctx.stroke();
        
        // Base da agulha
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.1, 0, Math.PI * 2);
        ctx.fillStyle = '#464A4F';
        ctx.fill();
        
        ctx.restore();
      };
    }
  }, [percentage]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center w-[300px]">
      <h3 className="text-xl font-semibold mb-2 text-center text-gray-800">{title}</h3>
      
      <div className="w-full h-40 relative">
        <Doughnut data={data} options={options} ref={chartRef} />
      </div>
      
      <div className="flex justify-between w-full mt-2 text-center">
        <div className="text-gray-700">
          <div className="text-sm font-semibold">Atual</div>
          <div className="text-xl font-bold">{currentNum.toLocaleString()}</div>
        </div>
        
        <div className="text-gray-700">
          <div className="text-sm font-semibold">Meta</div>
          <div className="text-xl font-bold">{targetNum.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default GaugeCard;