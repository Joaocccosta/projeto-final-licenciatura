import React from 'react';

const CircularProgressCard = ({ title, percentage, expected = 75 }) => {
  const isOk = percentage >= expected;
  const color = isOk ? 'green-600' : 'red-600';

  return (
    <div className={`bg-${color} text-white rounded-lg shadow-md p-4 w-full max-w-xs`}>
      <h3 className="text-lg font-semibold mb-2 text-center">{title}</h3>
      <div className="relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 border-8 rounded-full border-white opacity-30"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{percentage}%</span>
          <span className="text-xs">Esperado: {expected}%</span>
        </div>
      </div>
    </div>
  );
};

export default CircularProgressCard;
