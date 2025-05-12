import { useEffect, useState, useRef } from "react";
import StateCard from './StateCard';
import OrderCard from './OrderCard';
import ProductionChartCard from './ProductionChartCard';
import CircularProgressCard from './CircularPogressChart';

const MainContent = () => {
  const [linhas, setLinhas] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [selectedLinha, setSelectedLinha] = useState("");
  const [cardsData, setCardsData] = useState([]);
  const [refreshTime, setRefreshTime] = useState(120); // Default 120 segundos
  const refreshIntervalRef = useRef(null);
  const [oeeData, setOeeData] = useState(null);

  // Buscar o tempo de refresh da API quando o componente montar
  useEffect(() => {
    fetch("/api/getRefresh")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.refreshSeconds) {
          console.log(`Tempo de refresh obtido: ${data.refreshSeconds} segundos`);
          setRefreshTime(data.refreshSeconds);
        } else {
          console.warn("Formato inesperado da API (getRefresh), usando padrão:", data);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar tempo de refresh:", err);
      });

    fetch("/api/getlines")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.lines && Array.isArray(data.lines)) {
          setLinhas(data.lines);
        } else {
          console.error("Formato inesperado da API (getlines):", data);
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
      
      // Limpar o intervalo quando o componente for desmontado
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  // Função para buscar dados da API
  const fetchData = async () => {
    if (!selectedLinha) return;
    
    const machine = linhas.find(l => String(l.id) === selectedLinha);
    if (!machine) return;

    console.log(`Atualizando dados para: ${machine.name}, Tipo: ${machine.tipo}`);

    const newCards = [];
    let hourlyProductionData = [];

    // Buscar dados de OEE
    try {
      const oeeResponse = await fetch(`/api/getoee/${selectedLinha}`);
      
      if (!oeeResponse.ok) {
        throw new Error(`Erro ao buscar OEE: ${oeeResponse.status}`);
      }
      
      const oeeResult = await oeeResponse.json();
      
      if (!oeeResult.success) {
        throw new Error(`API retornou erro: ${oeeResult.message}`);
      }
      
      const data = oeeResult.data;
      setOeeData(data);
      
      // 1. Order Card
      if (data.order && data.order.orderNumber) {
        newCards.push({
          type: 'order',
          id: `${machine.id}-order`,
          orderCode: data.order.orderNumber,
          status: data.order.status
        });
      } else {
        newCards.push({
          type: 'order',
          id: `${machine.id}-no-order`,
          orderCode: 'Sem Ordem',
          status: 'Sem Trabalho'
        });
      }
      
      // 2. State Cards
      const production = data.production || {};
      
      // Determinar tipo de máquina a partir dos dados
      if (production.units) {
        // Máquina de unidades simples
        newCards.push({
          type: 'state',
          id: `${machine.id}-units`,
          title: 'Unidades',
          status: production.units.state
        });
      } else if (production.capsules) {
        // Máquina de cápsulas + caixas
        newCards.push({
          type: 'state',
          id: `${machine.id}-capsules`,
          title: 'Linha de Cápsulas',
          status: production.capsules.state
        });
        
        if (production.box10) {
          newCards.push({
            type: 'state',
            id: `${machine.id}-box10`,
            title: 'Embalagem Caixa 10',
            status: production.box10.state
          });
        }
        
        if (production.box24) {
          newCards.push({
            type: 'state',
            id: `${machine.id}-box24`,
            title: 'Embalagem Caixa 24',
            status: production.box24.state
          });
        }
      }
      
      // 3. OEE Cards (Indicadores)
      const oee = data.oee || {};

      // Função auxiliar para processar o valor OEE
      const processOeeValue = (value) => {
        // Se for uma string (como "83.00"), converter para número
        if (typeof value === 'string') {
          return Math.min(parseFloat(value), 100);
        }
        // Se for um número, usar diretamente (já é um percentual)
        else if (typeof value === 'number') {
          return Math.min(value, 100);
        }
        // Valor inválido ou indefinido
        return 0;
      };

      if (oee.units) {
        // Para máquinas de unidades
        newCards.push({
          type: 'oee',
          id: `${machine.id}-oee-units`,
          title: 'OEE Unidades',
          percentage: processOeeValue(oee.units.total),
          expected: 75 // Valor esperado padrão
        });
      } else if (oee.capsules) {
        // Para máquinas de cápsulas
        newCards.push({
          type: 'oee',
          id: `${machine.id}-oee-capsules`,
          title: 'OEE Cápsulas',
          percentage: processOeeValue(oee.capsules.total),
          expected: 75
        });
        
        if (oee.box10) {
          newCards.push({
            type: 'oee',
            id: `${machine.id}-oee-box10`,
            title: 'OEE Caixa 10',
            percentage: processOeeValue(oee.box10.total),
            expected: 75
          });
        }
        
        if (oee.box24) {
          newCards.push({
            type: 'oee',
            id: `${machine.id}-oee-box24`,
            title: 'OEE Caixa 24',
            percentage: processOeeValue(oee.box24.total),
            expected: 75
          });
        }
      }
      
      // 4. Production Chart Data
      if (data.hourlyProduction && data.hourlyProduction.length > 0) {
        hourlyProductionData = data.hourlyProduction.map(item => {
          // Extrair apenas hora e minuto se o formato for datetime completo
          let timeInterval = '00:00';
          if (item.hourStart) {
            // Se for um formato ISO completo (2025-05-12T08:00:00)
            if (item.hourStart.includes('T')) {
              const timePart = item.hourStart.split('T')[1];
              timeInterval = timePart.substring(0, 5); // Pegar apenas HH:MM
            } 
            // Se for apenas hora (08:00:00)
            else if (item.hourStart.includes(':')) {
              timeInterval = item.hourStart.substring(0, 5); // Pegar apenas HH:MM
            }
            // Caso seja formato com data+hora (2025-05-10 16:00:00)
            else if (item.hourStart.includes('-') && item.hourStart.includes(' ')) {
              const parts = item.hourStart.split(' ');
              if (parts.length > 1) {
                timeInterval = parts[1].substring(0, 5); // Pegar apenas HH:MM
              }
            }
            // Caso contrário, usar como está
            else {
              timeInterval = item.hourStart;
            }
          }
          
          return {
            intervalo: timeInterval,
            part: item.part || 'Unidades', // Nome da parte (Capsules, Box10, Box24, etc.)
            produzido: item.units || 0
          };
        });
      }
      
    } catch (error) {
      console.error("Erro ao buscar dados de OEE:", error);
      // Fallback se a API falhar - Adiciona uma ordem vazia e uma mensagem de erro
      newCards.push({
        type: 'order',
        id: `${machine.id}-order-error`,
        orderCode: 'Erro ao carregar dados',
        status: 'Erro'
      });
    }
    
    // 5. Production Chart Card - sempre adicionar, mesmo que vazio
    newCards.push({
      type: 'productionChart',
      id: `${machine.id}-hourly-prod-chart`,
      hourlyProductionData: hourlyProductionData
    });
    
    // Atualizar os cards
    setCardsData(newCards);
  };

  // Configurar/limpar o intervalo quando a linha selecionada mudar
  useEffect(() => {
    // Limpar qualquer intervalo anterior
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    // Buscar dados imediatamente
    fetchData();
    
    // Configurar um novo intervalo se uma linha estiver selecionada
    if (selectedLinha) {
      console.log(`Configurando auto-refresh a cada ${refreshTime} segundos`);
      refreshIntervalRef.current = setInterval(fetchData, refreshTime * 1000);
    }

    // Limpar o intervalo quando o componente for desmontado ou a linha mudar
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [selectedLinha, refreshTime, linhas]);

  const handleRefresh = () => {
    fetchData(); // Atualiza os dados sem recarregar a página
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
        <button onClick={handleRefresh} className="p-2 rounded hover:bg-gray-200" title="Atualizar dados">
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
          style={{ color: 'black' }}
        >
          <option value="" style={{ color: 'black' }}>Selecione a Linha</option>
          {linhas.map((linha) => (
            <option key={linha.id} value={linha.id} style={{ color: 'black' }}>
              {linha.name}
            </option>
          ))}
        </select>
        {selectedLinha && (
          <div className="mt-2 text-sm text-gray-600">
            Atualização automática a cada {refreshTime} segundos
          </div>
        )}
      </div>

      {cardsData.length > 0 && (
        <div className="flex flex-wrap gap-8">
          {cardsData.map((cardInfo) => {
            if (!cardInfo) return null;

            if (cardInfo.type === 'order') {
              return <OrderCard key={cardInfo.id} orderCode={cardInfo.orderCode} status={cardInfo.status} />;
            }
            if (cardInfo.type === 'productionChart') {
              return <ProductionChartCard key={cardInfo.id} hourlyProductionData={cardInfo.hourlyProductionData} />;
            }
            if (cardInfo.type === 'state') {
              return <StateCard key={cardInfo.id} title={cardInfo.title} status={cardInfo.status} />;
            }
            if (cardInfo.type === 'oee') {
              return <CircularProgressCard key={cardInfo.id} title={cardInfo.title} percentage={cardInfo.percentage} expected={cardInfo.expected} />;
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default MainContent;
