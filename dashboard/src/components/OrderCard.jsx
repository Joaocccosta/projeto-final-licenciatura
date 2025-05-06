import React, { useState, useEffect } from 'react';

// Função auxiliar para calcular minutos decorridos
const calculateElapsedMinutes = (startTime) => {
  if (!startTime) return 0;
  const start = new Date(startTime);
  const now = new Date();
  const diffMs = now - start; // Diferença em milissegundos
  if (diffMs < 0) return 0; // Caso o timestamp esteja no futuro
  return Math.floor(diffMs / (1000 * 60)); // Converte para minutos e arredonda para baixo
};

// Função auxiliar para formatar o tempo (ex: 120 min -> 2h 0m) - Opcional
const formatElapsedTime = (totalMinutes) => {
  if (totalMinutes < 0) return '0m';
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const OrderCard = ({ orderCode, data_inicio }) => {
  const [elapsedMinutes, setElapsedMinutes] = useState(() => calculateElapsedMinutes(data_inicio));

  useEffect(() => {
    // Define o valor inicial quando data_inicio muda
    setElapsedMinutes(calculateElapsedMinutes(data_inicio));

    // Se não houver data_inicio, não inicia o intervalo
    if (!data_inicio) {
      return;
    }

    // Atualiza o cronómetro a cada minuto (60000 ms)
    const intervalId = setInterval(() => {
      setElapsedMinutes(calculateElapsedMinutes(data_inicio));
    }, 60000);

    // Limpa o intervalo quando o componente é desmontado ou data_inicio muda
    return () => clearInterval(intervalId);

  }, [data_inicio]); // Re-executa o efeito se data_inicio mudar

  return (
    <div className="bg-blue-500 p-6 rounded-lg shadow-md text-white text-center flex flex-col justify-between items-center min-h-[150px] w-[300px]"> {/* Adicionado w-[300px] */}
      <div> {/* Container para Ordem */}
        <h3 className="text-lg font-semibold mb-1">Ordem Produção</h3>
        <p className="text-2xl font-bold break-all">{orderCode || 'N/A'}</p>
      </div>
      <div className="mt-2"> {/* Container para Tempo Decorrido */}
        <p className="text-sm">Tempo Decorrido:</p>
        <p className="text-xl font-semibold">
          {data_inicio ? formatElapsedTime(elapsedMinutes) : 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;