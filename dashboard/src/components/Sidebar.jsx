import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = ({ visible, toggle }) => (
  <div className={`transition-all duration-300 ${visible ? "w-75" : "w-0"}  bg-gray-800 text-white border-l shadow h-full relative`}>
    {/* Botão visível sempre, logo abaixo do topo da sidebar */}
    <div className="p-2">
      <button onClick={toggle} className="absolute top-1/2 -translate-y-1/2 -left-10 bg-white text-white rounded-r px-1 py-2 shadow z-10">
        {visible ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>

    {visible && (
      <div className="p-4">
        <p className="text-sm">Sidebar</p>
      </div>
    )}
  </div>
);

export default Sidebar;