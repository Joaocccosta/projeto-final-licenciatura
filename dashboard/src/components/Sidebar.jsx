import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const Sidebar = ({ visible, toggle, selectedLinha }) => {
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState("");
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    // Buscar tipos de eventos da API quando o componente montar
    const fetchEventTypes = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch("/api/geteventtypes");
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar tipos de eventos: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.eventTypes && Array.isArray(data.eventTypes)) {
          setEventTypes(data.eventTypes);
        } else {
          throw new Error("Formato inesperado da API");
        }
      } catch (err) {
        console.error("Erro ao buscar tipos de eventos:", err);
        setError("Não foi possível carregar os tipos de eventos");
        // Manter uma lista vazia ou definir uma lista de fallback
        setEventTypes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventTypes();
  }, []);

  // Limpar mensagens de sucesso e erro após alguns segundos
  useEffect(() => {
    if (submitSuccess || submitError) {
      const timer = setTimeout(() => {
        setSubmitSuccess(false);
        setSubmitError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [submitSuccess, submitError]);

  const handleSubmit = async () => {
    // Verificar se os campos obrigatórios estão preenchidos
    if (!selectedEventType) {
      alert("Por favor, selecione um tipo de evento.");
      return;
    }

    if (!selectedLinha) {
      alert("Por favor, selecione uma linha antes de registrar um evento.");
      return;
    }

    setSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      // Enviar os valores brutos dos IDs sem prefixos
      const response = await fetch("/api/saveevent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          machineId: selectedLinha,      // Usar o ID da máquina diretamente
          eventTypeId: selectedEventType, // Usar o ID do evento diretamente
          comment: comment || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao salvar evento");
      }

      console.log("Evento registrado com sucesso:", data);
      setSubmitSuccess(true);
      
      // Resetar os campos após o envio bem-sucedido
      setComment("");
      setSelectedEventType("");
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      setSubmitError(error.message || "Erro ao salvar evento");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`transition-all duration-300 ${visible ? "w-85" : "w-0"} bg-gray-800 text-white border-l shadow h-full relative`}>
      {/* Botão visível sempre, logo abaixo do topo da sidebar */}
      <div className="p-2">
        <button onClick={toggle} className="absolute top-1/2 -translate-y-1/2 -left-10 bg-white text-gray-700 rounded-l px-1 py-2 shadow z-10">
          {visible ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {visible && (
        <div className="p-4">
          <div>
            <h2 className="text-lg font-semibold mb-4">Adicionar evento</h2>

            {!selectedLinha && (
              <div className="p-2 bg-yellow-600 text-white rounded mb-4">
                Selecione uma linha para registrar um evento
              </div>
            )}

            {submitSuccess && (
              <div className="p-2 bg-green-600 text-white rounded mb-4">
                Evento registrado com sucesso!
              </div>
            )}

            {submitError && (
              <div className="p-2 bg-red-600 text-white rounded mb-4">
                {submitError}
              </div>
            )}

            <label className="block mb-2 text-sm">Comentário:</label>
            <textarea
              className="w-full p-2 text-white rounded resize-none border-gray-300 bg-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Opcional"
              rows={6}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <label className="block mt-4 mb-2 text-sm">Tipo de incidente</label>
            {isLoading ? (
              <div className="py-2 text-gray-400">Carregando tipos de eventos...</div>
            ) : error ? (
              <div className="py-2 text-red-400">{error}</div>
            ) : (
              <select
                className="p-2 bg-gray-700 text-white w-full rounded border border-gray-600 focus:outline-none focus:border-blue-500"
                value={selectedEventType}
                onChange={(e) => setSelectedEventType(e.target.value)}
              >
                <option value="" className="text-gray-400">Selecione uma opção</option>
                {eventTypes.map((eventType) => (
                  <option 
                    key={eventType.id} 
                    value={eventType.id} 
                    className="bg-gray-700 text-white"
                  >
                    {eventType.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button 
            className={`mt-4 ${!selectedEventType || !selectedLinha || submitting 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600'} text-white font-bold py-2 px-4 rounded w-full`}
            onClick={handleSubmit}
            disabled={!selectedEventType || !selectedLinha || submitting}
          >
            {submitting ? "Enviando..." : "Confirmar"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;