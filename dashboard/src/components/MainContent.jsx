import { useEffect, useState } from "react";
import StateCard from './StateCard'; // Card para estado das partes
import OrderCard from './OrderCard'; // Card para número da ordem

const MainContent = () => {
  const [linhas, setLinhas] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [selectedLinha, setSelectedLinha] = useState("");
  const [cardsData, setCardsData] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    fetch("/api/getlines")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.lines && Array.isArray(data.lines)) {
          setLinhas(data.lines);
        } else {
          console.error("Formato inesperado da resposta da API (esperado { lines: [...] }):", data);
          setLinhas([]);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar linhas:", err);
        setLinhas([]);
      });

    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!selectedLinha) {
      setCardsData([]);
      setCurrentOrder(null);
      return;
    }

    const machine = linhas.find(l => String(l.id) === selectedLinha);
    if (!machine) {
      setCardsData([]);
      setCurrentOrder(null);
      return;
    }

    console.log(`Máquina selecionada: ${machine.nome}, Tipo: ${machine.tipo}`);

    const fetchOrder = async () => {
      try {
        // --- 1. Buscar Ordem de Produção ---
        const response = await fetch(`/api/getorder/${selectedLinha}`); // Chamada real
        if (!response.ok) throw new Error('Erro ao buscar ordem');
        const orderData = await response.json(); // { codigo_ordem: '...', data_inicio: '...' }

        setCurrentOrder(orderData); // Guarda ambos os dados

        // --- 2. Construir Cards de Estado das Partes ---
        const partStateCards = [];
        if (machine.tipo === 'rychiger') {
          if (machine.parte1_nome) partStateCards.push({ type: 'state', id: `${machine.id}-p1`, title: machine.parte1_nome, status: machine.estado_parte1 });
          if (machine.parte2_nome) partStateCards.push({ type: 'state', id: `${machine.id}-p2`, title: machine.parte2_nome, status: machine.estado_parte2 });
          if (machine.parte3_nome) partStateCards.push({ type: 'state', id: `${machine.id}-p3`, title: machine.parte3_nome, status: machine.estado_parte3 });
        } else {
          if (machine.parte1_nome) partStateCards.push({ type: 'state', id: `${machine.id}-p1`, title: machine.parte1_nome, status: machine.estado_parte1 });
        }
        if (partStateCards.length === 0 && machine.parte1_nome === null && machine.parte2_nome === null && machine.parte3_nome === null) {
          partStateCards.push({ type: 'state', id: `${machine.id}-no-parts`, title: "Máquina sem partes definidas", status: null });
        }

        // --- 3. Combinar Card da Ordem com Cards de Estado ---
        const orderCardData = {
          type: 'order',
          id: `${machine.id}-order`,
          orderCode: orderData.codigo_ordem,
          data_inicio: orderData.data_inicio // Passa a data de início
        };
        setCardsData([orderCardData, ...partStateCards]);

      } catch (error) {
        console.error("Erro ao buscar dados da ordem ou construir cards:", error);
        setCurrentOrder({ codigo_ordem: 'Erro', data_inicio: null }); // Indica erro
        setCardsData([{ type: 'order', id: `${machine.id}-order-error`, orderCode: 'Erro ao buscar', data_inicio: null }]);
      }
    };

    fetchOrder();

  }, [selectedLinha, linhas]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
    else if (element.msRequestFullscreen) element.msRequestFullscreen();
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  };

  return (
    <div className="pl-8 pt-4 pr-8 pb-4 relative h-full bg-white overflow-y-auto">
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <button onClick={handleRefresh} className="p-2 rounded hover:bg-gray-200" title="Refresh Page">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
        <button onClick={!isFullscreen ? enterFullscreen : exitFullscreen} className="p-2 rounded hover:bg-gray-200" title={!isFullscreen ? "Enter Fullscreen" : "Exit Fullscreen"}>
          {!isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 4H6v4m8 0V4h4m0 8v4h-4m-8 0H6v-4" />
            </svg>
          )}
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 mb-2 text-2xl font-bold">Linha</label>
        <select
          className="p-4 border-2 border-gray-300 rounded shadow-md w-72 text-base focus:outline-none focus:border-blue-500 text-black"
          value={selectedLinha}
          onChange={(e) => setSelectedLinha(e.target.value)}
        >
          <option value="">Selecione a Linha</option>
          {linhas.map((linha) => (
            <option key={linha.id} value={linha.id}>
              {linha.nome}
            </option>
          ))}
        </select>
      </div>

      {cardsData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cardsData.map((data) => {
            if (data.type === 'order') {
              return <OrderCard key={data.id} orderCode={data.orderCode} data_inicio={data.data_inicio} />;
            }
            if (data.type === 'state') {
              return <StateCard key={data.id} title={data.title} status={data.status} />;
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default MainContent;
