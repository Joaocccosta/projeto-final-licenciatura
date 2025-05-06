import React from 'react';

const StateCard = ({ title, status }) => {
  let bgColor = 'bg-gray-400'; // Cor padrão (cinza)
  let statusText = status || 'Indisponível'; // Texto padrão

  // Define a cor e o texto com base no estado
  if (status === 'running') {
    bgColor = 'bg-green-500'; // Verde
    statusText = 'Running';
  } else if (status === 'stopped') {
    bgColor = 'bg-red-500'; // Vermelho
    statusText = 'Stopped';
  } else if (status === 'sem_trabalho') {
    bgColor = 'bg-gray-500'; // Cinza mais escuro
    statusText = 'Sem Trabalho';
  }

  // Não renderiza o card se o título (nome da parte) não existir
  if (!title) {
    return null;
  }

  return (
    <div className={`${bgColor} p-6 rounded-lg shadow-md text-white text-center flex flex-col justify-between items-center min-h-[150px] w-[300px]`}> {/* Adicionado w-[300px] */}
      <h3 className="text-xl font-semibold mb-2 break-words">{title}</h3>
      <p className="text-2xl font-bold">{statusText}</p>
    </div>
  );
};

export default StateCard;