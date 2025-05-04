import React from 'react';

const HourlyChartCard = ({ title, values = [], expected = 10 }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-xs">
      <h3 className="text-lg font-semibold mb-3 text-center">{title}</h3>
      <div className="flex items-end h-24 space-x-1 px-2">
        {values.map((v, i) => (
          <div
            key={i}
            className={`w-2 sm:w-3 ${v >= expected ? 'bg-green-600' : 'bg-red-600'}`}
            style={{ height: `${v * 4}px` }}
            title={`Hora ${i + 1}: ${v}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 px-2 mt-1">
        <span>Início</span>
        <span>Fim</span>
      </div>
    </div>
  );
};

export default HourlyChartCard;
