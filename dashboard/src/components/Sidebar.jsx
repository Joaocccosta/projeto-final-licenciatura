import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const Sidebar = ({ visible, toggle }) => {

  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    // Aqui simulas um fetch à base de dados
    const fetchOptions = async () => {
      // Substitui isto com um fetch real se quiseres
      const options = ["Erro", "Paragem técnica", "Manutenção", "Outro"];
      setDropdownOptions(options);
    };

    fetchOptions();
  }, []);

  return (
  <div className={`transition-all duration-300 ${visible ? "w-85" : "w-0"}  bg-gray-800 text-white border-l shadow h-full relative`}>
    {/* Botão visível sempre, logo abaixo do topo da sidebar */}
    <div className="p-2">
      <button onClick={toggle} className="absolute top-1/2 -translate-y-1/2 -left-10 bg-white text-white rounded-r px-1 py-2 shadow z-10">
        {visible ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>

    {visible && (
      <div className="p-4">
        <div>
            <h2 className="text-lg font-semibold mb-4">Adicionar evento</h2>

            <label className="block mb-2 text-sm">Comentário:</label>
            <textarea
              className="w-full p-2 text-white rounded resize-none border-gray-300 bg-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Opcional"
              rows={6}
            />

            <label className="block mt-4 mb-2 text-sm">Tipo de incidente</label>
            <select
              className="p-2 bg-gray-700 text-white w-full rounded border border-gray-600 focus:outline-none focus:border-blue-500"
              value={selectedOption}
              
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="" className="text-gray-400">Selecione uma opção</option>
              {dropdownOptions.map((opt, idx) => (
                <option key={idx} value={opt} className="bg-gray-700 text-white">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full">
            Confirmar
          </button>
      </div>
    )}
  </div>
);
}
export default Sidebar;