import React from 'react';

const CircularProgressCard = ({ title, percentage, expected = 75 }) => {
  // Garantir que o percentual seja um número válido entre 0 e 100
  const validPercentage = isNaN(percentage) ? 0 : Math.min(Math.max(0, percentage), 100);
  const isOk = validPercentage >= expected;
  const color = isOk ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className={`${color} text-white rounded-lg shadow-md p-4 w-full max-w-xs`}>
      <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
      <div className="relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 border-8 rounded-full border-white opacity-30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{validPercentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default CircularProgressCard;
