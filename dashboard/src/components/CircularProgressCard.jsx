import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

const CircularProgressCard = ({ title, percentage, expected = 75 }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  // Verifica se a percentagem é válida e ajusta para o intervalo de 0 a 100
  const validPercentage = isNaN(percentage) ? 0 : Math.min(Math.max(0, percentage), 100);
  const displayPercentage = validPercentage.toFixed(1); 
  const isOk = validPercentage >= expected;
  
  const primaryColor = isOk ? '#2ECC71' : '#dc2626'; // Verde ou vermelho mais saturados
  const gradientClass = 'from-blue-400 to-blue-600';
  
  useEffect(() => {
    // Iniciar o chart
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);

      return () => {
        chartInstance.current && chartInstance.current.dispose();
      };
    }
  }, []);
  
  useEffect(() => {
    if (!chartInstance.current) return;
    
    // Chart settings
    const option = {
      series: [
        {
          type: 'pie',
          radius: ['70%', '90%'],
          avoidLabelOverlap: false,
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          emphasis: {
            disabled: true
          },
          data: [
            { 
              value: validPercentage, 
              name: `${displayPercentage}%`,
              itemStyle: { color: primaryColor } 
            },
            { 
              value: 100 - validPercentage, 
              name: 'Remaining',
              itemStyle: { color: 'rgba(111, 148, 207, 0.6)' }
            }
          ]
        }
      ],
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: `${displayPercentage}%`,
            fontSize: 30,
            fontWeight: 'bold',
            fill: '#fff', 
            textAlign: 'center',
            textVerticalAlign: 'middle'
          }
        }
      ]
    };
    
    chartInstance.current.setOption(option);
    
    const handleResize = () => {
      chartInstance.current && chartInstance.current.resize();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [validPercentage, isOk, primaryColor]);
  
  return (
    <div className={`bg-gradient-to-br ${gradientClass} rounded-lg shadow-lg p-6 flex flex-col items-center w-[300px] text-white hover:shadow-xl transition-all duration-300`}>
      <h3 className="text-xl font-semibold mb-4 text-center">{title}</h3>
      <div ref={chartRef} className="w-full h-40"></div>
    </div>
  );
};

export default CircularProgressCard;
