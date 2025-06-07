import { ChevronLeft, ChevronRight, X, Clock } from "lucide-react";
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
  const [activeEvents, setActiveEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState(null);

  // Fetch event types
  useEffect(() => {
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
        setEventTypes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventTypes();
  }, []);

  // Fetch active events for the selected machine
  const fetchActiveEvents = async () => {
    if (!selectedLinha) {
      setActiveEvents([]);
      return;
    }
    
    setLoadingEvents(true);
    setEventsError(null);
    
    try {
      const response = await fetch(`/api/getactiveevents?machineId=${selectedLinha}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar eventos ativos: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.success && data.events && Array.isArray(data.events)) {
        setActiveEvents(data.events);
      } else {
        throw new Error("Formato inesperado da API");
      }
    } catch (err) {
      console.error("Erro ao buscar eventos ativos:", err);
      setEventsError("Não foi possível carregar os eventos ativos");
      setActiveEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Initial fetch of active events and refresh when sidebar is visible or selected machine changes
  useEffect(() => {
    if (visible && selectedLinha) {
      fetchActiveEvents();
    }
  }, [visible, selectedLinha, submitSuccess]);

  // Clear success/error messages after a timeout
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
    // Verify required fields
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
      const response = await fetch("/api/saveevent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          machineId: selectedLinha,
          eventTypeId: selectedEventType,
          comment: comment || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao salvar evento");
      }

      console.log("Evento registrado com sucesso:", data);
      setSubmitSuccess(true);
      
      // Reset fields after successful submission
      setComment("");
      setSelectedEventType("");
      
      // Refresh the active events list
      fetchActiveEvents();
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      setSubmitError(error.message || "Erro ao salvar evento");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle closing an event
  const handleCloseEvent = async (eventId) => {
    try {
      const response = await fetch("/api/closeevent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: eventId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao fechar evento");
      }

      console.log("Evento fechado com sucesso:", data);
      
      // Refresh the active events list
      fetchActiveEvents();
    } catch (error) {
      console.error("Erro ao fechar evento:", error);
      alert("Erro ao fechar evento: " + (error.message || "Erro desconhecido"));
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`transition-all duration-300 ${visible ? "w-85" : "w-0"} bg-gray-800 text-white border-l shadow h-full relative`}>
      <div className="p-2">
        <button onClick={toggle} className="absolute top-1/2 -translate-y-1/2 -left-10 bg-white text-gray-700 rounded-l px-1 py-2 shadow z-10 border border-black">
          {visible ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {visible && (
        <div className="p-4 overflow-y-auto h-full flex flex-col">
          {/* Add event section */}
          <div className="mb-6">
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

          {/* Divider */}
          <div className="border-t border-gray-600 my-6"></div>

          {/* Active events section */}
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-4">
              Eventos ativos {selectedLinha ? `da linha selecionada` : ''}
            </h2>
            
            {!selectedLinha ? (
              <div className="py-2 text-yellow-400">Selecione uma linha para ver os eventos ativos</div>
            ) : loadingEvents ? (
              <div className="py-2 text-gray-400">Carregando eventos ativos...</div>
            ) : eventsError ? (
              <div className="py-2 text-red-400">{eventsError}</div>
            ) : activeEvents.length === 0 ? (
              <div className="py-2 text-gray-400">Não há eventos ativos para esta linha</div>
            ) : (
              <div className="space-y-4">
                {activeEvents.map((event) => (
                  <div 
                    key={event.eventid} 
                    className="bg-gray-700 rounded-lg p-3 relative"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-medium truncate pr-8">
                        {event.task_name || 'Evento sem nome'}
                      </div>
                      <button 
                        onClick={() => handleCloseEvent(event.eventid)}
                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded absolute top-2 right-2"
                        title="Fechar evento"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M5.478 5.559A1.5 1.5 0 0 1 6.912 4.5H9A.75.75 0 0 0 9 3H6.912a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H15a.75.75 0 0 0 0 1.5h2.088a1.5 1.5 0 0 1 1.434 1.059l2.213 7.191H17.89a3 3 0 0 0-2.684 1.658l-.256.513a1.5 1.5 0 0 1-1.342.829h-3.218a1.5 1.5 0 0 1-1.342-.83l-.256-.512a3 3 0 0 0-2.684-1.658H3.265l2.213-7.191Z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v6.44l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 1.06-1.06l1.72 1.72V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Exibição da data e hora de início */}
                    <div className="text-sm text-gray-300 flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>Início: {formatTimestamp(event.startdatetime)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;