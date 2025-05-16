import React from 'react';

const OrderCard = ({ orderCode }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-xl shadow-lg text-white text-center flex flex-col justify-center items-center min-h-[150px] w-[300px] hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-semibold mb-3 uppercase tracking-wider">Ordem Produção</h3>
      <p className="text-3xl font-bold break-all">{orderCode || 'N/A'}</p>
    </div>
  );
};

export default OrderCard;