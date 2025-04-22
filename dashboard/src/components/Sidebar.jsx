import { ChevronLeft, ChevronRight } from "lucide-react";

const Sidebar = ({ visible, toggle }) => {
  return (
    <div 
      className={`relative transition-all duration-300 h-full ${visible ? 'w-64' : 'w-0'} overflow-hidden`}
    >
      {/* Sidebar container */}
      <div className="absolute top-0 left-0 w-64 h-full bg-black shadow p-4 text-white">
        {/* Sidebar content */}
        <p>Sidebar</p>
      </div>
      
      {/* Toggle button - attached to the sidebar edge */}
      <button
        onClick={toggle}
        className="absolute top-10 -ml-0 bg-white text-gray-700 rounded-r p-1 shadow-md z-10"
      >
        {visible ? <ChevronLeft /> : <ChevronRight />}
      </button>
    </div>
  );
};

export default Sidebar;