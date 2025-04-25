import { useEffect, useState } from "react";

const MainContent = () => {
  const [linhas, setLinhas] = useState([]);

  useEffect(() => {
    fetch("/api/linhas")
      .then((res) => res.json())
      .then((data) => setLinhas(data))
      .catch((err) => console.error("Erro ao carregar linhas:", err));
  }, []);

  return (
    <div className="pl-8 pt-4 pr-8 pb-4">
      <label className="block text-gray-700 mb-2 text-2xl font-bold">Linha</label>
      <select className="p-4 border-2 border-gray-300 rounded shadow-md w-72 text-base focus:outline-none focus:border-blue-500 text-black">
        <option value="">Selecione a Linha</option>
        {linhas.map((linha) => (
          <option key={linha.id} value={linha.id}>
            {linha.nome}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MainContent;
