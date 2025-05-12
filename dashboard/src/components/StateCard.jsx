import React from 'react';

const StateCard = ({ title, status }) => {
  let bgColor = 'bg-gray-400'; // Cor padrão (cinza)
  let statusText = status || 'Indisponível'; // Texto padrão

  // Mapear valores numéricos ou outros formatos para os estados corretos
  if (status === 'running' || status === 1 || status === '1') {
    bgColor = 'bg-green-500'; // Verde
    statusText = 'Running';
  } else if (status === 'stopped' || status === 0 || status === '0') {
    bgColor = 'bg-red-500'; // Vermelho
    statusText = 'Stopped';
  } else if (status === 'sem_trabalho' || status === 'Sem Trabalho' || status === null) {
    bgColor = 'bg-gray-500'; // Cinza mais escuro
    statusText = 'Sem Trabalho';
  }

  // Não renderiza o card se o título (nome da parte) não existir
  if (!title) {
    return null;
  }

  return (
    <div className={`${bgColor} p-6 rounded-lg shadow-md text-white text-center flex flex-col justify-between items-center min-h-[150px] w-[300px]`}>
      <h3 className="text-xl font-semibold mb-2 break-words">{title}</h3>
      <p className="text-2xl font-bold">{statusText}</p>
    </div>
  );
};

export default StateCard;