import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';

const GaugeCard = ({ title, current, target }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  
  // Ensure current and target are numbers
  const currentNum = Number(current) || 0;
  const targetNum = Number(target) || 1; // Avoid division by zero
  
  // Calculate percentage (capped at 100%)
  const percentage = Math.min((currentNum / targetNum) * 100, 100).toFixed(0);
  
  useEffect(() => {
    // Initialize chart
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);
      
      // Clean up on unmount
      return () => {
        chartInstance.current && chartInstance.current.dispose();
      };
    }
  }, []);
  
  useEffect(() => {
    if (!chartInstance.current) return;
    
    // Determine color based on percentage
    let color = '#FF5F6D'; // Red for low progress
    if (percentage >= 70) {
      color = '#2ECC71'; // Green for good progress
    } else if (percentage >= 40) {
      color = '#FFC371'; // Yellow for medium progress
    }
    
    // Semi-circular progress chart options
    const option = {
      series: [{
        type: 'pie',
        radius: ['75%', '90%'],
        startAngle: 220,
        endAngle: -40,
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        emphasis: {
          scale: false
        },
        silent: true,
        animation: false,
        data: [
          { 
            value: percentage, 
            name: 'Completed',
            itemStyle: {
              color: color
            }
          },
          { 
            value: 100 - percentage, 
            name: 'Remaining',
            itemStyle: {
              color: '#EAEAEA'
            }
          }
        ]
      }],
      graphic: [
        {
          type: 'text',
          left: 'center',
          top: '30%',
          style: {
            text: currentNum.toLocaleString(),
            fontSize: 26,
            fontWeight: 'bold',
            textAlign: 'center',
            fill: '#FFFFFF' // Mudado para branco
          }
        },
        {
          type: 'text',
          left: 'center',
          top: '52%',
          style: {
            text: '/' + targetNum.toLocaleString(),
            fontSize: 20,
            fontWeight: 'normal',
            textAlign: 'center',
            fill: 'rgba(255, 255, 255, 0.8)' // Mudado para branco com transparência
          }
        }
      ]
    };
    
    chartInstance.current.setOption(option);
    
    // Handle resize
    const handleResize = () => {
      chartInstance.current && chartInstance.current.resize();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [percentage, currentNum, targetNum]);
  
  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg p-6 flex flex-col items-center w-[300px] text-white">
      <h3 className="text-xl font-semibold mb-4 text-center">{title}</h3>
      
      <div ref={chartRef} className="w-full h-48"></div>
    </div>
  );
};

export default GaugeCard;