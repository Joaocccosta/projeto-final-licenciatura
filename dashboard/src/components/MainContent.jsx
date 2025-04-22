const MainContent = () => (
    <div className="pl-8 pt-4 pr-8 pb-4">
      <label className="block text-gray-700 mb-2 text-2xl font-bold">Linha</label>
      <select className="p-4 border-2 border-gray-300 rounded shadow-md w-72 text-base focus:outline-none focus:border-blue-500 text-black" defaultValue="">
        <option value="" >Selecione a Linha</option>
        {/* Adiciona mais opções aqui */}
      </select>
    </div>
  );
  
  export default MainContent;